/*
  Warnings:

  - You are about to drop the `ApplicantInterviewDates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicantScreening` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicantInterviewDates" DROP CONSTRAINT "ApplicantInterviewDates_applicantScreeningId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantScreening" DROP CONSTRAINT "ApplicantScreening_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantScreening" DROP CONSTRAINT "ApplicantScreening_jobId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicantScreening" DROP CONSTRAINT "ApplicantScreening_screeningId_fkey";

-- DropTable
DROP TABLE "ApplicantInterviewDates";

-- DropTable
DROP TABLE "ApplicantScreening";

-- CreateTable
CREATE TABLE "ApplicantScreeningResult" (
    "id" SERIAL NOT NULL,
    "dateInterview" TIMESTAMP(3),
    "applicantId" INTEGER,
    "screeningId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobId" INTEGER,

    CONSTRAINT "ApplicantScreeningResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApplicantScreeningResult" ADD CONSTRAINT "ApplicantScreeningResult_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantScreeningResult" ADD CONSTRAINT "ApplicantScreeningResult_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantScreeningResult" ADD CONSTRAINT "ApplicantScreeningResult_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
