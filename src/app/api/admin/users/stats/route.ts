import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, serverError } from '@/lib/api-response'

// GET /api/admin/users/stats
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const now = new Date()
    const startOf30Days = new Date(now)
    startOf30Days.setDate(startOf30Days.getDate() - 30)
    startOf30Days.setHours(0, 0, 0, 0)

    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

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
