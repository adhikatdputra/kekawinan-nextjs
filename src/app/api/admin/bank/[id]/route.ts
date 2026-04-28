import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, conflict, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

// PUT /api/admin/bank/:id — update bank
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const target = await prisma.bank.findUnique({ where: { id } })
    if (!target) return notFound('Bank not found')

    const body = await request.json()
    const data: Record<string, unknown> = {}

    if ('name' in body) {
      if (!body.name?.trim()) return badRequest('name cannot be empty')
      data.name = body.name.trim()
    }
    if ('code' in body) {
      if (!body.code?.trim()) return badRequest('code cannot be empty')
      const newCode = body.code.toUpperCase().trim()
      if (newCode !== target.code) {
        const taken = await prisma.bank.findUnique({ where: { code: newCode } })
        if (taken) return conflict('Bank code already exists')
      }
      data.code = newCode
    }
    if ('icon' in body) data.icon = body.icon?.trim() ?? null
    if ('color' in body) data.color = body.color?.trim() ?? null

    const updated = await prisma.bank.update({ where: { id }, data })

    return ok({ ...updated, icon: resolveMediaUrl(updated.icon) }, 'Bank updated successfully')
  } catch {
    return serverError()
  }
}

// DELETE /api/admin/bank/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const target = await prisma.bank.findUnique({ where: { id } })
    if (!target) return notFound('Bank not found')

    await prisma.bank.delete({ where: { id } })

    return ok(null, 'Bank deleted successfully')
  } catch {
    return serverError()
  }
}
