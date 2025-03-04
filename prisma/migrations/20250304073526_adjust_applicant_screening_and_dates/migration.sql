/*
  Warnings:

  - The primary key for the `ApplicantInterviewDates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `applicantScreeningApplicantId` on the `ApplicantInterviewDates` table. All the data in the column will be lost.
  - You are about to drop the column `applicantScreeningJobId` on the `ApplicantInterviewDates` table. All the data in the column will be lost.
  - You are about to drop the column `applicantScreeningScreeningId` on the `ApplicantInterviewDates` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ApplicantInterviewDates` table. All the data in the column will be lost.
  - The primary key for the `ApplicantScreening` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `applicantScreeningId` to the `ApplicantInterviewDates` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApplicantInterviewDates" DROP CONSTRAINT "ApplicantInterviewDates_applicantScreeningApplicantId_appl_fkey";

-- AlterTable
ALTER TABLE "ApplicantInterviewDates" DROP CONSTRAINT "ApplicantInterviewDates_pkey",
DROP COLUMN "applicantScreeningApplicantId",
DROP COLUMN "applicantScreeningJobId",
DROP COLUMN "applicantScreeningScreeningId",
DROP COLUMN "id",
ADD COLUMN     "applicantScreeningId" INTEGER NOT NULL,
ADD CONSTRAINT "ApplicantInterviewDates_pkey" PRIMARY KEY ("applicantScreeningId");

-- AlterTable
ALTER TABLE "ApplicantScreening" DROP CONSTRAINT "ApplicantScreening_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ApplicantScreening_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "ApplicantInterviewDates" ADD CONSTRAINT "ApplicantInterviewDates_applicantScreeningId_fkey" FOREIGN KEY ("applicantScreeningId") REFERENCES "ApplicantScreening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
