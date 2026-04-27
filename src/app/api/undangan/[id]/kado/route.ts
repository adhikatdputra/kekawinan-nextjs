import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { resolveMediaUrl, paginate, parsePagination } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

async function getOwnedUndangan(undanganId: string, userId: string, level: string) {
  const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
  if (!undangan) return { undangan: null, error: notFound('Undangan not found') }
  if (!isAdminLevel(level) && undangan.userId !== userId) {
    return { undangan: null, error: forbidden('Access denied') }
  }
  return { undangan, error: null }
}

function resolveKado(kado: Record<string, unknown>) {
  return { ...kado, thumbnail: resolveMediaUrl(kado.thumbnail as string) }
}

// GET /api/undangan/:id/kado — paginated kado list for an undangan
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const { page, limit, search, sortBy, order } = parsePagination(
      request.nextUrl.searchParams,
      ['title', 'createdAt'],
    )

    const where = {
      undanganId: id,
      ...(search && { title: { contains: search, mode: 'insensitive' as const } }),
    }

    const [rows, count] = await prisma.$transaction([
      prisma.kado.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.kado.count({ where }),
    ])

    return ok(
      paginate(rows.map((k) => resolveKado(k as unknown as Record<string, unknown>)), count, page, limit),
      'Get kado success',
    )
  } catch {
    return serverError()
  }
}

// POST /api/undangan/:id/kado — create a kado/wishlist item
// Upload thumbnail first via /api/upload, then pass the returned URL here.
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const { error } = await getOwnedUndangan(id, auth.id, auth.level)
    if (error) return error

    const body = await request.json()
    const { title, description, price, linkProduct, thumbnail } = body

    if (!title || !description || !price || !linkProduct) {
      return badRequest('title, description, price, and linkProduct are required')
    }

    const kado = await prisma.kado.create({
      data: {
        id: nanoid(),
        undanganId: id,
        title: title.trim(),
        description: description.trim(),
        price: String(price).trim(),
        linkProduct: linkProduct.trim(),
        thumbnail: thumbnail || null,
      },
    })

    return created(resolveKado(kado as unknown as Record<string, unknown>), 'Kado created successfully')
  } catch {
    return serverError()
  }
}
