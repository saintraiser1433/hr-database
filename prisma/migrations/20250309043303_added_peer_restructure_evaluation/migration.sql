/*
  Warnings:

  - You are about to drop the column `evaluationId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `peerId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_evaluationId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "evaluationId",
ADD COLUMN     "peerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Peer" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "evaluationId" INTEGER NOT NULL,

    CONSTRAINT "Peer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Peer" ADD CONSTRAINT "Peer_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Peer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
