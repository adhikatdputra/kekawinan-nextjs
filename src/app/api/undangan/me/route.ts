import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'

// GET /api/undangan/me
// Always returns only the authenticated user's own undangans (from JWT)
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const sp = request.nextUrl.searchParams
    const { page, limit, search, sortBy, order } = parsePagination(
      sp,
      ['name', 'createdAt', 'expired'],
    )

    const where: Record<string, unknown> = { userId: auth.id }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const [rows, count] = await prisma.$transaction([
      prisma.undangan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          content: { select: { dateWedding: true } },
          theme: { select: { componentName: true } },
        },
      }),
      prisma.undangan.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get undangan success')
  } catch {
    return serverError()
  }
}
