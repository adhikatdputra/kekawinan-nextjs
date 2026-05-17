import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/jwt'
import { forbidden, notFound, serverError } from '@/lib/api-response'
import { BASE_URL } from '@/lib/config'

type Params = { params: Promise<{ id: string }> }

// GET /api/undangan/[id]/qr-download — Owner only (id = permalink/slug)
export async function GET(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  const { id: slug } = await params

  try {
    const undangan = await prisma.undangan.findUnique({
      where: { permalink: slug },
      select: { id: true, userId: true, packageType: true },
    })
    if (!undangan) return notFound('Undangan tidak ditemukan')
    if (undangan.userId !== auth.id) return forbidden('Hanya Owner yang dapat mendownload QR')

    const tamuList = await prisma.tamu.findMany({
      where: { undanganId: undangan.id },
      select: { id: true, name: true },
    })

    if (tamuList.length === 0) {
      return new NextResponse('Tidak ada tamu untuk di-generate QR-nya', { status: 400 })
    }

    const zip = new JSZip()

    await Promise.all(
      tamuList.map(async (tamu) => {
        const url = `${BASE_URL}/${slug}/${tamu.id}`
        const qrBuffer = await QRCode.toBuffer(url, { width: 400, margin: 2 })
        const fileName = `${(tamu.name ?? tamu.id).replace(/[^a-zA-Z0-9\s-]/g, '').trim()}.png`
        zip.file(fileName, qrBuffer)
      })
    )

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="qr-tamu-${slug}.zip"`,
      },
    })
  } catch {
    return serverError()
  }
}
