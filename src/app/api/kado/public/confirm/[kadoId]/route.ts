import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, conflict, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ kadoId: string }> }

// PATCH /api/kado/public/confirm/:kadoId — public guest action
// Guest confirms they will bring/send this kado item.
// Can only be confirmed once. Submits name and phone.
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { kadoId } = await params
    const body = await request.json()
    const { name, phone } = body

    if (!name || !phone) {
      return badRequest('name and phone are required')
    }
    if (name.length > 100) {
      return badRequest('Name must be 100 characters or less')
    }

    const kado = await prisma.kado.findUnique({
      where: { id: kadoId },
      include: { undangan: { select: { status: true } } },
    })
    if (!kado) return notFound('Kado not found')
    if (kado.undangan.status !== 'ACTIVE') {
      return badRequest('This invitation is no longer active')
    }
    if (kado.isConfirm) {
      return conflict('This kado has already been confirmed')
    }

    const updated = await prisma.kado.update({
      where: { id: kadoId },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        isConfirm: 1,
      },
    })

    return ok(updated, 'Kado confirmed successfully')
  } catch {
    return serverError()
  }
}
