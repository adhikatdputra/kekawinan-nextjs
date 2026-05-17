import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, created, badRequest, forbidden, serverError } from '@/lib/api-response'

// GET /api/admin/master-data/theme-components
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const components = await prisma.themeComponent.findMany({
      orderBy: { name: 'asc' },
    })
    return ok(components, 'Get theme components success')
  } catch {
    return serverError()
  }
}

// POST /api/admin/master-data/theme-components
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const description = body.description ? String(body.description).trim() : null

    if (!name) return badRequest('Nama component wajib diisi')
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(name)) {
      return badRequest('Nama component hanya boleh huruf, angka, underscore, dan dash')
    }

    const existing = await prisma.themeComponent.findUnique({ where: { name } })
    if (existing) return badRequest('Component dengan nama ini sudah ada')

    const component = await prisma.themeComponent.create({
      data: { id: nanoid(), name, description },
    })
    return created(component, 'Theme component berhasil dibuat')
  } catch {
    return serverError()
  }
}
