/*
  Warnings:

  - Added the required column `sequence_number` to the `JobScreening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobScreening" ADD COLUMN     "sequence_number" INTEGER NOT NULL;
