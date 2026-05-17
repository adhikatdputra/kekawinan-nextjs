import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'

// PUT /api/admin/master-data/theme-components/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  const { id } = await params

  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const description = body.description ? String(body.description).trim() : null

    if (!name) return badRequest('Nama component wajib diisi')
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(name)) {
      return badRequest('Nama component hanya boleh huruf, angka, underscore, dan dash')
    }

    const existing = await prisma.themeComponent.findUnique({ where: { id } })
    if (!existing) return notFound('Component tidak ditemukan')

    const duplicate = await prisma.themeComponent.findFirst({
      where: { name, id: { not: id } },
    })
    if (duplicate) return badRequest('Component dengan nama ini sudah ada')

    const updated = await prisma.themeComponent.update({
      where: { id },
      data: { name, description },
    })
    return ok(updated, 'Theme component berhasil diupdate')
  } catch {
    return serverError()
  }
}

// DELETE /api/admin/master-data/theme-components/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  const { id } = await params

  try {
    const existing = await prisma.themeComponent.findUnique({ where: { id } })
    if (!existing) return notFound('Component tidak ditemukan')

    await prisma.themeComponent.delete({ where: { id } })
    return ok(null, 'Theme component berhasil dihapus')
  } catch {
    return serverError()
  }
}
