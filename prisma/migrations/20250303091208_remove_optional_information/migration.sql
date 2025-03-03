/*
  Warnings:

  - Made the column `informationId` on table `Applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_informationId_fkey";

-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "informationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "ApplicantInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
