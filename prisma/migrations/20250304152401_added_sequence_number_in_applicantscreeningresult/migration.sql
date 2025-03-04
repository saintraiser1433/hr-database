/*
  Warnings:

  - Added the required column `sequence_number` to the `ApplicantScreeningResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApplicantScreeningResult" ADD COLUMN     "sequence_number" INTEGER NOT NULL;
