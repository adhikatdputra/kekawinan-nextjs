import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, serverError } from '@/lib/api-response'
import { paginate, parsePagination } from '@/lib/helpers'
import { PackageType, RedeemCodeStatus } from '@prisma/client'

const VALID_PACKAGE_TYPES: PackageType[] = ['AKAD', 'RESEPSI', 'GRAND']

function generateCode(packageType: PackageType): string {
  const random = nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(6, '0').slice(0, 6)
  return `KKW-${packageType}-${random}`
}

// GET /api/admin/redeem-codes
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { page, limit, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['createdAt', 'expiredAt', 'status'],
    )

    const statusFilter = request.nextUrl.searchParams.get('status') as RedeemCodeStatus | null
    const packageFilter = request.nextUrl.searchParams.get('packageType') as PackageType | null
    const VALID_STATUSES: RedeemCodeStatus[] = ['UNUSED', 'USED', 'EXPIRED']

    const where = {
      ...(statusFilter && VALID_STATUSES.includes(statusFilter) && { status: statusFilter }),
      ...(packageFilter && VALID_PACKAGE_TYPES.includes(packageFilter) && { packageType: packageFilter }),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.redemptionCode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.redemptionCode.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get redeem codes success')
  } catch {
    return serverError()
  }
}

// POST /api/admin/redeem-codes — generate kode baru
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const body = await request.json()
    const { packageType, totalCredit, expiredAt, note } = body

    if (!packageType) {
      return badRequest('packageType wajib diisi')
    }
    if (!VALID_PACKAGE_TYPES.includes(packageType)) {
      return badRequest('packageType harus salah satu dari: AKAD, RESEPSI, GRAND')
    }

    const total = Number(totalCredit) || 1
    if (total < 1 || total > 100) {
      return badRequest('totalCredit harus antara 1 dan 100')
    }

    let expired: Date | null = null
    if (expiredAt) {
      expired = new Date(expiredAt)
      if (isNaN(expired.getTime()) || expired <= new Date()) {
        return badRequest('expiredAt harus tanggal di masa depan')
      }
    }

    // Generate kode unik, retry jika collision
    let code = ''
    let attempts = 0
    while (attempts < 5) {
      const candidate = generateCode(packageType)
      const existing = await prisma.redemptionCode.findUnique({ where: { code: candidate } })
      if (!existing) { code = candidate; break }
      attempts++
    }
    if (!code) return serverError('Gagal generate kode unik, coba lagi')

    const redemptionCode = await prisma.redemptionCode.create({
      data: {
        id: nanoid(),
        code,
        packageType,
        totalCredit: total,
        remainingCredit: total,
        expiredAt: expired ?? undefined,
        status: 'UNUSED',
        note: note?.trim() || null,
        generatedBy: auth.id,
      },
    })

    return created(redemptionCode, 'Kode redeem berhasil dibuat')
  } catch {
    return serverError()
  }
}
