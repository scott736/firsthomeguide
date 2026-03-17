import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams) {
  const resend = getResend();
  const { to, subject, html, text, replyTo } = params;

  await resend.emails.send({
    from: 'FirstHomeGuide.ca <noreply@firsthomeguide.ca>',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo,
  });
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
