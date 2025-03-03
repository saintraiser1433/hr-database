/*
  Warnings:

  - Added the required column `rejectedAt` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "rejectedAt" TIMESTAMP(3) NOT NULL;
