/*
  Warnings:

  - You are about to drop the column `imagePath` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "imagePath",
ADD COLUMN     "headerImage" TEXT;
