/*
  Warnings:

  - Made the column `applicantId` on table `ApplicantScreeningResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ApplicantScreeningResult" DROP CONSTRAINT "ApplicantScreeningResult_applicantId_fkey";

-- AlterTable
ALTER TABLE "ApplicantScreeningResult" ALTER COLUMN "applicantId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ApplicantScreeningResult" ADD CONSTRAINT "ApplicantScreeningResult_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
