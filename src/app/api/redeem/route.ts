import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { ok, badRequest, serverError } from '@/lib/api-response'

// POST /api/redeem — user input kode redeem
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const code = String(body.code ?? '').trim().toUpperCase()

    if (!code) return badRequest('Kode redeem tidak boleh kosong')

    const redemptionCode = await prisma.redemptionCode.findUnique({ where: { code } })

    if (!redemptionCode) return badRequest('Kode tidak ditemukan')
    if (redemptionCode.status === 'EXPIRED' || (redemptionCode.expiredAt !== null && redemptionCode.expiredAt < new Date())) {
      return badRequest('Kode sudah kadaluarsa')
    }
    if (redemptionCode.status === 'USED' || redemptionCode.remainingCredit <= 0) {
      return badRequest('Kode sudah tidak bisa digunakan')
    }

    // Cek apakah user ini sudah pernah pakai kode yang sama
    const alreadyUsed = await prisma.userCredit.findFirst({
      where: { userId: auth.id, redemptionCodeId: redemptionCode.id },
    })
    if (alreadyUsed) return badRequest('Kamu sudah pernah menggunakan kode ini')

    // Insert 1 row per credit unit
    const creditRows = Array.from({ length: redemptionCode.totalCredit }, () => ({
      id: nanoid(),
      userId: auth.id,
      packageType: redemptionCode.packageType,
      status: 'AVAILABLE' as const,
      redemptionCodeId: redemptionCode.id,
    }))

    const newRemainingCredit = redemptionCode.remainingCredit - 1
    const newStatus = newRemainingCredit <= 0 ? 'USED' : 'UNUSED'

    await prisma.$transaction([
      prisma.userCredit.createMany({ data: creditRows }),
      prisma.redemptionCode.update({
        where: { id: redemptionCode.id },
        data: {
          remainingCredit: newRemainingCredit,
          status: newStatus,
          usedBy: auth.id,
          usedAt: new Date(),
        },
      }),
    ])

    return ok(
      {
        creditAdded: redemptionCode.totalCredit,
        packageType: redemptionCode.packageType,
      },
      `Kode berhasil ditukar! ${redemptionCode.totalCredit} credit ditambahkan ke akunmu.`,
    )
  } catch {
    return serverError()
  }
}
