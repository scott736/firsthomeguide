const ELASTIC_EMAIL_API_KEY = import.meta.env.ELASTIC_EMAIL_API_KEY
  || (typeof process !== 'undefined' ? process.env.ELASTIC_EMAIL_API_KEY : undefined);

const FROM_ADDRESS = 'FirstHomeGuide.ca <bookings@firsthomeguide.ca>';
const BASE_URL = 'https://api.elasticemail.com/v4';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams) {
  if (!ELASTIC_EMAIL_API_KEY) {
    throw new Error('ELASTIC_EMAIL_API_KEY environment variable is not set');
  }

  const { to, subject, html, text, replyTo } = params;
  const recipients = Array.isArray(to) ? to : [to];

  const bodyParts: { ContentType: string; Content: string; Charset: string }[] = [
    { ContentType: 'HTML', Content: html, Charset: 'UTF-8' },
  ];
  if (text) {
    bodyParts.push({ ContentType: 'PlainText', Content: text, Charset: 'UTF-8' });
  }

  const content: Record<string, unknown> = {
    Body: bodyParts,
    From: FROM_ADDRESS,
    Subject: subject,
  };
  if (replyTo) {
    content.ReplyTo = replyTo;
  }

  const reqHeaders = {
    'Content-Type': 'application/json',
    'X-ElasticEmail-ApiKey': ELASTIC_EMAIL_API_KEY,
  };
  const reqBody = JSON.stringify({
    Recipients: { To: recipients },
    Content: content,
  });

  let response = await fetch(`${BASE_URL}/emails/transactional`, {
    method: 'POST',
    headers: reqHeaders,
    body: reqBody,
  });

  if (response.status >= 500) {
    await new Promise((r) => setTimeout(r, 1000));
    response = await fetch(`${BASE_URL}/emails/transactional`, {
      method: 'POST',
      headers: reqHeaders,
      body: reqBody,
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Elastic Email send error:', errorText);
    throw new Error(`Elastic Email send failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
