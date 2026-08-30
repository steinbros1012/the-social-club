import nodemailer from 'nodemailer'
import { EVENT_CONFIG } from '@/config/event'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

interface SendConfirmationEmailParams {
  to: string
  participantName: string
  caregiverName: string
  isScholarship: boolean
}

export async function sendConfirmationEmail({
  to,
  participantName,
  caregiverName,
  isScholarship,
}: SendConfirmationEmailParams): Promise<void> {
  const subject = isScholarship
    ? 'Your Social Club Registration Has Been Received!'
    : "You're Registered for The Social Club!"

  const eventDetails = EVENT_CONFIG.date
    ? `<p><strong>Date:</strong> ${EVENT_CONFIG.date}</p>
       <p><strong>Time:</strong> ${EVENT_CONFIG.time}</p>
       <p><strong>Location:</strong> ${EVENT_CONFIG.location}</p>
       <p><strong>Address:</strong> ${EVENT_CONFIG.address}</p>`
    : `<p>Event details will be sent to you shortly.</p>`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Noto Sans', Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #074694; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-family: Montserrat, Arial, sans-serif; font-size: 24px; letter-spacing: 2px; }
        .body { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>THE SOCIAL CLUB</h1>
          <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">A collaborative program from Endless Sports + We Will Walk With You</p>
        </div>
        <div class="body">
          <h2>${isScholarship ? 'Registration Received!' : "You're In!"}</h2>
          <p>Hi ${caregiverName},</p>
          <p>${
            isScholarship
              ? `We've received your registration for <strong>${participantName}</strong>. Your scholarship request has been noted, and no payment is required.`
              : `<strong>${participantName}</strong>'s registration for The Social Club is confirmed!`
          }</p>
          ${eventDetails}
          <h3>What to Expect</h3>
          <ul>
            <li>The Social Club is a low-pressure, welcoming environment</li>
            <li>Participants can socialize, play games, make crafts, or simply hang out</li>
            <li>A quiet Sideline space is available for anyone who needs a break</li>
            <li>Light snacks and water will be provided</li>
          </ul>
          <h3>Important Reminder</h3>
          <p><strong>Parents and caregivers must remain on-site</strong> for the duration of the event. This is not a drop-off program.</p>
          ${EVENT_CONFIG.contactEmail ? `<p>Questions? Email us at <a href="mailto:${EVENT_CONFIG.contactEmail}">${EVENT_CONFIG.contactEmail}</a></p>` : ''}
          <p>We can't wait to see you there!</p>
          <p><em>The Social Club Team</em></p>
        </div>
        <div class="footer">
          <p>Endless Sports &times; We Will Walk With You</p>
        </div>
      </div>
    </body>
    </html>
  `

  await getTransporter().sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  })
}
