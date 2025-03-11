/*
  Warnings:

  - The `teamLeadSubcategoryId` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TeamLeadSubcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TeamLeadSubcategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_teamLeadSubcategoryId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "teamLeadSubcategoryId",
ADD COLUMN     "teamLeadSubcategoryId" INTEGER;

-- AlterTable
ALTER TABLE "TeamLeadSubcategory" DROP CONSTRAINT "TeamLeadSubcategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TeamLeadSubcategory_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_teamLeadSubcategoryId_fkey" FOREIGN KEY ("teamLeadSubcategoryId") REFERENCES "TeamLeadSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
