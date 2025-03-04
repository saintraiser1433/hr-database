/*
  Warnings:

  - You are about to drop the column `jobId` on the `ApplicantScreeningResult` table. All the data in the column will be lost.
  - Added the required column `status` to the `ApplicantScreeningResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApplicantScreeningResult" DROP CONSTRAINT "ApplicantScreeningResult_jobId_fkey";

-- AlterTable
ALTER TABLE "ApplicantScreeningResult" DROP COLUMN "jobId",
ADD COLUMN     "status" "ScreeningStatus" NOT NULL;
