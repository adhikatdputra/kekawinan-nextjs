import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, conflict, forbidden, serverError } from '@/lib/api-response'
import { paginate, parsePagination, resolveMediaUrl } from '@/lib/helpers'

// GET /api/admin/bank — paginated bank list
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['name', 'code', 'createdAt'],
    )

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { code: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [rows, count] = await prisma.$transaction([
      prisma.bank.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.bank.count({ where }),
    ])

    const resolved = rows.map((b) => ({ ...b, icon: resolveMediaUrl(b.icon) }))
    return ok(paginate(resolved, count, page, limit), 'Get banks success')
  } catch {
    return serverError()
  }
}

// POST /api/admin/bank — create bank
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const body = await request.json()
    const { name, code, icon, color } = body

    if (!name || !code) return badRequest('name and code are required')

    const existing = await prisma.bank.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) return conflict('Bank code already exists')

    const bank = await prisma.bank.create({
      data: {
        id: nanoid(),
        name: name.trim(),
        code: code.toUpperCase().trim(),
        icon: icon?.trim() ?? null,
        color: color?.trim() ?? null,
      },
    })

    return created({ ...bank, icon: resolveMediaUrl(bank.icon) }, 'Bank created successfully')
  } catch {
    return serverError()
  }
}
