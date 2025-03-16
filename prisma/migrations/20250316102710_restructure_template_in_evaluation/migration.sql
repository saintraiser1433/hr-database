/*
  Warnings:

  - You are about to drop the column `templateHeaderId` on the `Peer` table. All the data in the column will be lost.
  - You are about to drop the column `templateHeaderId` on the `TeamLeadEvaluation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Peer" DROP CONSTRAINT "Peer_templateHeaderId_fkey";

-- DropForeignKey
ALTER TABLE "TeamLeadEvaluation" DROP CONSTRAINT "TeamLeadEvaluation_templateHeaderId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "peerTemplateId" INTEGER,
ADD COLUMN     "teamLeadTemplateId" INTEGER;

-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "templateHeaderId";

-- AlterTable
ALTER TABLE "TeamLeadEvaluation" DROP COLUMN "templateHeaderId";

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_peerTemplateId_fkey" FOREIGN KEY ("peerTemplateId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_teamLeadTemplateId_fkey" FOREIGN KEY ("teamLeadTemplateId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
