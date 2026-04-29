/**
 * Script migrasi data dari MySQL (backend lama) ke Supabase via Prisma
 *
 * Urutan migrasi mengikuti relasi foreign key:
 * 1. tbl_theme
 * 2. tbl_users
 * 3. tbl_user_subscriber
 * 4. tbl_reset_password
 * 5. tbl_undangan
 * 6. tbl_tamu
 * 7. tbl_ucapan
 * 8. tbl_undangan_content
 * 9. tbl_undangan_gift
 * 10. tbl_undangan_gallery
 * 11. tbl_kado
 * 12. tbl_images
 *
 * Cara menjalankan:
 *   npx tsx scripts/migrate-data.ts
 *
 * Pastikan .env.local sudah diisi dengan:
 *   - DATABASE_URL dan DIRECT_URL (Supabase)
 *   - MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_NAME (MySQL lama)
 */

import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function createMysqlConnection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB_NAME || 'kekawinan_db',
    timezone: '+00:00',
  })
}

async function migrateTheme(conn: mysql.Connection) {
  console.log('\n[1/12] Migrasi tbl_theme...')
  const [rows] = await conn.execute('SELECT * FROM tbl_theme')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.theme.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          name: row.name,
          thumbnail: row.thumbnail,
          componentName: row.component_name,
          linkUrl: row.link_url,
          credit: row.credit ?? 0,
          promo: row.promo ?? 0,
          isActive: row.isActive ?? true,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ theme id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} theme berhasil`)
}

async function migrateUsers(conn: mysql.Connection) {
  console.log('\n[2/12] Migrasi tbl_users...')
  const [rows] = await conn.execute('SELECT * FROM tbl_users')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.user.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          fullname: row.fullname,
          email: row.email,
          password: row.password,
          level: row.level,
          phone: row.phone,
          dob: row.dob,
          status: row.status ?? 'ACTIVE',
          isMember: row.is_member ?? 0,
          expiredMember: row.expired_member,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ user id=${row.id} (${row.email}):`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} users berhasil`)
}

async function migrateUserSubscriber(conn: mysql.Connection) {
  console.log('\n[3/12] Migrasi tbl_user_subscriber...')
  const [rows] = await conn.execute('SELECT * FROM tbl_user_subscriber')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.userSubscriber.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          userId: row.user_id,
          purchaseDate: row.purchase_date,
          paymentMethod: row.payment_method,
          purchaseStatus: row.purchase_status,
          image: row.image,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ subscriber id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} subscriber berhasil`)
}

async function migrateResetPassword(conn: mysql.Connection) {
  console.log('\n[4/12] Migrasi tbl_reset_password...')
  const [rows] = await conn.execute('SELECT * FROM tbl_reset_password')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.resetPassword.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          userId: row.user_id,
          expiredAt: row.expired_at,
          token: row.token,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ reset_password id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} reset_password berhasil`)
}

async function migrateUndangan(conn: mysql.Connection) {
  console.log('\n[5/12] Migrasi tbl_undangan...')
  const [rows] = await conn.execute('SELECT * FROM tbl_undangan')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.undangan.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          userId: row.user_id,
          permalink: row.permalink,
          name: row.name,
          status: row.status ?? 'ACTIVE',
          expired: row.expired,
          themeId: row.theme_id,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ undangan id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} undangan berhasil`)
}

async function migrateTamu(conn: mysql.Connection) {
  console.log('\n[6/12] Migrasi tbl_tamu...')
  const [rows] = await conn.execute('SELECT * FROM tbl_tamu')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.tamu.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          undanganId: row.undangan_id,
          name: row.name,
          phone: row.phone,
          sendStatus: row.send_status,
          isRead: row.is_read,
          isConfirm: row.is_confirm,
          maxInvite: row.max_invite,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ tamu id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} tamu berhasil`)
}

async function migrateUcapan(conn: mysql.Connection) {
  console.log('\n[7/12] Migrasi tbl_ucapan...')
  const [rows] = await conn.execute('SELECT * FROM tbl_ucapan')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.ucapan.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          undanganId: row.undangan_id,
          name: row.name,
          message: row.message,
          attend: row.attend,
          attendTotal: row.attend_total,
          isShow: row.is_show ?? 1,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ ucapan id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} ucapan berhasil`)
}

