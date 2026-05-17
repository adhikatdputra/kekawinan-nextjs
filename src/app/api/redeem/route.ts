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
    // Kode single-use: begitu diklaim 1 user, langsung USED
    // Juga cek usedBy untuk handle data lama yang usedBy-nya terisi tapi status belum USED
    if (redemptionCode.status === 'USED' || redemptionCode.usedBy !== null) {
      return badRequest('Kode sudah pernah digunakan')
    }

    // Insert 1 row per credit unit — user mendapatkan SEMUA credit dari kode ini
    const creditRows = Array.from({ length: redemptionCode.totalCredit }, () => ({
      id: nanoid(),
      userId: auth.id,
      packageType: redemptionCode.packageType,
      status: 'AVAILABLE' as const,
      redemptionCodeId: redemptionCode.id,
    }))

    await prisma.$transaction([
      prisma.userCredit.createMany({ data: creditRows }),
      prisma.redemptionCode.update({
        where: { id: redemptionCode.id },
        data: {
          remainingCredit: 0,
          status: 'USED',
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
