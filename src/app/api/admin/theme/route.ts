import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, serverError } from '@/lib/api-response'
import { resolveMediaUrl, paginate, parsePagination } from '@/lib/helpers'

// GET /api/admin/theme — paginated theme list (all, including inactive)
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['name', 'createdAt'],
    )

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.theme.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: { _count: { select: { undangan: true } } },
      }),
      prisma.theme.count({ where }),
    ])

    const resolved = rows.map((t) => ({ ...t, thumbnail: resolveMediaUrl(t.thumbnail) }))

    return ok(paginate(resolved, count, page, limit), 'Get themes success')
  } catch {
    return serverError()
  }
}

// POST /api/admin/theme — create a new theme
// Upload thumbnail first via /api/upload, then pass the returned URL here.
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const body = await request.json()
    const { name, componentName, linkUrl, thumbnail, credit, promo } = body

    if (!name || !componentName || !linkUrl) {
      return badRequest('name, componentName, and linkUrl are required')
    }

    const theme = await prisma.theme.create({
      data: {
        id: nanoid(),
        name: name.trim(),
        componentName: componentName.trim(),
        linkUrl: linkUrl.trim(),
        thumbnail: thumbnail || null,
        credit: credit !== undefined ? Number(credit) : 0,
        promo: promo !== undefined && promo !== null ? Number(promo) : null,
        isActive: true,
      },
    })

    return created({ ...theme, thumbnail: resolveMediaUrl(theme.thumbnail) }, 'Theme created successfully')
  } catch {
    return serverError()
  }
}
