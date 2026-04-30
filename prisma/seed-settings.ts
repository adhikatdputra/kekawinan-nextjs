import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const settings = [
    {
      key: "credit_value",
      value: "5000",
      description: "Nilai 1 credit dalam rupiah",
    },
    {
      key: "min_withdrawal",
      value: "50000",
      description: "Minimum saldo creator untuk request penarikan",
    },
    {
      key: "creator_ownership_days",
      value: "730",
      description: "Durasi (hari) sebelum tema beralih ke milik Kekawinan.com",
    },
    {
      key: "commission_notice_days",
      value: "60",
      description: "Jumlah hari notice sebelum perubahan rate komisi efektif",
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Settings seed selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
