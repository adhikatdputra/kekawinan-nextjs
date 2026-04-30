import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, conflict, forbidden, serverError } from '@/lib/api-response'
import { paginate, parsePagination, isValidPermalink } from '@/lib/helpers'

// GET /api/undangan
// - User: returns only their own undangans
// - Admin: returns all undangans with user info, supports search & pagination
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const sp = request.nextUrl.searchParams
    const { page, limit, search, sortBy, order } = parsePagination(
      sp,
      ['name', 'createdAt', 'expired'],
    )

    const isAdmin = isAdminLevel(auth.level)
    const where: Record<string, unknown> = {}

    if (!isAdmin) {
      where.userId = auth.id
    } else if (sp.get('userId')) {
      where.userId = sp.get('userId')
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const [rows, count] = await prisma.$transaction([
      prisma.undangan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: isAdmin
          ? { content: { select: { dateWedding: true } }, theme: { select: { componentName: true } }, user: { select: { fullname: true, email: true } } }
          : { content: { select: { dateWedding: true } }, theme: { select: { componentName: true } } },
      }),
      prisma.undangan.count({ where }),
    ])

    return ok(paginate(rows, count, page, limit), 'Get undangan success')
  } catch {
    return serverError()
  }
}

// POST /api/undangan
// - userId always comes from JWT — client cannot set it
// - Regular user: wajib punya credit AVAILABLE, themeId & packageType diambil dari credit
// - Admin: bisa buat undangan tanpa credit (bypass), kirim themeId & packageType manual
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { permalink, name, expired } = body

    const isAdmin = isAdminLevel(auth.level)
    const userId = (isAdmin && body.userId) ? body.userId : auth.id

    if (!permalink || !name) {
      return badRequest('Permalink and name are required')
    }
    if (!isValidPermalink(permalink)) {
      return badRequest('Permalink may only contain letters, numbers, hyphens, and underscores (min 3 chars)')
    }

    const existing = await prisma.undangan.findFirst({ where: { permalink } })
    if (existing) return conflict('Permalink is already taken')

    const undanganId = nanoid()
    const expiredDate = expired
      ? new Date(expired)
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months default

    // ── Admin path: bypass credit check ──────────────────────────────────────
    if (isAdmin) {
      const { themeId, packageType } = body
      const [undangan] = await prisma.$transaction([
        prisma.undangan.create({
          data: {
            id: undanganId,
            userId,
            permalink,
            name,
            themeId: themeId ?? null,
            packageType: packageType ?? 'AKAD',
            expired: expiredDate,
          },
        }),
        prisma.undanganContent.create({ data: { id: nanoid(), undanganId } }),
        prisma.undanganGift.create({ data: { id: nanoid(), undanganId } }),
      ])
      return created(undangan, 'Undangan created')
    }

    // ── User path: potong credit sesuai biaya tema ────────────────────────────
    const { themeId } = body

    if (!themeId) return badRequest('Pilih tema terlebih dahulu')

    const theme = await prisma.theme.findUnique({ where: { id: themeId } })
    if (!theme) return badRequest('Tema tidak ditemukan')

    // Harga efektif: gunakan promo jika ada (null = tidak ada promo), fallback ke credit
    const cost = theme.promo !== null ? theme.promo : theme.credit

    if (cost <= 0) return badRequest('Tema belum memiliki harga credit')

    // Ambil sejumlah `cost` credit AVAILABLE milik user
    const availableCredits = await prisma.userCredit.findMany({
      where: { userId, status: 'AVAILABLE' },
      take: cost,
      orderBy: { redeemedAt: 'asc' }, // FIFO — pakai yang paling lama dulu
    })

    if (availableCredits.length < cost) {
      return forbidden(
        `Credit tidak cukup. Tema ini membutuhkan ${cost} credit, kamu hanya punya ${availableCredits.length}.`,
      )
    }

    // Ambil packageType dari credit pertama yang akan dipakai
    const packageType = availableCredits[0].packageType

    const creditIds = availableCredits.map((c) => c.id)

    const [undangan] = await prisma.$transaction([
      prisma.undangan.create({
        data: {
          id: undanganId,
          userId,
          permalink,
          name,
          themeId,
          packageType,
          expired: expiredDate,
        },
      }),
      prisma.undanganContent.create({ data: { id: nanoid(), undanganId } }),
      prisma.undanganGift.create({ data: { id: nanoid(), undanganId } }),
      prisma.userCredit.updateMany({
        where: { id: { in: creditIds } },
        data: {
          status: 'USED',
          usedForUndangan: undanganId,
          usedAt: new Date(),
        },
      }),
    ])

    return created(undangan, 'Undangan created')
  } catch {
    return serverError()
  }
}
