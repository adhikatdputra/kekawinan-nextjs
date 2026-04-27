/*
  Warnings:

  - You are about to alter the column `permalink` on the `tbl_undangan` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Made the column `sendStatus` on table `tbl_tamu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isRead` on table `tbl_tamu` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isConfirm` on table `tbl_tamu` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tbl_undangan" DROP CONSTRAINT "tbl_undangan_themeId_fkey";

-- AlterTable
ALTER TABLE "tbl_tamu" ALTER COLUMN "sendStatus" SET NOT NULL,
ALTER COLUMN "sendStatus" SET DEFAULT 0,
ALTER COLUMN "isRead" SET NOT NULL,
ALTER COLUMN "isRead" SET DEFAULT 0,
ALTER COLUMN "isConfirm" SET NOT NULL,
ALTER COLUMN "isConfirm" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "tbl_undangan" ALTER COLUMN "permalink" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "themeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tbl_undangan" ADD CONSTRAINT "tbl_undangan_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "tbl_theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
