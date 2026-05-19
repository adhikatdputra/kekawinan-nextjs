import nodemailer from 'nodemailer'

const smtpPort = Number(process.env.SMTP_PORT)
const useTls = process.env.SMTP_USE_TLS === 'true'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: useTls && smtpPort !== 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const LOGO_URL = 'https://www.kekawinan.com/images/kekawinan-logo.png'
const PRIMARY = '#4A763E'
const YEAR = new Date().getFullYear()

function emailLayout({
  heading,
  body,
  ctaHref,
  ctaLabel,
  note,
}: {
  heading: string
  body: string
  ctaHref: string
  ctaLabel: string
  note?: string
}) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:40px 0;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Logo row -->
        <tr>
          <td style="padding:0 0 24px 0;">
            <img src="${LOGO_URL}" alt="Kekawinan.com" width="150" style="display:block;" />
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border-radius:4px;overflow:hidden;">

            <!-- Top accent bar -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="height:4px;background:${PRIMARY};"></td></tr>
            </table>

            <!-- Content -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:40px 48px 16px 48px;">
                  <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:800;color:#111111;line-height:1.25;">${heading}</h1>
                  <div style="font-size:15px;color:#444444;line-height:1.75;">${body}</div>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:8px 48px 40px 48px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:${PRIMARY};border-radius:6px;">
                        <a href="${ctaHref}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">${ctaLabel}</a>
                      </td>
                    </tr>
                  </table>
                  ${note ? `<p style="margin:20px 0 0 0;font-size:13px;color:#999999;line-height:1.6;">${note}</p>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 0 0 0;text-align:left;">
            <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
              Email ini dikirim oleh <a href="https://kekawinan.com" style="color:#999999;">Kekawinan.com</a>.<br>
              &copy; ${YEAR} Kekawinan.com. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendCollaboratorInviteRegistered(opts: {
  to: string
  toName: string
  ownerName: string
  undanganName: string
  role: string
  dashboardLink: string
}) {
  const roleLabel = opts.role === 'OWNER' ? 'Owner' : opts.role === 'MEMBER' ? 'Member' : 'Crew'
  await transporter.sendMail({
    from: `"Kekawinan.com" <${process.env.SMTP_SENDER}>`,
    to: opts.to,
    subject: `Kamu ditambahkan ke undangan ${opts.undanganName}`,
    html: emailLayout({
      heading: `Kamu ditambahkan ke undangan pernikahan`,
      body: `
        <p style="margin:0 0 12px 0;">Halo <strong>${opts.toName || opts.to}</strong>,</p>
        <p style="margin:0 0 12px 0;"><strong>${opts.ownerName}</strong> menambahkan kamu sebagai <strong>${roleLabel}</strong> di undangan pernikahan berikut:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
          <tr>
            <td style="background:#f7f9f7;border-left:3px solid ${PRIMARY};border-radius:2px;padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Undangan</p>
              <p style="margin:6px 0 0 0;font-size:16px;font-weight:700;color:#111111;">${opts.undanganName}</p>
              <p style="margin:4px 0 0 0;font-size:13px;color:#4A763E;font-weight:600;">Role: ${roleLabel}</p>
            </td>
          </tr>
        </table>
        <p style="margin:0;">Kamu bisa langsung masuk ke dashboard dan mulai membantu:</p>
      `,
      ctaHref: opts.dashboardLink,
      ctaLabel: 'Buka Dashboard',
      note: 'Jika kamu tidak mengenal pengirim ini, abaikan email ini.',
    }),
  })
}

export async function sendCollaboratorInvitePending(opts: {
  to: string
  ownerName: string
  undanganName: string
  role: string
  registerLink: string
}) {
  const roleLabel = opts.role === 'OWNER' ? 'Owner' : opts.role === 'MEMBER' ? 'Member' : 'Crew'
  await transporter.sendMail({
    from: `"Kekawinan.com" <${process.env.SMTP_SENDER}>`,
    to: opts.to,
    subject: `Kamu diundang untuk membantu undangan pernikahan`,
    html: emailLayout({
      heading: `Kamu diundang ke Kekawinan.com`,
      body: `
        <p style="margin:0 0 12px 0;">Halo,</p>
        <p style="margin:0 0 12px 0;"><strong>${opts.ownerName}</strong> mengundang kamu sebagai <strong>${roleLabel}</strong> untuk membantu undangan pernikahan berikut:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
          <tr>
            <td style="background:#f7f9f7;border-left:3px solid ${PRIMARY};border-radius:2px;padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Undangan</p>
              <p style="margin:6px 0 0 0;font-size:16px;font-weight:700;color:#111111;">${opts.undanganName}</p>
              <p style="margin:4px 0 0 0;font-size:13px;color:#4A763E;font-weight:600;">Role: ${roleLabel}</p>
            </td>
          </tr>
        </table>
        <p style="margin:0;">Daftar akun gratis di Kekawinan.com untuk mulai membantu. Setelah daftar, undangan ini akan otomatis muncul di dashboard kamu.</p>
      `,
      ctaHref: `${opts.registerLink}?email=${encodeURIComponent(opts.to)}`,
      ctaLabel: 'Daftar Sekarang — Gratis',
      note: 'Jika kamu tidak mengenal pengirim ini, abaikan email ini.',
    }),
  })
}

export async function sendResetPasswordEmail(to: string, resetLink: string) {
  await transporter.sendMail({
    from: `"Kekawinan.com" <${process.env.SMTP_SENDER}>`,
    to,
    subject: 'Reset password akun Kekawinan.com kamu',
    html: emailLayout({
      heading: `Reset password kamu`,
      body: `
        <p style="margin:0 0 12px 0;">Halo,</p>
        <p style="margin:0 0 12px 0;">Kami menerima permintaan untuk mereset password akun kamu di Kekawinan.com. Klik tombol di bawah untuk membuat password baru:</p>
      `,
      ctaHref: resetLink,
      ctaLabel: 'Reset Password',
      note: 'Link ini akan kedaluwarsa dalam <strong>1 jam</strong>. Jika kamu tidak meminta reset password, abaikan email ini — akun kamu tetap aman.',
    }),
  })
}
