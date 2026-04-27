import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, serverError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, new_password } = body

    if (!token || !new_password) {
      return badRequest('Token and new password are required')
    }
    if (new_password.length < 8) {
      return badRequest('Password must be at least 8 characters')
    }

    const resetEntry = await prisma.resetPassword.findFirst({ where: { token } })
    if (!resetEntry) {
      return badRequest('Invalid or expired reset token')
    }

    if (resetEntry.expiredAt && new Date() > resetEntry.expiredAt) {
      // Clean up expired token
      await prisma.resetPassword.delete({ where: { id: resetEntry.id } })
      return badRequest('Reset token has expired')
    }

    const hashedPassword = await bcrypt.hash(new_password, 10)
    await prisma.user.update({
      where: { id: resetEntry.userId },
      data: { password: hashedPassword },
    })

    // Invalidate all reset tokens for this user
    await prisma.resetPassword.deleteMany({ where: { userId: resetEntry.userId } })

    return ok(null, 'Password has been reset successfully')
  } catch {
    return serverError()
  }
}
