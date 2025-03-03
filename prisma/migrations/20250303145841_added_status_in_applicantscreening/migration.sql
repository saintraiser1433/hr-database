/*
  Warnings:

  - Added the required column `status` to the `ApplicantScreening` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScreeningStatus" AS ENUM ('PASSED', 'FAILED');

-- AlterTable
ALTER TABLE "ApplicantScreening" ADD COLUMN     "status" "ScreeningStatus" NOT NULL;
