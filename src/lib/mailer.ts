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

export async function sendCollaboratorInviteRegistered(opts: {
  to: string
  toName: string
  ownerName: string
  undanganName: string
  role: string
  dashboardLink: string
}) {
  const roleLabel = opts.role === 'MEMBER' ? 'Member' : 'Crew'
  await transporter.sendMail({
    from: `"Kekawinan.com" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: `Kamu ditambahkan ke undangan ${opts.undanganName}`,
    html: `
      <p>Halo ${opts.toName || opts.to},</p>
      <p><strong>${opts.ownerName}</strong> menambahkan kamu sebagai <strong>${roleLabel}</strong> di undangan pernikahan <strong>${opts.undanganName}</strong>.</p>
      <p>Kamu bisa langsung masuk dan mulai membantu:</p>
      <p><a href="${opts.dashboardLink}" style="background:#4A763E;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Lihat Undangan</a></p>
      <p style="color:#888;font-size:12px;">Jika kamu tidak mengenal pengirim ini, abaikan email ini.</p>
      <p>— Tim Kekawinan.com</p>
    `,
  })
}

export async function sendCollaboratorInvitePending(opts: {
  to: string
  ownerName: string
  undanganName: string
  role: string
  registerLink: string
}) {
  const roleLabel = opts.role === 'MEMBER' ? 'Member' : 'Crew'
  await transporter.sendMail({
    from: `"Kekawinan.com" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: `Kamu diundang untuk membantu undangan pernikahan`,
    html: `
      <p>Halo,</p>
      <p><strong>${opts.ownerName}</strong> mengundang kamu sebagai <strong>${roleLabel}</strong> untuk membantu undangan pernikahan <strong>${opts.undanganName}</strong> di Kekawinan.com.</p>
      <p>Daftar akun gratis untuk mulai:</p>
      <p><a href="${opts.registerLink}" style="background:#4A763E;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;">Daftar Sekarang</a></p>
      <p style="color:#888;font-size:12px;">Setelah daftar, undangan tersebut akan otomatis muncul di dashboard kamu.</p>
      <p>— Tim Kekawinan.com</p>
    `,
  })
}

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
