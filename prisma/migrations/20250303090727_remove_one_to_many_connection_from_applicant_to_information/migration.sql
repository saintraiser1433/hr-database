/*
  Warnings:

  - You are about to drop the column `applicantId` on the `ApplicantInformation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicantInformation" DROP CONSTRAINT "ApplicantInformation_applicantId_fkey";

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "informationId" INTEGER;

-- AlterTable
ALTER TABLE "ApplicantInformation" DROP COLUMN "applicantId";

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "ApplicantInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
