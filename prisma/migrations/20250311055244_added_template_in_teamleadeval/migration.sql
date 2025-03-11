-- AlterTable
ALTER TABLE "TeamLeadEvaluation" ADD COLUMN     "templateHeaderId" INTEGER;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluation" ADD CONSTRAINT "TeamLeadEvaluation_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
