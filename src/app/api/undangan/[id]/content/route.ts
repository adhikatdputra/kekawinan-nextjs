import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'
import { isActiveCollaborator } from '@/lib/undangan-access'
import { revalidateUndanganById } from '@/lib/queries/revalidate-undangan'
import { expiryWithWedding, maxWeddingDate } from '@/lib/undangan-expiry'

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
  if (!isAdminLevel(level) && undangan.userId !== userId && !(await isActiveCollaborator(userId, undanganId))) {
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
    const { error, undangan } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error || !undangan) return error!

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
      const dateWedding = body.dateWedding ? new Date(body.dateWedding) : null
      if (dateWedding && Number.isNaN(dateWedding.getTime())) {
        return badRequest('Tanggal pernikahan tidak valid')
      }
      // Admin boleh mengisi tanggal di luar batas (mis. untuk undangan demo)
      if (dateWedding && !isAdminLevel(auth.level) && dateWedding > maxWeddingDate(undangan.createdAt)) {
        return badRequest('Tanggal pernikahan maksimal 1 tahun sejak undangan dibuat')
      }
      data.dateWedding = dateWedding
    }
    if ('isCovid' in body) {
      data.isCovid = body.isCovid !== undefined ? Number(body.isCovid) : null
    }

    const updated = await prisma.undanganContent.update({
      where: { undanganId: id },
      data,
    })

    // Keep the invitation alive until 2 weeks after the wedding
    if (updated.dateWedding) {
      const next = expiryWithWedding(undangan.expired, updated.dateWedding, undangan.createdAt)
      if (next && next.getTime() !== undangan.expired?.getTime()) {
        await prisma.undangan.update({ where: { id }, data: { expired: next } })
      }
    }

    await revalidateUndanganById(id)

    return ok(resolveContent(updated as unknown as Record<string, unknown>), 'Content updated')
  } catch {
    return serverError()
  }
}
