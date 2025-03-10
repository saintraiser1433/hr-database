/*
  Warnings:

  - You are about to drop the `AssignTemplate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `templateHeaderId` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssignTemplate" DROP CONSTRAINT "AssignTemplate_peerId_fkey";

-- DropForeignKey
ALTER TABLE "AssignTemplate" DROP CONSTRAINT "AssignTemplate_templateHeaderId_fkey";

-- AlterTable
ALTER TABLE "Peer" ADD COLUMN     "templateHeaderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "AssignTemplate";

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
