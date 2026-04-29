import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, conflict, serverError } from '@/lib/api-response'
import { paginate, parsePagination, isValidPermalink } from '@/lib/helpers'

// GET /api/undangan
// - User: returns only their own undangans
// - Admin: returns all undangans with user info, supports search & pagination
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const sp = request.nextUrl.searchParams
    const { page, limit, search, sortBy, order } = parsePagination(
      sp,
      ['name', 'createdAt', 'expired'],
    )

    const isAdmin = isAdminLevel(auth.level)
    const where: Record<string, unknown> = {}

    if (!isAdmin) {
      where.userId = auth.id
    } else if (sp.get('userId')) {
      where.userId = sp.get('userId')
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const [rows, count] = await prisma.$transaction([
      prisma.undangan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: isAdmin
          ? { content: { select: { dateWedding: true } }, theme: { select: { componentName: true } }, user: { select: { fullname: true, email: true } } }
          : { content: { select: { dateWedding: true } }, theme: { select: { componentName: true } } },
      }),
      prisma.undangan.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get undangan success')
  } catch {
    return serverError()
  }
}

// POST /api/undangan
// - userId always comes from JWT — client cannot set it
// - Creates undangan + empty content + empty gift in a single transaction
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { permalink, name, themeId, expired } = body

    // Admin can create undangan for specific user, regular user uses their own id
    const userId = (isAdminLevel(auth.level) && body.userId) ? body.userId : auth.id

    if (!permalink || !name) {
      return badRequest('Permalink and name are required')
    }
    if (!isValidPermalink(permalink)) {
      return badRequest('Permalink may only contain letters, numbers, hyphens, and underscores (min 3 chars)')
    }

    const existing = await prisma.undangan.findFirst({ where: { permalink } })
    if (existing) {
      return conflict('Permalink is already taken')
    }

    const undanganId = nanoid()
    const expiredDate = expired
      ? new Date(expired)
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months default

    const [undangan] = await prisma.$transaction([
      prisma.undangan.create({
        data: {
          id: undanganId,
          userId,
          permalink,
          name,
          themeId: themeId ?? null,
          expired: expiredDate,
        },
      }),
      prisma.undanganContent.create({
        data: { id: nanoid(), undanganId },
      }),
      prisma.undanganGift.create({
        data: { id: nanoid(), undanganId },
      }),
    ])

    return created(undangan, 'Undangan created')
  } catch {
    return serverError()
  }
}
