import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { requireAuth, isAdminLevel } from '@/lib/jwt'
import { created, badRequest, conflict, forbidden, notFound, serverError } from '@/lib/api-response'
import { isValidPermalink } from '@/lib/helpers'

type Params = { params: Promise<{ id: string }> }

// POST /api/undangan/:id/duplicate
// Available to all roles. Duplicates the content of an existing undangan into a brand new one:
// content, gifts (amplop), gallery, love stories, and kado (registry — claim data reset).
// Guests (tamu), ucapan, and collaborators are intentionally NOT copied.
// Media (images/music) keep the same Cloudinary URLs as the source.
// - Admin: bypass credit (free), can duplicate any undangan.
// - Regular user: can only duplicate their own undangan, and pays credit for the target theme
//   just like creating a brand new undangan.
export async function POST(request: NextRequest, { params }: Params) {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json()
    const { permalink, name, themeId } = body

    if (!permalink || !name) {
      return badRequest('Permalink and name are required')
    }
    if (!isValidPermalink(permalink)) {
      return badRequest('Permalink may only contain letters, numbers, hyphens, and underscores (min 3 chars)')
    }

    const existing = await prisma.undangan.findFirst({ where: { permalink } })
    if (existing) return conflict('Permalink is already taken')

    const source = await prisma.undangan.findUnique({
      where: { id },
      include: {
        content: true,
        gifts: true,
        gallery: true,
        loveStories: true,
        kado: true,
      },
    })
    if (!source) return notFound('Undangan not found')

    const isAdmin = isAdminLevel(auth.level)

    // Non-admin may only duplicate an undangan they own
    if (!isAdmin && source.userId !== auth.id) {
      return forbidden('Kamu hanya bisa menduplikat undangan milikmu sendiri')
    }

    // ── Credit handling (non-admin pays for the target theme, admin is free) ──
    let packageType = source.packageType
    let creditIds: string[] = []

    if (!isAdmin) {
      if (!themeId) return badRequest('Pilih tema terlebih dahulu')

      const theme = await prisma.theme.findUnique({ where: { id: themeId } })
      if (!theme) return badRequest('Tema tidak ditemukan')

      // Harga efektif: gunakan promo jika ada (null = tidak ada promo), fallback ke credit
      const cost = theme.promo !== null ? theme.promo : theme.credit
      if (cost === null || cost === undefined) return badRequest('Tema belum memiliki harga credit')

      // Tema berbayar: potong credit AVAILABLE secara FIFO
      if (cost > 0) {
        const availableCredits = await prisma.userCredit.findMany({
          where: { userId: auth.id, status: 'AVAILABLE' },
          take: cost,
          orderBy: { redeemedAt: 'asc' },
          select: { id: true, packageType: true },
        })

        if (availableCredits.length < cost) {
          return forbidden(
            `Credit tidak cukup. Tema ini membutuhkan ${cost} credit, kamu hanya punya ${availableCredits.length}.`,
          )
        }

        packageType = availableCredits[0]?.packageType ?? packageType
        creditIds = availableCredits.map((c) => c.id)
      }
    }

    const newId = nanoid()
    const expiredDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months default

    const ops = []

    // ── Undangan record ──────────────────────────────────────────────────────
    ops.push(
      prisma.undangan.create({
        data: {
          id: newId,
          userId: auth.id, // owned by whoever duplicates
          permalink,
          name,
          themeId: themeId ?? source.themeId ?? null,
          packageType,
          expired: expiredDate,
        },
      }),
    )

    // ── Content (1:1) ────────────────────────────────────────────────────────
    const c = source.content
    ops.push(
      prisma.undanganContent.create({
        data: c
          ? {
              id: nanoid(),
              undanganId: newId,
              title: c.title,
              nameMale: c.nameMale,
              nameFemale: c.nameFemale,
              dateWedding: c.dateWedding,
              motherFemale: c.motherFemale,
              fatherFemale: c.fatherFemale,
              motherMale: c.motherMale,
              fatherMale: c.fatherMale,
              maleNo: c.maleNo,
              femaleNo: c.femaleNo,
              akadTime: c.akadTime,
              akadPlace: c.akadPlace,
              resepsiTime: c.resepsiTime,
              resepsiPlace: c.resepsiPlace,
              gmaps: c.gmaps,
              streamLink: c.streamLink,
              imgBg: c.imgBg,
              imgMale: c.imgMale,
              imgFemale: c.imgFemale,
              imgThumbnail: c.imgThumbnail,
              music: c.music,
              isCovid: c.isCovid,
              religionVersion: c.religionVersion,
            }
          : { id: nanoid(), undanganId: newId },
      }),
    )

    // ── Gifts / amplop digital ───────────────────────────────────────────────
    if (source.gifts.length > 0) {
      ops.push(
        prisma.undanganGift.createMany({
          data: source.gifts.map((g) => ({
            id: nanoid(),
            undanganId: newId,
            bankName: g.bankName,
            name: g.name,
            bankNumber: g.bankNumber,
            nameAddress: g.nameAddress,
            phone: g.phone,
            address: g.address,
          })),
        }),
      )
    } else {
      // keep parity with create flow which always seeds one empty gift row
      ops.push(prisma.undanganGift.create({ data: { id: nanoid(), undanganId: newId } }))
    }

    // ── Gallery ──────────────────────────────────────────────────────────────
    if (source.gallery.length > 0) {
      ops.push(
        prisma.undanganGallery.createMany({
          data: source.gallery.map((g) => ({
            id: nanoid(),
            undanganId: newId,
            image: g.image,
            rank: g.rank,
          })),
        }),
      )
    }

    // ── Love stories ─────────────────────────────────────────────────────────
    if (source.loveStories.length > 0) {
      ops.push(
        prisma.loveStory.createMany({
          data: source.loveStories.map((s) => ({
            id: nanoid(),
            undanganId: newId,
            image: s.image,
            waktu: s.waktu,
            lokasi: s.lokasi,
            story: s.story,
            rank: s.rank,
          })),
        }),
      )
    }

    // ── Kado / registry (copy product, reset claim data) ─────────────────────
    if (source.kado.length > 0) {
      ops.push(
        prisma.kado.createMany({
          data: source.kado.map((k) => ({
            id: nanoid(),
            undanganId: newId,
            title: k.title,
            description: k.description,
            price: k.price,
            thumbnail: k.thumbnail,
            linkProduct: k.linkProduct,
            // claim data intentionally reset
            name: null,
            phone: null,
            isConfirm: 0,
          })),
        }),
      )
    }

    // ── Potong credit (hanya non-admin dengan tema berbayar) ──────────────────
    if (creditIds.length > 0) {
      ops.push(
        prisma.userCredit.updateMany({
          where: { id: { in: creditIds } },
          data: { status: 'USED', usedForUndangan: newId, usedAt: new Date() },
        }),
      )
    }

    const [undangan] = await prisma.$transaction(ops)

    return created(undangan, 'Undangan duplicated')
  } catch {
    return serverError()
  }
}
