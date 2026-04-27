import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, conflict, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

const VALID_LEVELS = ['user', 'admin', 'superadmin']
const VALID_STATUSES = ['ACTIVE', 'SUSPENDED']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function stripPassword<T extends { password?: unknown }>(user: T) {
  const { password: _, ...rest } = user
  return rest
}

// GET /api/admin/users/:id
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    })
    if (!user) return notFound('User not found')

    return ok(user, 'Get user success')
  } catch {
    return serverError()
  }
}

// PUT /api/admin/users/:id — partial update
// Password is optional. If provided (min 8 chars), it will be re-hashed.
// Email uniqueness is re-checked if changed.
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return notFound('User not found')

    const body = await request.json()
    const data: Record<string, unknown> = {}

    if ('fullname' in body) data.fullname = body.fullname?.trim() ?? null
    if ('phone' in body) data.phone = body.phone?.trim() ?? null
    if ('dob' in body) data.dob = body.dob ? new Date(body.dob) : null

    if ('email' in body) {
      const newEmail = body.email?.toLowerCase().trim()
      if (!newEmail) return badRequest('email cannot be empty')
      if (!EMAIL_REGEX.test(newEmail)) return badRequest('Invalid email format')
      if (newEmail !== target.email) {
        const taken = await prisma.user.findUnique({ where: { email: newEmail } })
        if (taken) return conflict('Email is already taken')
      }
      data.email = newEmail
    }

    if ('level' in body) {
      if (!VALID_LEVELS.includes(body.level)) {
        return badRequest(`level must be one of: ${VALID_LEVELS.join(', ')}`)
      }
      // Only superadmin can grant or remove superadmin
      if (
        (body.level === 'superadmin' || target.level === 'superadmin') &&
        auth.level !== 'superadmin'
      ) {
        return forbidden('Only superadmin can modify superadmin accounts')
      }
      data.level = body.level
    }

    if ('status' in body) {
      if (!VALID_STATUSES.includes(body.status)) {
        return badRequest(`status must be one of: ${VALID_STATUSES.join(', ')}`)
      }
      data.status = body.status
    }

    if ('isMember' in body) {
      data.isMember = body.isMember ? 1 : 0
    }

    if ('expiredMember' in body) {
      data.expiredMember = body.expiredMember ? new Date(body.expiredMember) : null
    }

    if ('password' in body && body.password) {
      if (body.password.length < 8) return badRequest('Password must be at least 8 characters')
      data.password = await bcrypt.hash(body.password, 10)
    }

    const updated = await prisma.user.update({ where: { id }, data })

    return ok(stripPassword(updated), 'User updated successfully')
  } catch {
    return serverError()
  }
}

// DELETE /api/admin/users/:id
// Prevents self-deletion. Prevents non-superadmin from deleting superadmin accounts.
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params

    if (id === auth.id) {
      return badRequest('You cannot delete your own account')
    }

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) return notFound('User not found')

    if (target.level === 'superadmin' && auth.level !== 'superadmin') {
      return forbidden('Only superadmin can delete superadmin accounts')
    }

    await prisma.user.delete({ where: { id } })

    return ok(null, 'User deleted successfully')
  } catch {
    return serverError()
  }
}
