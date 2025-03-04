/*
  Warnings:

  - You are about to drop the column `applicantInterviewDatesId` on the `ApplicantScreening` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicantScreening" DROP CONSTRAINT "ApplicantScreening_applicantInterviewDatesId_fkey";

-- AlterTable
ALTER TABLE "ApplicantInterviewDates" ADD COLUMN     "applicantScreeningApplicantId" INTEGER,
ADD COLUMN     "applicantScreeningJobId" INTEGER,
ADD COLUMN     "applicantScreeningScreeningId" INTEGER;

-- AlterTable
ALTER TABLE "ApplicantScreening" DROP COLUMN "applicantInterviewDatesId";

-- AddForeignKey
ALTER TABLE "ApplicantInterviewDates" ADD CONSTRAINT "ApplicantInterviewDates_applicantScreeningApplicantId_appl_fkey" FOREIGN KEY ("applicantScreeningApplicantId", "applicantScreeningScreeningId", "applicantScreeningJobId") REFERENCES "ApplicantScreening"("applicantId", "screeningId", "jobId") ON DELETE SET NULL ON UPDATE CASCADE;
