/*
  Warnings:

  - You are about to drop the `AssigningTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssigningTemplate" DROP CONSTRAINT "AssigningTemplate_peerId_fkey";

-- DropForeignKey
ALTER TABLE "AssigningTemplate" DROP CONSTRAINT "AssigningTemplate_templateHeaderId_fkey";

-- AlterTable
ALTER TABLE "Peer" ADD COLUMN     "templateHeaderId" INTEGER;

-- DropTable
DROP TABLE "AssigningTemplate";

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
