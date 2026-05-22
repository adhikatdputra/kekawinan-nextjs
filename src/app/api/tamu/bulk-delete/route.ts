import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'

// DELETE /api/tamu/bulk-delete
export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return badRequest('ids wajib diisi dan tidak boleh kosong')
    }

    if (ids.length > 500) {
      return badRequest('Maksimal 500 tamu per operasi')
    }

    // Verify all tamu belong to undangan that the caller has access to
    const tamuList = await prisma.tamu.findMany({
      where: { id: { in: ids } },
      select: { id: true, undanganId: true, undangan: { select: { userId: true } } },
    })

    if (tamuList.length === 0) return badRequest('Tidak ada tamu yang ditemukan')

    // Check access per unique undanganId
    const undanganIds = [...new Set(tamuList.map((t) => t.undanganId))]
    for (const undanganId of undanganIds) {
      const sample = tamuList.find((t) => t.undanganId === undanganId)!
      if (
        !isAdminLevel(auth.level) &&
        sample.undangan.userId !== auth.id &&
        !(await isActiveCollaborator(auth.id, undanganId))
      ) {
        return forbidden('Akses ditolak')
      }
    }

    const validIds = tamuList.map((t) => t.id)
    const result = await prisma.tamu.deleteMany({ where: { id: { in: validIds } } })

    return ok({ deleted_count: result.count }, `${result.count} tamu berhasil dihapus`)
  } catch (err) {
    console.error('[bulk-delete]', err)
    return serverError()
  }
}
