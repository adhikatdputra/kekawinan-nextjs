import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/api-response'

// PUT /api/users/change-password
export async function PUT(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { old_password, new_password } = body

    if (!old_password || !new_password) {
      return badRequest('Old password and new password are required')
    }
    if (new_password.length < 8) {
      return badRequest('New password must be at least 8 characters')
    }
    if (old_password === new_password) {
      return badRequest('New password must be different from old password')
    }

    const user = await prisma.user.findUnique({ where: { id: auth.id } })
    if (!user) return notFound('User not found')

    const isMatch = await bcrypt.compare(old_password, user.password)
    if (!isMatch) {
      return unauthorized('Old password is wrong')
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
