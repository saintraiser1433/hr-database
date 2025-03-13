-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_teamLeadCriteriaId_fkey";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_teamLeadCriteriaId_fkey" FOREIGN KEY ("teamLeadCriteriaId") REFERENCES "TeamLeadCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
