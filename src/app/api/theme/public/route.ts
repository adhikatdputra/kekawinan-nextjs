import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, serverError } from '@/lib/api-response'
import { resolveMediaUrl, paginate, parsePagination } from '@/lib/helpers'
import { verifyAccessToken, isAdminLevel } from '@/lib/jwt'

// GET /api/theme/public — active themes for the invitation picker
// Auth-aware:
//   - Admin/superadmin → all active themes (including isShowAdmin ones)
//   - Regular user / no auth → only themes where isShowAdmin = false
export async function GET(request: NextRequest) {
  try {
    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['name', 'createdAt'],
    )

    // Try to get the authenticated user (optional)
    let authIsAdmin = false
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = verifyAccessToken(authHeader.split(' ')[1])
        authIsAdmin = isAdminLevel(payload.level)
      } catch {
        // Invalid token — treat as unauthenticated
      }
    }

    // Build the where clause based on auth level
    const searchFilter = search ? { name: { contains: search, mode: 'insensitive' as const } } : {}

    let where: Record<string, unknown>
    if (authIsAdmin) {
      // Admin sees all active themes (including admin-only ones)
      where = { isActive: true, ...searchFilter }
    } else {
      // Regular users and unauthenticated — only non-admin themes
      where = { isActive: true, isShowAdmin: false, ...searchFilter }
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
