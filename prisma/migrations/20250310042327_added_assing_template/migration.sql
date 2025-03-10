/*
  Warnings:

  - You are about to drop the column `templateHeaderId` on the `Peer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Peer" DROP CONSTRAINT "Peer_templateHeaderId_fkey";

-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "templateHeaderId";

-- CreateTable
CREATE TABLE "AssignTemplate" (
    "id" SERIAL NOT NULL,
    "templateHeaderId" INTEGER,
    "peerId" INTEGER,

    CONSTRAINT "AssignTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignTemplate" ADD CONSTRAINT "AssignTemplate_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignTemplate" ADD CONSTRAINT "AssignTemplate_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Peer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
