/*
  Warnings:

  - You are about to drop the column `dateInterview` on the `ApplicantScreening` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApplicantScreening" DROP COLUMN "dateInterview",
ADD COLUMN     "applicantInterviewDatesId" INTEGER;

-- CreateTable
CREATE TABLE "ApplicantInterviewDates" (
    "id" SERIAL NOT NULL,
    "dateInterview" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicantInterviewDates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApplicantScreening" ADD CONSTRAINT "ApplicantScreening_applicantInterviewDatesId_fkey" FOREIGN KEY ("applicantInterviewDatesId") REFERENCES "ApplicantInterviewDates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
