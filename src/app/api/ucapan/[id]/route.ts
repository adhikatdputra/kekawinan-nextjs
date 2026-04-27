import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

const VALID_ATTEND = ['Yes', 'No']

async function getOwnedUcapan(id: string, userId: string, level: string) {
  const ucapan = await prisma.ucapan.findUnique({
    where: { id },
    include: { undangan: { select: { userId: true } } },
  })
  if (!ucapan) return { ucapan: null, error: notFound('Ucapan not found') }
  if (!isAdminLevel(level) && ucapan.undangan.userId !== userId) {
    return { ucapan: null, error: forbidden('Access denied') }
  }
  return { ucapan, error: null }
}

// GET /api/ucapan/:id
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { ucapan, error } = await getOwnedUcapan(id, auth.id, auth.level)
    if (error || !ucapan) return error!

    return ok(ucapan, 'Get ucapan success')
  } catch {
    return serverError()
  }
}

// PUT /api/ucapan/:id
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { ucapan, error } = await getOwnedUcapan(id, auth.id, auth.level)
    if (error || !ucapan) return error!

    const body = await request.json()
    const { name, message, attend, attendTotal } = body

    if (!name || !message) {
      return badRequest('name and message are required')
    }
    if (attend && !VALID_ATTEND.includes(attend)) {
      return badRequest("attend must be 'Yes' or 'No'")
    }

    const updated = await prisma.ucapan.update({
      where: { id },
      data: {
        name,
        message,
        attend: attend ?? ucapan.attend,
        attendTotal: attend === 'Yes' ? (Number(attendTotal) || 1) : null,
      },
    })

    return ok(updated, 'Ucapan updated')
  } catch {
    return serverError()
  }
}

// DELETE /api/ucapan/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUcapan(id, auth.id, auth.level)
    if (error) return error

    await prisma.ucapan.delete({ where: { id } })

    return ok(null, 'Ucapan deleted')
  } catch {
    return serverError()
  }
}
