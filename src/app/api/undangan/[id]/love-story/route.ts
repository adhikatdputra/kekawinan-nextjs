import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

async function getOwnedUndangan(undanganId: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
  if (!undangan) return { undangan: null, error: notFound('Undangan tidak ditemukan') }
  if (!isAdminLevel(level) && undangan.userId !== userId) {
    return { undangan: null, error: forbidden('Akses ditolak') }
  }
  return { undangan, error: null }
}

// GET /api/undangan/:id/love-story
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const items = await prisma.loveStory.findMany({
      where: { undanganId: id },
      orderBy: { rank: 'asc' },
    })

    return ok(items.map(item => ({ ...item, image: item.image ? resolveMediaUrl(item.image) : null })), 'Get love story success')
  } catch (err) {
    console.error('[love-story GET]', err)
    return serverError()
  }
}

// POST /api/undangan/:id/love-story
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { image, waktu, lokasi, story } = body

    if (!story?.trim()) return badRequest('Story wajib diisi')

    const item = await prisma.$transaction(async (tx) => {
      const maxRankItem = await tx.loveStory.findFirst({
        where: { undanganId: id },
        orderBy: { rank: 'desc' },
        select: { rank: true },
      })
      const nextRank = (maxRankItem?.rank ?? 0) + 1
      return tx.loveStory.create({
        data: {
          id: nanoid(),
          undanganId: id,
          image: image || null,
          waktu: waktu || null,
          lokasi: lokasi || null,
          story,
          rank: nextRank,
        },
      })
    })

    return created({ ...item, image: item.image ? resolveMediaUrl(item.image) : null }, 'Love story berhasil ditambahkan')
  } catch (err) {
    console.error('[love-story POST]', err)
    return serverError()
  }
}
