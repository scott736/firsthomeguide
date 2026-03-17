/**
 * Booking Email Templates
 * Email notifications for the scheduling system
 */

import { sendEmail, escapeHtml } from '@/lib/email';

// Brand colors
const BRAND_COLOR = '#7c3aed'; // FirstHomeGuide purple
const BRAND_COLOR_DARK = '#6d28d9'; // Darker for buttons/links
const BRAND_COLOR_LIGHT = '#a78bfa'; // Lighter for backgrounds

// Logo URL (must be absolute for emails)
// Note: Using PNG for email compatibility (WebP not widely supported in email clients)
const LOGO_URL = 'https://firsthomeguide.ca/images/lendcity-logo.webp';

interface BookingConfirmationEmailParams {
  to: string;
  guestName: string;
  serviceName: string;
  serviceDuration: number;
  teamMemberName: string;
  startTime: Date;
  timezone: string;
  confirmUrl: string;
  expiresAt: Date;
}

/**
 * Send booking confirmation email (requires user to click to confirm)
 */
export async function sendBookingConfirmationEmail(params: BookingConfirmationEmailParams) {
  const {
    to,
    guestName,
    serviceName,
    serviceDuration,
    teamMemberName,
    startTime,
    timezone,
    confirmUrl,
    expiresAt,
  } = params;

  const formattedDate = startTime.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  const formattedTime = startTime.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  const expiresFormatted = expiresAt.toLocaleString('en-CA', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  // Use team member name in subject
  const subject = `Confirm Your ${serviceName} with ${teamMemberName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; background-color: #ffffff;">
              <a href="https://firsthomeguide.ca" style="display: inline-block;">
                <img src="${LOGO_URL}" alt="FirstHomeGuide.ca" width="160" style="max-width: 160px; height: auto;" />
              </a>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_COLOR}; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Confirm Your Booking
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
                Hi ${escapeHtml(guestName)},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                Thank you for scheduling a <strong>${escapeHtml(serviceName)}</strong> with ${escapeHtml(teamMemberName)}.
                Please confirm your booking by clicking the button below.
              </p>

              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                      Booking Details
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Service</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${serviceName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Duration</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${serviceDuration} minutes</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">With</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${teamMemberName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Date</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Time</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${formattedTime} (${timezone})</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="${confirmUrl}" style="display: inline-block; background-color: ${BRAND_COLOR_DARK}; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                      Confirm My Booking
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      <strong>Important:</strong> This confirmation link expires on ${expiresFormatted}.
                      If you don't confirm by then, you'll need to book again.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; font-size: 14px; color: #6b7280;">
                If you didn't request this booking, you can safely ignore this email.
              </p>

              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmUrl}" style="color: ${BRAND_COLOR_DARK}; word-break: break-all;">${confirmUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                ${teamMemberName}
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                FirstHomeGuide.ca &mdash; Powered by LendCity
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
Hi ${guestName},

Thank you for scheduling a ${serviceName} with ${teamMemberName}.

BOOKING DETAILS:
- Service: ${serviceName}
- Duration: ${serviceDuration} minutes
- With: ${teamMemberName}
- Date: ${formattedDate}
- Time: ${formattedTime} (${timezone})

Please confirm your booking by visiting:
${confirmUrl}

IMPORTANT: This confirmation link expires on ${expiresFormatted}.
If you don't confirm by then, you'll need to book again.

If you didn't request this booking, you can safely ignore this email.

---
${teamMemberName}
FirstHomeGuide.ca — Powered by LendCity
  `.trim();

  await sendEmail({
    to,
    subject,
    html,
    text,
  });
}

interface BookingConfirmedEmailParams {
  to: string;
  guestName: string;
  serviceName: string;
  serviceDuration: number;
  teamMemberName: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  meetingLink?: string;
  calendarLinks: {
    google: string;
    outlook: string;
    ical: string;
  };
  /** Token for cancel/reschedule self-service links */
  token?: string;
}

/**
 * Send email after booking is confirmed (with calendar invite details)
 */
export async function sendBookingConfirmedEmail(params: BookingConfirmedEmailParams) {
  const {
    to,
    guestName,
    serviceName,
    serviceDuration,
    teamMemberName,
    startTime,
    timezone,
    meetingLink,
    calendarLinks,
    token,
  } = params;

  const formattedDate = startTime.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  const formattedTime = startTime.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  const subject = `Confirmed: ${serviceName} with ${teamMemberName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; background-color: #ffffff;">
              <a href="https://firsthomeguide.ca" style="display: inline-block;">
                <img src="${LOGO_URL}" alt="FirstHomeGuide.ca" width="160" style="max-width: 160px; height: auto;" />
              </a>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color: #059669; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Booking Confirmed!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">
                Hi ${escapeHtml(guestName)},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                Your <strong>${escapeHtml(serviceName)}</strong> with ${escapeHtml(teamMemberName)} is confirmed!
                Use the buttons below to add this meeting to your calendar.
              </p>

              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #166534; font-size: 14px;">📅 ${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #166534; font-size: 14px;">🕐 ${formattedTime} (${serviceDuration} min)</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #166534; font-size: 14px;">👤 ${teamMemberName}</span>
                        </td>
                      </tr>
                      ${meetingLink ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #166534; font-size: 14px;">🔗 <a href="${meetingLink}" style="color: #059669;">Join Video Call</a></span>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Add to Calendar - Made Prominent -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #1e40af;">
                      Add to Your Calendar
                    </p>
                    <p style="margin: 0 0 16px; font-size: 13px; color: #3b82f6;">
                      Click a button below to add this meeting to your calendar
                    </p>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-right: 8px; width: 33%;">
                          <a href="${calendarLinks.google}" style="display: block; background-color: #4285f4; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 8px; border-radius: 6px; text-align: center;">
                            Google
                          </a>
                        </td>
                        <td style="padding-right: 8px; width: 33%;">
                          <a href="${calendarLinks.outlook}" style="display: block; background-color: #0078d4; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 8px; border-radius: 6px; text-align: center;">
                            Outlook
                          </a>
                        </td>
                        <td style="width: 33%;">
                          <a href="${calendarLinks.ical}" style="display: block; background-color: #374151; color: #ffffff; font-size: 14px; font-weight: 500; text-decoration: none; padding: 12px 8px; border-radius: 6px; text-align: center;">
                            Apple/iCal
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${token ? `
              <!-- Manage Booking -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #374151;">
                      Need to make changes?
                    </p>
                    <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
                      You can reschedule or cancel your appointment at any time.
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 8px;">
                          <a href="https://firsthomeguide.ca/book/reschedule?token=${encodeURIComponent(token)}" style="display: inline-block; background-color: ${BRAND_COLOR_DARK}; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
                            Reschedule
                          </a>
                        </td>
                        <td>
                          <a href="https://firsthomeguide.ca/book/cancel?token=${encodeURIComponent(token)}" style="display: inline-block; background-color: #ffffff; color: #374151; font-size: 13px; font-weight: 500; text-decoration: none; padding: 10px 20px; border-radius: 6px; border: 1px solid #d1d5db;">
                            Cancel
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : `
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Need to reschedule or cancel? Reply to this email and we'll help you out.
              </p>
              `}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                ${teamMemberName}
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                FirstHomeGuide.ca &mdash; Powered by LendCity
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
Hi ${guestName},

Your ${serviceName} with ${teamMemberName} is confirmed!

BOOKING DETAILS:
- Date: ${formattedDate}
- Time: ${formattedTime} (${serviceDuration} min)
- With: ${teamMemberName}
${meetingLink ? `- Video Call: ${meetingLink}` : ''}

ADD TO YOUR CALENDAR:
Use one of these links to add this meeting to your calendar:
- Google Calendar: ${calendarLinks.google}
- Outlook: ${calendarLinks.outlook}
- Apple/iCal: ${calendarLinks.ical}

${token ? `NEED TO MAKE CHANGES?
- Reschedule: https://firsthomeguide.ca/book/reschedule?token=${encodeURIComponent(token)}
- Cancel: https://firsthomeguide.ca/book/cancel?token=${encodeURIComponent(token)}` : `Need to reschedule or cancel? Reply to this email and we'll help you out.`}

---
${teamMemberName}
FirstHomeGuide.ca — Powered by LendCity
  `.trim();

  await sendEmail({
    to,
    subject,
    html,
    text,
  });
}

// ============================================================================
// Internal Notification Emails
// ============================================================================

interface BookingNotificationEmailParams {
  teamMemberEmail: string;
  teamMemberName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
  serviceName: string;
  serviceDuration: number;
  startTime: Date;
  timezone: string;
  meetingType?: string;
  meetingLink?: string;
}

/**
 * Send internal notification email when a booking is confirmed.
 * Sent to the assigned team member + Scott and Aya for oversight.
 */
export async function sendBookingNotificationEmail(params: BookingNotificationEmailParams) {
  const {
    teamMemberEmail,
    teamMemberName,
    guestName,
    guestEmail,
    guestPhone,
    notes,
    serviceName,
    serviceDuration,
    startTime,
    timezone,
    meetingType,
    meetingLink,
  } = params;

  const formattedDate = startTime.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });

  const formattedTime = startTime.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  const meetingTypeLabel = meetingType === 'phone' ? 'Phone Call'
    : meetingType === 'zoom' ? 'Zoom'
    : meetingType === 'meet' ? 'Google Meet'
    : 'Microsoft Teams';

  // Send to team member + Scott + Aya (deduplicated)
  const recipients = [teamMemberEmail, 'scott@lendcity.ca', 'aya@lendcity.ca']
    .filter((email, index, arr) => arr.indexOf(email) === index);

  const subject = `New Booking: ${serviceName} with ${guestName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; background-color: #ffffff;">
              <a href="https://firsthomeguide.ca" style="display: inline-block;">
                <img src="${LOGO_URL}" alt="FirstHomeGuide.ca" width="160" style="max-width: 160px; height: auto;" />
              </a>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_COLOR}; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                New Booking Confirmed
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                A new <strong>${serviceName}</strong> has been confirmed for <strong>${teamMemberName}</strong>.
              </p>

              <!-- Lead Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Lead Details
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Name:</span>
                          <span style="color: #111827; font-size: 14px; font-weight: 500; margin-left: 8px;">${escapeHtml(guestName)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Email:</span>
                          <a href="mailto:${escapeHtml(guestEmail)}" style="color: #2563eb; font-size: 14px; font-weight: 500; margin-left: 8px;">${escapeHtml(guestEmail)}</a>
                        </td>
                      </tr>
                      ${guestPhone ? `
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Phone:</span>
                          <span style="color: #111827; font-size: 14px; font-weight: 500; margin-left: 8px;">${escapeHtml(guestPhone)}</span>
                        </td>
                      </tr>
                      ` : ''}
                      ${notes ? `
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Notes:</span>
                          <span style="color: #111827; font-size: 14px; margin-left: 8px;">${escapeHtml(notes)}</span>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Booking Details
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Service</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${serviceName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Duration</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${serviceDuration} minutes</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Assigned To</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${teamMemberName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Date</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Time</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${formattedTime} (${timezone})</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Meeting Type</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="color: #111827; font-size: 14px; font-weight: 500;">${meetingTypeLabel}</span>
                        </td>
                      </tr>
                      ${meetingLink ? `
                      <tr>
                        <td colspan="2" style="padding: 12px 0 0;">
                          <a href="${meetingLink}" style="color: #2563eb; font-size: 14px; font-weight: 500;">Join Video Call</a>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                FirstHomeGuide.ca &mdash; Powered by LendCity &middot; Booking Notification
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
NEW BOOKING CONFIRMED

A new ${serviceName} has been confirmed for ${teamMemberName}.

LEAD DETAILS:
- Name: ${guestName}
- Email: ${guestEmail}
${guestPhone ? `- Phone: ${guestPhone}` : ''}
${notes ? `- Notes: ${notes}` : ''}

BOOKING DETAILS:
- Service: ${serviceName}
- Duration: ${serviceDuration} minutes
- Assigned To: ${teamMemberName}
- Date: ${formattedDate}
- Time: ${formattedTime} (${timezone})
- Meeting Type: ${meetingTypeLabel}
${meetingLink ? `- Video Call: ${meetingLink}` : ''}

---
FirstHomeGuide.ca — Powered by LendCity - Booking Notification
  `.trim();

  await sendEmail({
    to: recipients,
    subject,
    html,
    text,
    replyTo: guestEmail,
  });
}
