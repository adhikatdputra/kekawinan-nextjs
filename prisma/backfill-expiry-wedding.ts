import { PrismaClient } from "@prisma/client";
import { expiryWithWedding } from "../src/lib/undangan-expiry";

const prisma = new PrismaClient();

// Applies the "3 months or 2 weeks after the wedding, whichever is later" rule
// to existing invitations. Dry run by default; pass --apply to write.
//   pnpm tsx prisma/backfill-expiry-wedding.ts          (lihat saja)
//   pnpm tsx prisma/backfill-expiry-wedding.ts --apply  (tulis ke DB)
async function main() {
  const apply = process.argv.includes("--apply");
  const now = new Date();

  // Only invitations with a wedding date can change. Bounded by the number of
  // ACTIVE invitations (a few hundred), read once.
  const rows = await prisma.undangan.findMany({
    where: { status: "ACTIVE", content: { dateWedding: { not: null } } },
    select: {
      id: true,
      permalink: true,
      expired: true,
      createdAt: true,
      content: { select: { dateWedding: true } },
    },
  });

  const changes = rows
    .map((u) => ({ ...u, next: expiryWithWedding(u.expired, u.content?.dateWedding, u.createdAt) }))
    .filter((u) => u.next && u.next.getTime() !== u.expired?.getTime());

  const revived = changes.filter((u) => u.expired && u.expired <= now && u.next! > now);

  console.log(`Undangan aktif dengan tanggal pernikahan: ${rows.length}`);
  console.log(`Masa aktifnya akan diperpanjang: ${changes.length}`);
  console.log(`  di antaranya sudah kedaluwarsa dan akan aktif lagi: ${revived.length}`);
  for (const u of changes) {
    console.log(
      `  ${u.permalink}: ${u.expired?.toISOString().slice(0, 10) ?? "-"} -> ${u.next!.toISOString().slice(0, 10)}`,
    );
  }

  if (!apply) {
    console.log("\nDry run. Jalankan dengan --apply untuk menyimpan.");
    return;
  }

  for (const u of changes) {
    await prisma.undangan.update({ where: { id: u.id }, data: { expired: u.next } });
  }
  console.log(`\nTersimpan: ${changes.length} undangan.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
