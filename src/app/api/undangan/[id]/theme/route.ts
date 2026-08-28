import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, conflict, serverError } from '@/lib/api-response'
import { revalidateUndanganByPermalink } from '@/lib/queries/revalidate-undangan'

type Params = { params: Promise<{ id: string }> }

// PUT /api/undangan/:id/theme
// Memasang tema pada undangan yang temanya KOSONG — undangan lama yang temanya
// terhapus, atau undangan yang dibuat admin tanpa tema. Tanpa tema, halaman
// publiknya tidak pernah selesai loading, jadi ini jalur pemulihannya.
//
// Ini bukan jalur ganti tema: kalau tema sudah terpasang request ditolak, dan
// pindah tema tetap lewat duplicate supaya perhitungan credit-nya jelas.
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const undangan = await prisma.undangan.findUnique({ where: { id } })
    if (!undangan) return notFound('Undangan not found')

    const isAdmin = isAdminLevel(auth.level)
    // Kolaborator tidak boleh memilih tema — ini keputusan pemilik undangan
    if (!isAdmin && undangan.userId !== auth.id) return forbidden('Access denied')

    if (undangan.themeId) return conflict('Undangan ini sudah memiliki tema')

    const { themeId } = await request.json()
    if (!themeId) return badRequest('Pilih tema terlebih dahulu')

    const theme = await prisma.theme.findUnique({ where: { id: themeId } })
    if (!theme) return badRequest('Tema tidak ditemukan')

    // ── Admin: pasang langsung, tanpa credit ──────────────────────────────────
    if (isAdmin) {
      const updated = await prisma.undangan.update({ where: { id }, data: { themeId } })
      revalidateUndanganByPermalink(updated.permalink)
      return ok(updated, 'Tema undangan berhasil dipasang')
    }

    if (!theme.isActive || theme.isShowAdmin) return badRequest('Tema tidak ditemukan')

    const cost = theme.promo !== null ? theme.promo : theme.credit
    if (cost === null || cost === undefined) return badRequest('Tema belum memiliki harga credit')

    // Credit yang sudah terpotong untuk undangan ini tetap dihitung sebagai
    // pembayaran, jadi user tidak membayar dua kali untuk tema seharga sama
    // atau lebih murah. Hanya selisihnya yang dipotong.
    const alreadyPaid = await prisma.userCredit.count({
      where: { usedForUndangan: id, status: 'USED' },
    })
    const extra = Math.max(0, cost - alreadyPaid)

    let extraCredits: { id: string; packageType: 'AKAD' | 'RESEPSI' | 'GRAND' }[] = []
    if (extra > 0) {
      extraCredits = await prisma.userCredit.findMany({
        where: { userId: auth.id, status: 'AVAILABLE' },
        take: extra,
        orderBy: { redeemedAt: 'asc' }, // FIFO — pakai yang paling lama dulu
        select: { id: true, packageType: true },
      })

      if (extraCredits.length < extra) {
        return forbidden(
          `Credit tidak cukup. Tema ini membutuhkan ${cost} credit, ${alreadyPaid} sudah terpakai di undangan ini, dan kamu hanya punya ${extraCredits.length} credit tersisa.`,
        )
      }
    }

    const updateUndangan = prisma.undangan.update({
      where: { id },
      data: {
        themeId,
        // Undangan yang belum pernah memakai credit (mis. dibuat admin) baru
        // menentukan paketnya di sini, dari credit pertama yang dipotong.
        ...(alreadyPaid === 0 && extraCredits[0]
          ? { packageType: extraCredits[0].packageType }
          : {}),
      },
    })

    const updated = extraCredits.length > 0
      ? (await prisma.$transaction([
          updateUndangan,
          prisma.userCredit.updateMany({
            where: { id: { in: extraCredits.map((c) => c.id) } },
            data: { status: 'USED', usedForUndangan: id, usedAt: new Date() },
          }),
        ]))[0]
      : await updateUndangan

    revalidateUndanganByPermalink(updated.permalink)
    return ok(updated, 'Tema undangan berhasil dipasang')
  } catch {
    return serverError()
  }
}