async function migrateUndanganContent(conn: mysql.Connection) {
  console.log('\n[8/12] Migrasi tbl_undangan_content...')
  const [rows] = await conn.execute('SELECT * FROM tbl_undangan_content')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.undanganContent.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          undanganId: row.undangan_id,
          title: row.title,
          nameMale: row.name_male,
          nameFemale: row.name_female,
          dateWedding: row.date_wedding,
          motherFemale: row.mother_female,
          fatherFemale: row.father_female,
          motherMale: row.mother_male,
          fatherMale: row.father_male,
          maleNo: row.male_no,
          femaleNo: row.female_no,
          akadTime: row.akad_time,
          akadPlace: row.akad_place,
          resepsiTime: row.resepsi_time,
          resepsiPlace: row.resepsi_place,
          gmaps: row.gmaps,
          streamLink: row.stream_link,
          imgBg: row.img_bg,
          imgMale: row.img_male,
          imgFemale: row.img_female,
          imgThumbnail: row.img_thumbnail,
          music: row.music,
          isCovid: row.is_covid,
          religionVersion: row.religion_version ?? 'ISLAM',
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ undangan_content id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} undangan_content berhasil`)
}

async function migrateUndanganGift(conn: mysql.Connection) {
  console.log('\n[9/12] Migrasi tbl_undangan_gift...')
  const [rows] = await conn.execute('SELECT * FROM tbl_undangan_gift')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.undanganGift.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          undanganId: row.undangan_id,
          bankName: row.bank_name,
          name: row.name,
          bankNumber: row.bank_number,
          nameAddress: row.name_address,
          phone: row.phone,
          address: row.address,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ undangan_gift id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} undangan_gift berhasil`)
}

async function migrateUndanganGallery(conn: mysql.Connection) {
  console.log('\n[10/12] Migrasi tbl_undangan_gallery...')
  const [rows] = await conn.execute('SELECT * FROM tbl_undangan_gallery')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.undanganGallery.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          undanganId: row.undangan_id,
          image: row.image,
          rank: row.rank ?? 1,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ gallery id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} gallery berhasil`)
}

async function migrateKado(conn: mysql.Connection) {
  console.log('\n[11/12] Migrasi tbl_kado...')
  const [rows] = await conn.execute('SELECT * FROM tbl_kado')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.kado.upsert({
        where: { id: row.id },
        update: {},
        create: {
          id: row.id,
          undanganId: row.undangan_id,
          title: row.title,
          description: row.description,
          price: row.price,
          thumbnail: row.thumbnail,
          linkProduct: row.link_product,
          name: row.name,
          phone: row.phone,
          isConfirm: row.is_confirm ?? 0,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ kado id=${row.id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} kado berhasil`)
}

async function migrateImages(conn: mysql.Connection) {
  console.log('\n[12/12] Migrasi tbl_images...')
  const [rows] = await conn.execute('SELECT * FROM tbl_images')
  const data = rows as any[]

  let success = 0
  for (const row of data) {
    try {
      await prisma.image.upsert({
        where: { contentId: row.content_id },
        update: {},
        create: {
          contentId: row.content_id,
          setting: row.setting,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      })
      success++
    } catch (e) {
      console.error(`  ✗ image content_id=${row.content_id}:`, (e as Error).message)
    }
  }
  console.log(`  ✓ ${success}/${data.length} images berhasil`)
}

async function main() {
  console.log('=== Migrasi Data MySQL → Supabase ===')
  console.log(`MySQL: ${process.env.MYSQL_USER}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DB_NAME}`)

  const conn = await createMysqlConnection()

  try {
    await migrateTheme(conn)
    await migrateUsers(conn)
    await migrateUserSubscriber(conn)
    await migrateResetPassword(conn)
    await migrateUndangan(conn)
    await migrateTamu(conn)
    await migrateUcapan(conn)
    await migrateUndanganContent(conn)
    await migrateUndanganGift(conn)
    await migrateUndanganGallery(conn)
    await migrateKado(conn)
    await migrateImages(conn)

    console.log('\n=== Migrasi selesai! ===\n')
  } finally {
    await conn.end()
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error('Error fatal:', e)
  process.exit(1)
})
