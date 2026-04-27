import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { created, badRequest, notFound, serverError } from '@/lib/api-response'

const VALID_ATTEND = ['Yes', 'No']

// POST /api/ucapan/public/submit — public guest wish submission, no auth required
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { undanganId, name, message, attend, attendTotal } = body

    if (!undanganId || !name || !message || !attend) {
      return badRequest('undanganId, name, message, and attend are required')
    }
    if (name.length > 100) {
      return badRequest('Name must be 100 characters or less')
    }
    if (message.length > 500) {
      return badRequest('Message must be 500 characters or less')
    }
    if (!VALID_ATTEND.includes(attend)) {
      return badRequest("attend must be 'Yes' or 'No'")
    }

    // Verify undangan exists and is active
    const undangan = await prisma.undangan.findUnique({
      where: { id: undanganId },
      select: { status: true },
    })
    if (!undangan) return notFound('Undangan not found')
    if (undangan.status !== 'ACTIVE') {
      return badRequest('This invitation is no longer active')
    }

    const ucapan = await prisma.ucapan.create({
      data: {
        id: nanoid(),
        undanganId,
        name: name.trim(),
        message: message.trim(),
        attend,
        attendTotal: attend === 'Yes' ? (Number(attendTotal) || 1) : null,
        isShow: 1,
      },
    })

    return created(ucapan, 'Wish submitted successfully')
  } catch {
    return serverError()
  }
}
