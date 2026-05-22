import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'

type Params = { params: Promise<{ id: string }> }

// POST /api/tamu/bulk-log/:id/retry
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()

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

    // Use provided values or fall back to stored values
    const rawName = body.name !== undefined ? body.name : log.name
    const rawPhone = body.phone !== undefined ? body.phone : log.phone
    const rawMax = body.maxInvite !== undefined ? body.maxInvite : log.maxInvite

    // Validate name
    const name = String(rawName ?? '').replace(/&/g, 'dan').replace(/[^\w\s]/gi, '').trim()
    if (!name) {
      await prisma.tamuBulkLog.update({
        where: { id },
        data: { errorMessage: 'Nama tamu tidak valid' },
      })
      return badRequest('Nama tamu tidak valid')
    }

    // Validate phone
    let phone = String(rawPhone ?? '').replace(/\D/g, '').trim()
    if (!phone) {
      await prisma.tamuBulkLog.update({
        where: { id },
        data: { errorMessage: 'No. WhatsApp tidak valid' },
      })
      return badRequest('No. WhatsApp tidak valid')
    }
    if (phone.startsWith('8')) phone = '0' + phone
    if (!phone.startsWith('08') && !phone.startsWith('62')) {
      await prisma.tamuBulkLog.update({
        where: { id },
        data: { errorMessage: 'No. WhatsApp harus diawali 08 atau 62' },
      })
      return badRequest('No. WhatsApp harus diawali 08 atau 62')
    }
    if (phone.startsWith('0')) phone = '+62' + phone.slice(1)
    else if (phone.startsWith('62')) phone = '+' + phone

    // Validate maxInvite
    let maxInvite = 1
    if (rawMax !== undefined && rawMax !== null && rawMax !== '') {
      const num = parseInt(String(rawMax), 10)
      if (isNaN(num) || num < 1 || num > 20) {
        await prisma.tamuBulkLog.update({
          where: { id },
          data: { errorMessage: 'Total tamu harus angka 1-20' },
        })
        return badRequest('Total tamu harus angka 1-20')
      }
      maxInvite = num
    }

    // All valid — create tamu and delete log
    const tamu = await prisma.tamu.create({
      data: {
        id: nanoid(),
        undanganId: log.undanganId,
        name,
        phone,
        maxInvite,
      },
    })

    await prisma.tamuBulkLog.delete({ where: { id } })

    return ok(tamu, 'Tamu berhasil ditambahkan')
  } catch (err) {
    console.error('[bulk-log retry]', err)
    return serverError()
  }
}
