import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/api-response'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// PUT /api/users/change-password — change the password, or set the first one for Google accounts
export async function PUT(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { old_password, new_password } = body

    if (!new_password || typeof new_password !== 'string') {
      return badRequest('New password is required')
    }
    if (!PASSWORD_REGEX.test(new_password)) {
      return badRequest('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    }

    const user = await prisma.user.findUnique({ where: { id: auth.id }, select: { password: true } })
    if (!user) return notFound('User not found')

    // Accounts created via Google have no password yet, so they set one without the old password
    if (user.password) {
      if (!old_password) {
        return badRequest('Old password is required')
      }
      if (old_password === new_password) {
        return badRequest('New password must be different from old password')
      }
      const isMatch = await bcrypt.compare(old_password, user.password)
      if (!isMatch) {
        return unauthorized('Old password is wrong')
      }
    }

    await prisma.user.update({
      where: { id: auth.id },
      data: { password: await bcrypt.hash(new_password, 10) },
    })

    return ok(null, 'Password changed successfully')
  } catch {
    return serverError()
  }
}
