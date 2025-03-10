-- DropForeignKey
ALTER TABLE "Peer" DROP CONSTRAINT "Peer_templateHeaderId_fkey";

-- AlterTable
ALTER TABLE "Peer" ALTER COLUMN "templateHeaderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
