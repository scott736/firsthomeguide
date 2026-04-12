export const prerender = false;

import type { APIRoute } from 'astro';

import { getAvailability, isNylasConfigured } from '@/lib/nylas/client';
import { getServiceById, getTeamMemberById, schedulingConfig } from '@/lib/nylas/config';
import { getPendingBookingsForTimeRange } from '@/lib/nylas/pending-bookings';
import type { AvailabilityRequest, DayAvailability, TimeSlot } from '@/lib/nylas/types';
import { isSupabaseConfigured } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Server-side availability cache (Upstash Redis)
// Caches raw Nylas availability responses to avoid the slow API call on
// repeat visits. Survives cold starts (unlike in-memory caches).
// ---------------------------------------------------------------------------

const AVAILABILITY_CACHE_TTL = 300; // 5 minutes

let _redisCacheClient: Promise<InstanceType<typeof import('@upstash/redis').Redis> | null> | null = null;

function getRedisCacheClient() {
  if (_redisCacheClient) return _redisCacheClient;
  const url = import.meta.env.UPSTASH_REDIS_REST_URL
    || (typeof process !== 'undefined' ? process.env.UPSTASH_REDIS_REST_URL : undefined);
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN
    || (typeof process !== 'undefined' ? process.env.UPSTASH_REDIS_REST_TOKEN : undefined);
  if (!url || !token) {
    _redisCacheClient = Promise.resolve(null);
    return _redisCacheClient;
  }
  _redisCacheClient = import('@upstash/redis')
    .then(({ Redis }) => new Redis({ url, token }))
    .catch(() => null);
  return _redisCacheClient;
}

async function getCachedSlots(key: string): Promise<TimeSlot[] | null> {
  try {
    const redis = await getRedisCacheClient();
    if (!redis) return null;
    const data = await redis.get<TimeSlot[]>(key);
    return data ?? null;
  } catch {
    return null;
  }
}

function setCachedSlots(key: string, slots: TimeSlot[]): void {
  // Fire-and-forget — don't block the response
  getRedisCacheClient()
    .then((redis) => {
      if (redis) redis.set(key, slots, { ex: AVAILABILITY_CACHE_TTL }).catch(() => {});
    })
    .catch(() => {});
}

