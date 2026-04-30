import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, serverError } from '@/lib/api-response'

// Key yang boleh diubah via API ini (Phase 1 — hanya credit & withdrawal)
const ALLOWED_KEYS = ['credit_value', 'min_withdrawal']

// GET /api/admin/settings — ambil semua settings + 5 log terakhir per key
export async function GET(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const [settings, logs] = await prisma.$transaction([
      prisma.setting.findMany({ orderBy: { key: 'asc' } }),
      prisma.settingLog.findMany({
        orderBy: { changedAt: 'desc' },
        take: 20,
      }),
    ])

    return ok({ settings, logs }, 'Get settings success')
  } catch {
    return serverError()
  }
}

// PATCH /api/admin/settings — update satu atau lebih setting, auto-log perubahan
export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!isAdminLevel(auth.level)) return forbidden('Admin access required')

  try {
    const body = await request.json()

    // body berupa object { key: value, ... }
    const entries = Object.entries(body) as [string, unknown][]

    if (entries.length === 0) {
      return badRequest('Tidak ada data yang dikirim')
    }

    const invalidKeys = entries.filter(([key]) => !ALLOWED_KEYS.includes(key)).map(([key]) => key)
    if (invalidKeys.length > 0) {
      return badRequest(`Key tidak diizinkan: ${invalidKeys.join(', ')}`)
    }

    const results: Record<string, string> = {}

    for (const [key, rawValue] of entries) {
      const value = String(rawValue).trim()

      if (!value) {
        return badRequest(`Nilai untuk key '${key}' tidak boleh kosong`)
      }
      if (isNaN(Number(value)) || Number(value) < 0) {
        return badRequest(`Nilai untuk key '${key}' harus angka positif`)
      }

      const current = await prisma.setting.findUnique({ where: { key } })

      await prisma.$transaction([
        prisma.setting.upsert({
          where: { key },
          update: { value, updatedBy: auth.id },
          create: { key, value, updatedBy: auth.id },
        }),
        prisma.settingLog.create({
          data: {
            settingKey: key,
            oldValue: current?.value ?? null,
            newValue: value,
            changedBy: auth.id,
          },
        }),
      ])

      results[key] = value
    }

    return ok(results, 'Settings berhasil diperbarui')
  } catch {
    return serverError()
  }
}
