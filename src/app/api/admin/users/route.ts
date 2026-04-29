import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, conflict, forbidden, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'

const VALID_LEVELS = ['user', 'admin', 'superadmin']
const VALID_STATUSES = ['ACTIVE', 'SUSPENDED']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function stripPassword<T extends { password?: unknown }>(user: T) {
  const { password: _, ...rest } = user
  return rest
}

// GET /api/admin/users — paginated user list
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['fullname', 'email', 'createdAt'],
    )

    // Optional level filter via ?level=user|admin|superadmin
    const levelFilter = request.nextUrl.searchParams.get('level')

    const where = {
      ...(levelFilter && VALID_LEVELS.includes(levelFilter) && { level: levelFilter }),
      ...(search && {
        OR: [
          { fullname: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        omit: { password: true },
      }),
      prisma.user.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get users success')
  } catch {
    return serverError()
  }
}

// POST /api/admin/users — create a user (admin can set any level)
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const body = await request.json()
    const { email, fullname, password, level, phone, dob } = body

    if (!email || !fullname || !password || !level) {
      return badRequest('email, fullname, password, and level are required')
    }
    if (!EMAIL_REGEX.test(email)) return badRequest('Invalid email format')
    if (!VALID_LEVELS.includes(level)) {
      return badRequest(`level must be one of: ${VALID_LEVELS.join(', ')}`)
    }
    // Only superadmin can create another superadmin
    if (level === 'superadmin' && auth.level !== 'superadmin') {
      return forbidden('Only superadmin can create superadmin accounts')
    }
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!PASSWORD_REGEX.test(password)) return badRequest('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return conflict('Email is already taken')

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        id: nanoid(),
        email: email.toLowerCase().trim(),
        fullname: fullname.trim(),
        password: hashed,
        level,
        phone: phone?.trim() ?? null,
        dob: dob ? new Date(dob) : null,
        status: 'ACTIVE',
      },
    })

    return created(stripPassword(user), 'User created successfully')
  } catch {
    return serverError()
  }
}
