/**
 * Share Article Email Template
 * Sends a branded article recommendation email with LendCity CTA
 */

import { sendEmail, escapeHtml } from '@/lib/email';
import { LENDCITY } from '@/lib/lendcity';

// Brand colors (matching booking emails)
const BRAND_COLOR = '#7c3aed';
const BRAND_COLOR_DARK = '#6d28d9';
const LOGO_URL = 'https://firsthomeguide.ca/images/lendcity-logo.webp';
const SITE_URL = 'https://firsthomeguide.ca';

const OFFICE_PHONE = LENDCITY.phone;
const OFFICE_PHONE_TEL = `tel:${LENDCITY.phone.replace(/\D/g, '')}`;
const OFFICE_ADDRESS = `${LENDCITY.streetAddress}, ${LENDCITY.city}, ${LENDCITY.province}, ${LENDCITY.postalCode}`;

interface ShareArticleEmailParams {
  friendEmail: string;
  senderEmail: string;
  articleTitle: string;
  articleDescription: string;
  articleUrl: string;
}

export async function sendShareArticleEmail(params: ShareArticleEmailParams) {
  const { friendEmail, senderEmail, articleTitle, articleDescription, articleUrl } = params;

  const safeTitle = escapeHtml(articleTitle);
  const safeDescription = escapeHtml(articleDescription);
  const safeSender = escapeHtml(senderEmail);

  const subject = `${senderEmail} shared: ${articleTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; background-color: #ffffff;">
              <a href="${SITE_URL}" style="display: inline-block;">
                <img src="${LOGO_URL}" alt="FirstHomeGuide.ca" width="160" style="max-width: 160px; height: auto;" />
              </a>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_COLOR}; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                Your friend thought you&rsquo;d find this helpful
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                <strong>${safeSender}</strong> shared an article from First Home Guide with you:
              </p>

              <!-- Article Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 8px; font-size: 18px; color: #111827; font-weight: 600;">
                      ${safeTitle}
                    </h2>
                    <p style="margin: 0 0 20px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                      ${safeDescription}
                    </p>
                    <a href="${articleUrl}" style="display: inline-block; background-color: ${BRAND_COLOR_DARK}; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                      Read the Article
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Explore More -->
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                First Home Guide is a free resource covering everything first-time home buyers in Canada need to know &mdash; from saving for a down payment to closing day.
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="${SITE_URL}/guide/welcome/" style="color: ${BRAND_COLOR_DARK}; font-weight: 500;">Explore the full guide &rarr;</a>
              </p>
            </td>
          </tr>

          <!-- LendCity CTA -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border-radius: 8px; border: 1px solid #e9d5ff;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #581c87;">
                      Ready to talk to a mortgage expert?
                    </p>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #7e22ce; line-height: 1.4;">
                      LendCity Mortgages offers free, no-obligation consultations for first-time home buyers.
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 12px;">
                          <a href="${SITE_URL}/book-a-call" style="display: inline-block; background-color: ${BRAND_COLOR_DARK}; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
                            Book a Free Call
                          </a>
                        </td>
                        <td>
                          <a href="${OFFICE_PHONE_TEL}" style="display: inline-block; color: ${BRAND_COLOR_DARK}; font-size: 14px; font-weight: 500; text-decoration: none; padding: 10px 0;">
                            or call ${OFFICE_PHONE}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">
                This email was sent because ${safeSender} thought you&rsquo;d enjoy this article.
                You will not receive further emails unless you sign up.
              </p>
              <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af;">
                FirstHomeGuide.ca &mdash; Powered by LendCity &middot; Mortgage Architects &middot; FSRA Brokerage Licence #12728
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                ${OFFICE_PHONE} &middot; ${OFFICE_ADDRESS}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Your friend (${senderEmail}) shared an article from First Home Guide with you:

${articleTitle}
${articleDescription}

Read it here: ${articleUrl}

---

First Home Guide is a free resource for first-time home buyers in Canada.
Explore the full guide: ${SITE_URL}/guide/welcome/

---

Ready to talk to a mortgage expert?
LendCity Mortgages offers free, no-obligation consultations.
Book a free call: ${SITE_URL}/book-a-call
Or call: ${OFFICE_PHONE}

---
This email was sent because ${senderEmail} thought you'd enjoy this article.
You will not receive further emails unless you sign up.
FirstHomeGuide.ca — Powered by LendCity · Mortgage Architects · FSRA Brokerage Licence #12728
${OFFICE_PHONE} · ${OFFICE_ADDRESS}
  `.trim();

  await sendEmail({
    to: friendEmail,
    subject,
    html,
    text,
    replyTo: senderEmail,
  });
}