/**
 * POST /api/nylas/availability
 * Get available time slots for a service
 *
 * Body: AvailabilityRequest
 * Response: { slots: TimeSlot[], days: DayAvailability[] }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isNylasConfigured()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Scheduling is not available' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await request.json()) as AvailabilityRequest & { duration?: number };
    const { serviceId, teamMemberId, startDate, endDate, timezone, duration } = body;

    // Validate required fields
    if (!serviceId || !startDate || !endDate || !timezone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'serviceId, startDate, endDate, and timezone are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate service exists
    const service = getServiceById(serviceId);
    if (!service) {
      return new Response(JSON.stringify({ success: false, error: 'Service not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate team member if specified
    if (teamMemberId) {
      const teamMember = getTeamMemberById(teamMemberId);
      if (!teamMember) {
        return new Response(JSON.stringify({ success: false, error: 'Team member not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // Check relationship in both directions:
      // - service lists the team member (main booking page services), OR
      // - team member lists the service (profile-only services like strategy-call)
      const memberOffersService = teamMember.services.includes(serviceId);
      if (!service.teamMembers.includes(teamMemberId) && !memberOffersService) {
        return new Response(
          JSON.stringify({ success: false, error: 'Team member does not offer this service' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // Check minimum notice
    const minNoticeTime = new Date(
      now.getTime() + schedulingConfig.minimumNotice * 60 * 60 * 1000
    );
    if (start < minNoticeTime) {
      start.setTime(minNoticeTime.getTime());
    }

    // Check maximum advance booking
    const maxAdvanceTime = new Date(
      now.getTime() + schedulingConfig.maxAdvanceBooking * 24 * 60 * 60 * 1000
    );
    if (end > maxAdvanceTime) {
      end.setTime(maxAdvanceTime.getTime());
    }

    // Start pending bookings query in parallel with cache/Nylas
    const pendingBookingsPromise = teamMemberId && isSupabaseConfigured()
      ? getPendingBookingsForTimeRange(teamMemberId, start.toISOString(), end.toISOString())
      : null;

    // Build cache key — works for both specific team member and round-robin requests
    const adjustedStart = start.toISOString().split('T')[0];
    const adjustedEnd = end.toISOString().split('T')[0];
    const effectiveDuration = duration ?? service.duration;
    const cacheKey = teamMemberId
      ? `avail:v1:${teamMemberId}:${serviceId}:${effectiveDuration}:${adjustedStart}:${adjustedEnd}`
      : `avail:v1:rr:${serviceId}:${effectiveDuration}:${adjustedStart}:${adjustedEnd}`;

    // Try server-side cache first (~50ms vs ~5-10s Nylas API call)
    const cachedSlots = cacheKey ? await getCachedSlots(cacheKey) : null;

    const rawSlots = cachedSlots ?? await getAvailability({
      serviceId,
      teamMemberId,
      startDate: adjustedStart,
      endDate: adjustedEnd,
      timezone,
      duration,
    });

    // Cache miss -> store for subsequent requests (fire-and-forget)
    if (cacheKey && !cachedSlots && rawSlots.length > 0) {
      setCachedSlots(cacheKey, rawSlots);
    }

    // Apply buffer times: increase effective duration so Nylas returns fewer, properly-spaced slots.
    // Buffer enforcement on the raw slots: filter out slots that are too close to each other.
    const bufferBefore = (service.bufferBefore || 0) * 60 * 1000;
    const bufferAfter = (service.bufferAfter || 0) * 60 * 1000;

    // Filter out slots that conflict with pending (unconfirmed) bookings
    // This prevents double-booking when someone hasn't confirmed yet
    let slots: TimeSlot[] = rawSlots;

    if (rawSlots.length > 0 && isSupabaseConfigured()) {
      const pendingBookingsMap = new Map<
        string,
        Array<{ startTime: Date; endTime: Date }>
      >();

      if (pendingBookingsPromise) {
        // We already started fetching for the known team member in parallel
        const pending = await pendingBookingsPromise;
        pendingBookingsMap.set(teamMemberId!, pending);
      } else {
        // Multiple team members — fetch for each one from the results
        const teamMemberIds = [...new Set(rawSlots.map((s) => s.teamMemberId))];
        await Promise.all(
          teamMemberIds.map(async (memberId) => {
            const pending = await getPendingBookingsForTimeRange(
              memberId,
              start.toISOString(),
              end.toISOString()
            );
            pendingBookingsMap.set(memberId, pending);
          })
        );
      }

      // Filter slots - remove any that overlap with pending bookings (including buffer times)
      slots = rawSlots.filter((slot) => {
        const pendingForMember = pendingBookingsMap.get(slot.teamMemberId) || [];
        const slotStart = new Date(slot.startTime).getTime() - bufferBefore;
        const slotEnd = new Date(slot.endTime).getTime() + bufferAfter;

        // Check if this slot (with buffers) overlaps with any pending booking (with buffers)
        const hasConflict = pendingForMember.some((pending) => {
          const pendingStart = pending.startTime.getTime() - bufferBefore;
          const pendingEnd = pending.endTime.getTime() + bufferAfter;
          return slotStart < pendingEnd && slotEnd > pendingStart;
        });

        return !hasConflict;
      });
    }

    // Group slots by day in the user's timezone for correct date boundaries
    const dayMap = new Map<string, DayAvailability>();

    for (const slot of slots) {
      const dateKey = new Date(slot.startTime).toLocaleDateString('en-CA', { timeZone: timezone });

      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          date: dateKey,
          slots: [],
          hasAvailability: false,
        });
      }

      const day = dayMap.get(dateKey)!;
      day.slots.push(slot);
      day.hasAvailability = true;
    }

    // Sort days chronologically
    const days = Array.from(dayMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          slots,
          days,
          service: {
            id: service.id,
            name: service.name,
            duration: service.duration,
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=120, stale-while-revalidate=60',
          ...(cachedSlots ? { 'X-Cache': 'HIT' } : {}),
        },
      }
    );
  } catch (error) {
    console.error('Availability error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get availability',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
