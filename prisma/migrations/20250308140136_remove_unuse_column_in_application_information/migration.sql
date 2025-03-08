/*
  Warnings:

  - You are about to drop the column `nicename` on the `ApplicantInformation` table. All the data in the column will be lost.
  - You are about to drop the column `parents_current_address` on the `ApplicantInformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApplicantInformation" DROP COLUMN "nicename",
DROP COLUMN "parents_current_address";
