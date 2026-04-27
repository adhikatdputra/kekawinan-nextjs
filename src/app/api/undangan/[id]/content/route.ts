import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

function resolveContent(content: Record<string, unknown>) {
  return {
    ...content,
    imgBg: resolveMediaUrl(content.imgBg as string),
    imgMale: resolveMediaUrl(content.imgMale as string),
    imgFemale: resolveMediaUrl(content.imgFemale as string),
    imgThumbnail: resolveMediaUrl(content.imgThumbnail as string),
    music: resolveMediaUrl(content.music as string, 'video'),
  }
}

async function getOwnedUndangan(undanganId: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
  if (!undangan) return { undangan: null, error: notFound('Undangan not found') }
  if (!isAdminLevel(level) && undangan.userId !== userId) {
    return { undangan: null, error: forbidden('Access denied') }
  }
  return { undangan, error: null }
}

// GET /api/undangan/:id/content
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const content = await prisma.undanganContent.findUnique({ where: { undanganId: id } })
    if (!content) return notFound('Content not found')

    return ok(resolveContent(content as unknown as Record<string, unknown>), 'Get content success')
  } catch {
    return serverError()
  }
}

// PUT /api/undangan/:id/content
// Accepts text fields + optional image/music URL strings.
// Images should be uploaded first via /api/upload (Cloudinary), then pass the returned URL here.
// To clear a media field, pass an empty string "".
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const content = await prisma.undanganContent.findUnique({ where: { undanganId: id } })
    if (!content) return notFound('Content not found')

    const body = await request.json()

    // Build update data — only include fields that are explicitly provided in the request
    // Media fields: if provided as non-null, use the value (empty string = clear the field)
    const data: Record<string, unknown> = {}
    const textFields = [
      'title', 'nameMale', 'nameFemale',
      'motherFemale', 'fatherFemale', 'motherMale', 'fatherMale',
      'maleNo', 'femaleNo',
      'akadTime', 'akadPlace',
      'resepsiTime', 'resepsiPlace',
      'gmaps', 'streamLink',
      'religionVersion',
    ]
    const mediaFields = ['imgBg', 'imgMale', 'imgFemale', 'imgThumbnail', 'music']

    for (const field of textFields) {
      if (field in body) data[field] = body[field] ?? null
    }
    for (const field of mediaFields) {
      if (field in body) data[field] = body[field] || null // empty string → null
    }

    if ('dateWedding' in body) {
      data.dateWedding = body.dateWedding ? new Date(body.dateWedding) : null
    }
    if ('isCovid' in body) {
      data.isCovid = body.isCovid !== undefined ? Number(body.isCovid) : null
    }

    const updated = await prisma.undanganContent.update({
      where: { undanganId: id },
      data,
    })

    return ok(resolveContent(updated as unknown as Record<string, unknown>), 'Content updated')
  } catch {
    return serverError()
  }
}
