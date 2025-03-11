/*
  Warnings:

  - Added the required column `percentage` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Peer" ADD COLUMN     "percentage" DECIMAL(65,30) NOT NULL;
