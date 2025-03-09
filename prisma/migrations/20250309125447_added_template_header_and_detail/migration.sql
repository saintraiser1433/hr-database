/*
  Warnings:

  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Template";

-- CreateTable
CREATE TABLE "TemplateHeader" (
    "id" SERIAL NOT NULL,
    "template_name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TemplateHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateDetail" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "templateId" INTEGER NOT NULL,

    CONSTRAINT "TemplateDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateDetail" ADD CONSTRAINT "TemplateDetail_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "TemplateHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
