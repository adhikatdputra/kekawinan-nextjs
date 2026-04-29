import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, notFound, serverError } from '@/lib/api-response'

const SELECT_PROFILE = {
  id: true,
  email: true,
  fullname: true,
  level: true,
  phone: true,
  dob: true,
  status: true,
  isMember: true,
  expiredMember: true,
  createdAt: true,
} as const

// GET /api/users/profile
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: SELECT_PROFILE,
    })
    if (!user) return notFound('User not found')

    return ok(user, 'Get profile success')
  } catch {
    return serverError()
  }
}

// PUT /api/users/profile
export async function PUT(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { fullname, phone, dob } = body

    if (!fullname) {
      return badRequest('Fullname is required')
    }

    const user = await prisma.user.findUnique({ where: { id: auth.id } })
    if (!user) return notFound('User not found')

    const updated = await prisma.user.update({
      where: { id: auth.id },
      data: {
        fullname,
        phone: phone ?? null,
        dob: dob ? new Date(dob) : null,
      },
      select: SELECT_PROFILE,
    })

    return ok(updated, 'Update profile success')
  } catch {
    return serverError()
  }
}
