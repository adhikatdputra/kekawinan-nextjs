export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { ok, badRequest, forbidden, notFound, serverError } from '@/lib/api-response'
import { isActiveCollaborator } from '@/lib/undangan-access'

function normalizePhone(rawPhone: unknown): { phone: string | null; error: string | null } {
  // Convert to string — Excel may give number type (e.g. 85772193242)
  let str = String(rawPhone ?? '').trim()
  if (!str || str === 'undefined' || str === 'null') return { phone: null, error: 'No. WhatsApp wajib diisi' }

  // Strip all non-digit characters
  str = str.replace(/\D/g, '')
  if (!str) return { phone: null, error: 'No. WhatsApp tidak valid' }

  // Awalan 8 (misal 85772193242) → anggap 085772193242
  if (str.startsWith('8')) {
    str = '0' + str
  }

  // Must start with 08 or 62 after normalization
  if (!str.startsWith('08') && !str.startsWith('62')) {
    return { phone: null, error: 'No. WhatsApp harus diawali 08 atau 62' }
  }

  // Normalize
  if (str.startsWith('0')) {
    str = '+62' + str.slice(1)
  } else if (str.startsWith('62')) {
    str = '+' + str
  }

  return { phone: str, error: null }
}

function normalizeName(rawName: unknown): { name: string | null; error: string | null } {
  const str = String(rawName ?? '').replace(/&/g, 'dan').replace(/[^\w\s]/gi, '').trim()
  if (!str) return { name: null, error: 'Nama tamu tidak valid' }
  return { name: str, error: null }
}

function normalizeMaxInvite(rawMax: unknown): { maxInvite: number; error: string | null } {
  if (rawMax === undefined || rawMax === null || rawMax === '') return { maxInvite: 1, error: null }
  const num = parseInt(String(rawMax), 10)
  if (isNaN(num) || num < 1 || num > 20) {
    return { maxInvite: 1, error: 'Total tamu harus angka 1-20' }
  }
  return { maxInvite: num, error: null }
}

// POST /api/tamu/bulk-import
export async function POST(request: NextRequest) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const formData = await request.formData()
    const undanganId = formData.get('undanganId') as string | null
    const file = formData.get('file') as File | null

    if (!undanganId) return badRequest('undanganId wajib diisi')
    if (!file) return badRequest('File wajib diupload')

    const undangan = await prisma.undangan.findUnique({ where: { id: undanganId } })
    if (!undangan) return notFound('Undangan tidak ditemukan')
    if (
      !isAdminLevel(auth.level) &&
      undangan.userId !== auth.id &&
      !(await isActiveCollaborator(auth.id, undanganId))
    ) {
      return forbidden('Akses ditolak')
    }

    // Parse xlsx — dynamic import agar tidak dianalisis saat build
    const XLSX = await import('xlsx')
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const workbook = XLSX.read(buffer, { type: 'buffer' })

    const sheetName = workbook.SheetNames.find((n) => n.toUpperCase() === 'TAMU') ?? workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) return badRequest('Sheet TAMU tidak ditemukan dalam file')

    // Get raw array rows (header at index 0, data from index 1)
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    const dataRows = rows.slice(1) // skip header row

    const validTamu: { id: string; undanganId: string; name: string; phone: string; maxInvite: number }[] = []
    const failedLogs: {
      id: string
      undanganId: string
      batchId: string
      rowNumber: number
      name: string | null
      phone: string | null
      maxInvite: number | null
      errorMessage: string
    }[] = []

    const batchId = nanoid()

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNumber = i + 2 // 1-indexed, row 1 is header

      // Skip completely empty rows
      if (!row || row.every((cell) => cell === undefined || cell === null || String(cell).trim() === '')) {
        continue
      }

      const rawName = row[0]
      const rawPhone = row[1]
      const rawMax = row[2]

      const { name, error: nameError } = normalizeName(rawName)
      const { phone, error: phoneError } = normalizePhone(rawPhone)
      const { maxInvite, error: maxError } = normalizeMaxInvite(rawMax)

      const errors = [nameError, phoneError, maxError].filter(Boolean)

      if (errors.length > 0) {
        failedLogs.push({
          id: nanoid(),
          undanganId,
          batchId,
          rowNumber,
          name: name ?? (String(rawName ?? '').trim() || null),
          phone: phone ?? (String(rawPhone ?? '').trim() || null),
          maxInvite: maxError ? null : maxInvite,
          errorMessage: errors.join('; '),
        })
      } else {
        validTamu.push({
          id: nanoid(),
          undanganId,
          name: name!,
          phone: phone!,
          maxInvite,
        })
      }
    }

    // Bulk insert valid tamu
    let successCount = 0
    if (validTamu.length > 0) {
      const result = await prisma.tamu.createMany({
        data: validTamu,
        skipDuplicates: true,
      })
      successCount = result.count
    }

    // Save failed logs
    if (failedLogs.length > 0) {
      await prisma.tamuBulkLog.createMany({
        data: failedLogs,
      })
    }

    return ok(
      {
        success_count: successCount,
        failed_count: failedLogs.length,
        batch_id: batchId,
        total: validTamu.length + failedLogs.length,
      },
      'Import selesai',
    )
  } catch (err) {
    console.error('[bulk-import]', err)
    return serverError()
  }
}
