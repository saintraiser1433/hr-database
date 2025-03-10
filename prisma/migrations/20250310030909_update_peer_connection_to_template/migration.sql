/*
  Warnings:

  - You are about to drop the column `templateHeaderId` on the `Peer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Peer" DROP CONSTRAINT "Peer_templateHeaderId_fkey";

-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "templateHeaderId";

-- AlterTable
ALTER TABLE "TemplateHeader" ADD COLUMN     "peerId" INTEGER;

-- AddForeignKey
ALTER TABLE "TemplateHeader" ADD CONSTRAINT "TemplateHeader_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Peer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
