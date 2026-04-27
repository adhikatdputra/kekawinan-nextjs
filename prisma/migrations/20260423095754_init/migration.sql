-- CreateTable
CREATE TABLE "tbl_users" (
    "id" VARCHAR(255) NOT NULL,
    "fullname" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "level" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(50),
    "dob" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    "isMember" INTEGER NOT NULL DEFAULT 0,
    "expiredMember" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_theme" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(255),
    "thumbnail" TEXT,
    "componentName" TEXT,
    "linkUrl" TEXT,
    "credit" INTEGER NOT NULL DEFAULT 0,
    "promo" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_undangan" (
    "id" VARCHAR(64) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "permalink" TEXT NOT NULL,
    "name" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    "expired" TIMESTAMP(3),
    "themeId" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_undangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_tamu" (
    "id" VARCHAR(64) NOT NULL,
    "undanganId" VARCHAR(64) NOT NULL,
    "name" VARCHAR(255),
    "phone" VARCHAR(50),
    "sendStatus" INTEGER,
    "isRead" INTEGER,
    "isConfirm" INTEGER,
    "maxInvite" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_tamu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_ucapan" (
    "id" VARCHAR(64) NOT NULL,
    "undanganId" VARCHAR(64) NOT NULL,
    "name" VARCHAR(255),
    "message" TEXT,
    "attend" VARCHAR(50),
    "attendTotal" INTEGER,
    "isShow" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_ucapan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_undangan_content" (
    "id" VARCHAR(64) NOT NULL,
    "undanganId" VARCHAR(64) NOT NULL,
    "title" VARCHAR(255),
    "nameMale" VARCHAR(255),
    "nameFemale" VARCHAR(255),
    "dateWedding" TIMESTAMP(3),
    "motherFemale" VARCHAR(255),
    "fatherFemale" VARCHAR(255),
    "motherMale" VARCHAR(255),
    "fatherMale" VARCHAR(255),
    "maleNo" VARCHAR(30),
    "femaleNo" VARCHAR(30),
    "akadTime" VARCHAR(255),
    "akadPlace" TEXT,
    "resepsiTime" VARCHAR(255),
    "resepsiPlace" TEXT,
    "gmaps" TEXT,
    "streamLink" TEXT,
    "imgBg" TEXT,
    "imgMale" TEXT,
    "imgFemale" TEXT,
    "imgThumbnail" TEXT,
    "music" TEXT,
    "isCovid" INTEGER,
    "religionVersion" VARCHAR(24) NOT NULL DEFAULT 'ISLAM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_undangan_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_undangan_gift" (
    "id" VARCHAR(64) NOT NULL,
    "undanganId" VARCHAR(64) NOT NULL,
    "bankName" VARCHAR(255),
    "name" VARCHAR(255),
    "bankNumber" VARCHAR(50),
    "nameAddress" VARCHAR(255),
    "phone" VARCHAR(50),
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_undangan_gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_undangan_gallery" (
    "id" VARCHAR(64) NOT NULL,
    "undanganId" VARCHAR(64) NOT NULL,
    "image" TEXT,
    "rank" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_undangan_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_kado" (
    "id" VARCHAR(64) NOT NULL,
    "undanganId" VARCHAR(64) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "price" VARCHAR(255),
    "thumbnail" TEXT,
    "linkProduct" TEXT,
    "name" VARCHAR(255),
    "phone" VARCHAR(255),
    "isConfirm" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_kado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_user_subscriber" (
    "id" VARCHAR(64) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "paymentMethod" VARCHAR(255),
    "purchaseStatus" VARCHAR(50),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_user_subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_reset_password" (
    "id" VARCHAR(64) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "expiredAt" TIMESTAMP(3),
    "token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_reset_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_images" (
    "contentId" VARCHAR(255) NOT NULL,
    "setting" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tbl_images_pkey" PRIMARY KEY ("contentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_email_key" ON "tbl_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_undangan_permalink_key" ON "tbl_undangan"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_undangan_content_undanganId_key" ON "tbl_undangan_content"("undanganId");

-- AddForeignKey
ALTER TABLE "tbl_undangan" ADD CONSTRAINT "tbl_undangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_undangan" ADD CONSTRAINT "tbl_undangan_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "tbl_theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_tamu" ADD CONSTRAINT "tbl_tamu_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "tbl_undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_ucapan" ADD CONSTRAINT "tbl_ucapan_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "tbl_undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_undangan_content" ADD CONSTRAINT "tbl_undangan_content_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "tbl_undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_undangan_gift" ADD CONSTRAINT "tbl_undangan_gift_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "tbl_undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_undangan_gallery" ADD CONSTRAINT "tbl_undangan_gallery_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "tbl_undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kado" ADD CONSTRAINT "tbl_kado_undanganId_fkey" FOREIGN KEY ("undanganId") REFERENCES "tbl_undangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_user_subscriber" ADD CONSTRAINT "tbl_user_subscriber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_reset_password" ADD CONSTRAINT "tbl_reset_password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
