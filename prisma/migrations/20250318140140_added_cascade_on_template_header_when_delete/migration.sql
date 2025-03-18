-- DropForeignKey
ALTER TABLE "TemplateDetail" DROP CONSTRAINT "TemplateDetail_templateId_fkey";

-- AddForeignKey
ALTER TABLE "TemplateDetail" ADD CONSTRAINT "TemplateDetail_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateHeader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
