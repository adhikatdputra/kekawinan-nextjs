import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, serverError } from '@/lib/api-response'
import { startOfWibDay } from '@/lib/jakarta-day'

// GET /api/admin/users/stats
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    // Day boundaries in WIB; the server clock is UTC
    const startOf30Days = startOfWibDay(new Date(), 30)
    const startOfToday = startOfWibDay()

    const [newUsers30d, loginUsers30d, loginToday] = await prisma.$transaction([
      prisma.user.count({
        where: { createdAt: { gte: startOf30Days } },
      }),
      prisma.user.count({
        where: { lastLogin: { gte: startOf30Days } },
      }),
      prisma.user.count({
        where: { lastLogin: { gte: startOfToday } },
      }),
    ])

    return ok({ newUsers30d, loginUsers30d, loginToday }, 'Get user stats success')
  } catch {
    return serverError()
  }
}
