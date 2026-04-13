export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';

import { escapeHtml, sendEmail } from '@/lib/email';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

let requestCount = 0;
function maybeCleanup() {
  if (++requestCount % 100 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  topic: z.enum(['general', 'content', 'partnership', 'bug', 'privacy']),
  message: z.string().min(10).max(5000),
  website: z.string().optional(),
});

const TOPIC_LABELS: Record<string, string> = {
  general: 'General question',
  content: 'Content correction / suggestion',
  partnership: 'Partnership or media enquiry',
  bug: 'Bug report / technical issue',
  privacy: 'Privacy / data request',
};

const CONTACT_INBOX =
  import.meta.env.CONTACT_INBOX
  || (typeof process !== 'undefined' ? process.env.CONTACT_INBOX : undefined)
  || 'bookings@firsthomeguide.ca';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    maybeCleanup();

    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid input',
          details: parseResult.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = parseResult.data;

    if (data.website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Too many messages from this address. Please try again later.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.email);
    const safeTopic = escapeHtml(TOPIC_LABELS[data.topic] || data.topic);
    const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

    await sendEmail({
      to: CONTACT_INBOX,
      replyTo: data.email,
      subject: `[Contact] ${TOPIC_LABELS[data.topic] || data.topic} — ${data.name}`,
      html: `
        <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
        <p><strong>Topic:</strong> ${safeTopic}</p>
        <hr>
        <p>${safeMessage}</p>
      `,
      text: `From: ${data.name} <${data.email}>\nTopic: ${TOPIC_LABELS[data.topic] || data.topic}\n\n${data.message}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send message. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
