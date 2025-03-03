/*
  Warnings:

  - Added the required column `photo_path` to the `ApplicantInformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApplicantInformation" ADD COLUMN     "photo_path" TEXT NOT NULL;
