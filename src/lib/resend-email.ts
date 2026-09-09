import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendResendConfirmationParams {
  to: string
  participantName: string
  caregiverName: string
}

export async function sendResendConfirmation({
  to,
  participantName,
  caregiverName,
}: SendResendConfirmationParams): Promise<void> {
  await resend.emails.send({
    from: 'The Social Club <noreply@endlesssports.org>',
    to,
    subject: 'Thank you for registering for The Social Club!',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;color:#333;line-height:1.6;margin:0;padding:0;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#074694;color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="margin:0;font-size:24px;letter-spacing:2px;">THE SOCIAL CLUB</h1>
            <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">A collaborative program from Endless Sports + We Will Walk With You</p>
          </div>
          <div style="background:#f9f9f9;padding:30px;border-radius:0 0 8px 8px;">
            <p>Hi ${caregiverName},</p>
            <p>Thank you for registering <strong>${participantName}</strong> for The Social Club. Please note that your registration is not complete until payment has been received. We're looking forward to seeing you soon!</p>
            <p><em>The Social Club Team</em></p>
          </div>
          <div style="text-align:center;color:#888;font-size:12px;margin-top:20px;">
            <p>Endless Sports &times; We Will Walk With You</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
