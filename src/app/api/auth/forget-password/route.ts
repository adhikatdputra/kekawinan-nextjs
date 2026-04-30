import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { sendResetPasswordEmail } from '@/lib/mailer'
import { ok, badRequest, serverError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return badRequest('Email is required')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest('Invalid email format')
    }

    // Always return the same response to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      // Delete any existing reset token for this user, then create a new one
      await prisma.resetPassword.deleteMany({ where: { userId: user.id } })
      const resetEntry = await prisma.resetPassword.create({
        data: {
          id: nanoid(),
          userId: user.id,
          token: nanoid(50),
          expiredAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      })

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || ''
      const resetLink = `${siteUrl}/auth/reset-password?token=${resetEntry.token}`
      // Fire and forget — don't await so response is not delayed by SMTP
      sendResetPasswordEmail(user.email, resetLink).catch(console.error)
    }

    // Always respond the same way
    return ok(null, 'If that email is registered, a reset link has been sent')
  } catch {
    return serverError()
  }
}
