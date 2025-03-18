/*
  Warnings:

  - You are about to drop the `Peer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Peer" DROP CONSTRAINT "Peer_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_peerId_fkey";

-- DropTable
DROP TABLE "Peer";

-- CreateTable
CREATE TABLE "PeerCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "percentage" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PeerCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerCategory_name_key" ON "PeerCategory"("name");

-- AddForeignKey
ALTER TABLE "PeerCategory" ADD CONSTRAINT "PeerCategory_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "PeerCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
