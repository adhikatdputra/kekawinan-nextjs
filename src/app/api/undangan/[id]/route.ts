import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, conflict, serverError } from '@/lib/api-response'
import { isValidPermalink, resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

async function getOwnedUndangan(id: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id } })
  if (!undangan) return { undangan: null, error: notFound('Undangan not found') }
  if (!isAdminLevel(level) && undangan.userId !== userId) {
    return { undangan: null, error: forbidden('Access denied') }
  }
  return { undangan, error: null }
}

// GET /api/undangan/:id — full detail with all relations
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const data = await prisma.undangan.findUnique({
      where: { id },
      include: {
        content: true,
        gifts: true,
        gallery: { orderBy: { rank: 'asc' } },
        ucapan: { orderBy: { createdAt: 'desc' } },
        tamu: { orderBy: { createdAt: 'desc' } },
        theme: true,
      },
    })

    // Resolve Cloudinary URLs for image/video fields
    if (data?.content) {
      const c = data.content as Record<string, unknown>
      c.imgBg = resolveMediaUrl(c.imgBg as string)
      c.imgMale = resolveMediaUrl(c.imgMale as string)
      c.imgFemale = resolveMediaUrl(c.imgFemale as string)
      c.imgThumbnail = resolveMediaUrl(c.imgThumbnail as string)
      c.music = resolveMediaUrl(c.music as string, 'video')
    }
    if (data?.theme) {
      const t = data.theme as Record<string, unknown>
      t.thumbnail = resolveMediaUrl(t.thumbnail as string)
    }

    return ok(data, 'Get undangan success')
  } catch {
    return serverError()
  }
}

// PUT /api/undangan/:id
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error, undangan } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error || !undangan) return error!

    const body = await request.json()
    const { permalink, name, status, expired, themeId } = body

    if (!permalink || !name) {
      return badRequest('Permalink and name are required')
    }
    if (!isValidPermalink(permalink)) {
      return badRequest('Permalink may only contain letters, numbers, hyphens, and underscores')
    }

    // Check permalink uniqueness only if it changed
    if (permalink !== undangan.permalink) {
      const taken = await prisma.undangan.findFirst({ where: { permalink } })
      if (taken) return conflict('Permalink is already taken')
    }

    const updated = await prisma.undangan.update({
      where: { id },
      data: {
        permalink,
        name,
        status: status ?? undangan.status,
        expired: expired ? new Date(expired) : undangan.expired,
        themeId: themeId ?? null,
      },
    })

    return ok(updated, 'Undangan updated')
  } catch {
    return serverError()
  }
}

// DELETE /api/undangan/:id
// Cascade delete handles content, gift, gallery, ucapan, tamu (via DB constraints)
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    await prisma.undangan.delete({ where: { id } })

    return ok(null, 'Undangan deleted')
  } catch {
    return serverError()
  }
}
