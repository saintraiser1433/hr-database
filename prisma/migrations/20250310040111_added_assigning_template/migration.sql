/*
  Warnings:

  - You are about to drop the column `peerId` on the `TemplateHeader` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TemplateHeader" DROP CONSTRAINT "TemplateHeader_peerId_fkey";

-- AlterTable
ALTER TABLE "TemplateHeader" DROP COLUMN "peerId";

-- CreateTable
CREATE TABLE "AssigningTemplate" (
    "id" SERIAL NOT NULL,
    "templateHeaderId" INTEGER NOT NULL,
    "peerId" INTEGER,

    CONSTRAINT "AssigningTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssigningTemplate" ADD CONSTRAINT "AssigningTemplate_templateHeaderId_fkey" FOREIGN KEY ("templateHeaderId") REFERENCES "TemplateHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssigningTemplate" ADD CONSTRAINT "AssigningTemplate_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Peer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
