import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_USE_TLS === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendResetPasswordEmail(to: string, resetLink: string) {
  await transporter.sendMail({
    from: `"Support Kekawinan" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in <strong>1 hour</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best Regards,<br>Kekawinan Team</p>
    `,
  })
}
