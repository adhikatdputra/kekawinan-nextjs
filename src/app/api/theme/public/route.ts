import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, serverError } from '@/lib/api-response'
import { resolveMediaUrl, paginate, parsePagination } from '@/lib/helpers'

// GET /api/theme/public — active themes for the invitation picker, no auth required
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['name', 'createdAt'],
    )

    const where = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.theme.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.theme.count({ where }),
    ])

    const resolved = rows.map((t) => ({
      ...t,
      thumbnail: resolveMediaUrl(t.thumbnail),
    }))

    return ok(paginate(resolved, count, page, limit), 'Get themes success')
  } catch {
    return serverError()
  }
}
