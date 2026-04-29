import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

const VALID_ATTEND = ['Yes', 'No']

// POST /api/ucapan — owner manually creates a ucapan entry (e.g. from dashboard)
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { undanganId, name, message, attend, attendTotal } = body

    if (!undanganId || !name || !message || !attend) {
      return badRequest('undanganId, name, message, and attend are required')
    }
    if (!VALID_ATTEND.includes(attend)) {
      return badRequest("attend must be 'Yes' or 'No'")
    }

    const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
    if (!undangan) return notFound('Undangan not found')
    if (!isAdminLevel(auth.level) && undangan.userId !== auth.id) {
      return forbidden('Access denied')
    }

    const ucapan = await prisma.ucapan.create({
      data: {
        id: nanoid(),
        undanganId,
        name,
        message,
        attend,
        attendTotal: attend === 'Yes' ? (Number(attendTotal) || 1) : null,
        isShow: 1,
      },
    })

    return created(ucapan, 'Ucapan created')
  } catch {
    return serverError()
  }
}
