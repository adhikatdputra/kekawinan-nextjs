import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'

type Params = { params: Promise<{ id: string }> }

// PUT /api/tamu/bulk-log/:id — update log row
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const { name, phone, maxInvite } = body

    const log = await prisma.tamuBulkLog.findUnique({ where: { id } })
    if (!log) return notFound('Log tidak ditemukan')

    const undangan = await prisma.undangan.findUnique({ where: { id: log.undanganId } })
    if (!undangan) return notFound('Undangan tidak ditemukan')
    if (
      !isAdminLevel(auth.level) &&
      undangan.userId !== auth.id &&
      !(await isActiveCollaborator(auth.id, log.undanganId))
    ) {
      return forbidden('Akses ditolak')
    }

    const updateData: { name?: string; phone?: string; maxInvite?: number } = {}

    if (name !== undefined) {
      const cleaned = String(name).replace(/[^\w\s]/gi, '').trim()
      if (!cleaned) return badRequest('Nama tamu tidak valid')
      updateData.name = cleaned
    }

    if (phone !== undefined) {
      let str = String(phone).replace(/\D/g, '').trim()
      if (!str) return badRequest('No. WhatsApp tidak valid')
      if (str.length < 12 && str.startsWith('8')) str = '0' + str
      if (!str.startsWith('08') && !str.startsWith('62')) {
        return badRequest('No. WhatsApp harus diawali 08 atau 62')
      }
      if (str.startsWith('0')) str = '+62' + str.slice(1)
      else if (str.startsWith('62')) str = '+' + str
      updateData.phone = str
    }

    if (maxInvite !== undefined && maxInvite !== null && maxInvite !== '') {
      const num = parseInt(String(maxInvite), 10)
      if (isNaN(num) || num < 1 || num > 20) return badRequest('Total tamu harus angka 1-20')
      updateData.maxInvite = num
    }

    const updated = await prisma.tamuBulkLog.update({ where: { id }, data: updateData })

    return ok(updated, 'Log berhasil diupdate')
  } catch (err) {
    console.error('[bulk-log PUT]', err)
    return serverError()
  }
}

// DELETE /api/tamu/bulk-log/:id — delete log row
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params

    const log = await prisma.tamuBulkLog.findUnique({ where: { id } })
    if (!log) return notFound('Log tidak ditemukan')

    const undangan = await prisma.undangan.findUnique({ where: { id: log.undanganId } })
    if (!undangan) return notFound('Undangan tidak ditemukan')
    if (
      !isAdminLevel(auth.level) &&
      undangan.userId !== auth.id &&
      !(await isActiveCollaborator(auth.id, log.undanganId))
    ) {
      return forbidden('Akses ditolak')
    }

    await prisma.tamuBulkLog.delete({ where: { id } })

    return ok(null, 'Log berhasil dihapus')
  } catch (err) {
    console.error('[bulk-log DELETE]', err)
    return serverError()
  }
}
