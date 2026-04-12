export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';

import { sendShareArticleEmail } from '@/lib/share-email';

// Simple in-memory rate limiter: max 5 shares per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup stale entries periodically (every 100 requests)
let requestCount = 0;
function maybeCleanup() {
  if (++requestCount % 100 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

const shareSchema = z.object({
  friendEmail: z.string().email(),
  senderEmail: z.string().email(),
  articleTitle: z.string().min(1).max(200),
  articleDescription: z.string().max(500).default(''),
  articleUrl: z.string().url(),
  // Honeypot
  website: z.string().optional(),
});

/**
 * POST /api/share-article
 * Send an article recommendation email to a friend
 */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    maybeCleanup();

    const body = await request.json();

    const parseResult = shareSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid input',
          details: parseResult.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = parseResult.data;

    // Honeypot check — silently succeed
    if (data.website) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Don't allow sending to yourself
    if (data.friendEmail.toLowerCase() === data.senderEmail.toLowerCase()) {
      return new Response(
        JSON.stringify({ success: false, error: "Enter your friend's email, not your own." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate the article URL is actually on our domain
    try {
      const url = new URL(data.articleUrl);
      if (!url.hostname.endsWith('firsthomeguide.ca') && !url.hostname.includes('localhost')) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid article URL' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid article URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limit
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "You've shared several articles recently. Please wait a bit before sharing more.",
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await sendShareArticleEmail({
      friendEmail: data.friendEmail,
      senderEmail: data.senderEmail,
      articleTitle: data.articleTitle,
      articleDescription: data.articleDescription,
      articleUrl: data.articleUrl,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Share article error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to send email. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
