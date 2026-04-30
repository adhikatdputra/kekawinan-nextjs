import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, serverError } from '@/lib/api-response'

// GET /api/credits/history — riwayat credit user (masuk & keluar)
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const credits = await prisma.userCredit.findMany({
      where: { userId: auth.id },
      orderBy: { redeemedAt: 'desc' },
      include: {
        redemptionCode: {
          select: { code: true, packageType: true },
        },
        undangan: {
          select: { id: true, name: true },
        },
      },
    })

    // Build a flat timeline: one IN entry per credit row (grouped by redemptionCodeId on same day),
    // and one OUT entry per credit row that has been used.
    const history: {
      id: string
      type: 'IN' | 'OUT'
      amount: number
      packageType: string
      description: string
      date: string
    }[] = []

    // Group IN entries by redemptionCodeId to avoid per-credit-row duplication
    const inGroups = new Map<string, { count: number; code: string; packageType: string; date: Date }>()

    for (const credit of credits) {
      const key = credit.redemptionCodeId
      if (!inGroups.has(key)) {
        inGroups.set(key, {
          count: 0,
          code: credit.redemptionCode.code,
          packageType: credit.packageType,
          date: credit.redeemedAt,
        })
      }
      inGroups.get(key)!.count += 1

      // OUT entry
      if (credit.status === 'USED' && credit.usedAt) {
        const undanganName = credit.undangan?.name ?? 'Undangan'
        history.push({
          id: `out-${credit.id}`,
          type: 'OUT',
          amount: 1,
          packageType: credit.packageType,
          description: `Digunakan untuk undangan "${undanganName}"`,
          date: credit.usedAt.toISOString(),
        })
      }
    }

    // Add grouped IN entries
    for (const [key, group] of inGroups.entries()) {
      history.push({
        id: `in-${key}`,
        type: 'IN',
        amount: group.count,
        packageType: group.packageType,
        description: `Redeem kode ${group.code}`,
        date: group.date.toISOString(),
      })
    }

    // Sort by date desc
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return ok(history, 'Get credit history success')
  } catch {
    return serverError()
  }
}
