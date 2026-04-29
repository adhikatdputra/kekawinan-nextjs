import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

// GET /api/tamu/public/:id — public invitation page: get tamu info, marks as read
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const tamu = await prisma.tamu.findUnique({ where: { id } })
    if (!tamu) return notFound('Tamu not found')

    // Mark as read
    prisma.tamu.update({ where: { id }, data: { isRead: 1 } }).catch(console.error)

    return ok(tamu, 'Get tamu success')
  } catch {
    return serverError()
  }
}

// PUT /api/tamu/public/:id — RSVP: guest confirms attendance
export async function PUT(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const tamu = await prisma.tamu.findUnique({ where: { id } })
    if (!tamu) return notFound('Tamu not found')

    const updated = await prisma.tamu.update({
      where: { id },
      data: { isConfirm: 1 },
    })

    return ok(updated, 'Attendance confirmed')
  } catch {
    return serverError()
  }
}
