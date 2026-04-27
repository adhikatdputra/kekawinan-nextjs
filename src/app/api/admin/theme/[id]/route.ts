import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

// GET /api/admin/theme/:id
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const theme = await prisma.theme.findUnique({ where: { id } })
    if (!theme) return notFound('Theme not found')

    return ok({ ...theme, thumbnail: resolveMediaUrl(theme.thumbnail) }, 'Get theme success')
  } catch {
    return serverError()
  }
}

// PUT /api/admin/theme/:id — partial update
// To update thumbnail, pass a Cloudinary URL string. To clear it, pass null.
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const theme = await prisma.theme.findUnique({ where: { id } })
    if (!theme) return notFound('Theme not found')

    const body = await request.json()
    const data: Record<string, unknown> = {}

    if ('name' in body) data.name = body.name?.trim() ?? null
    if ('componentName' in body) data.componentName = body.componentName?.trim() ?? null
    if ('linkUrl' in body) data.linkUrl = body.linkUrl?.trim() ?? null
    if ('thumbnail' in body) data.thumbnail = body.thumbnail || null
    if ('credit' in body) data.credit = body.credit !== undefined ? Number(body.credit) : null
    if ('promo' in body) data.promo = body.promo !== undefined ? Number(body.promo) : null
    if ('isActive' in body) {
      if (typeof body.isActive !== 'boolean') return badRequest('isActive must be a boolean')
      data.isActive = body.isActive
    }

    const updated = await prisma.theme.update({ where: { id }, data })

    return ok({ ...updated, thumbnail: resolveMediaUrl(updated.thumbnail) }, 'Theme updated successfully')
  } catch {
    return serverError()
  }
}

// DELETE /api/admin/theme/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const { id } = await params
    const theme = await prisma.theme.findUnique({ where: { id } })
    if (!theme) return notFound('Theme not found')

    await prisma.theme.delete({ where: { id } })

    return ok(null, 'Theme deleted successfully')
  } catch {
    return serverError()
  }
}
