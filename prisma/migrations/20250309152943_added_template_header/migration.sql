-- AlterTable
ALTER TABLE "Peer" ADD COLUMN     "templateHeaderId" INTEGER;

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
