-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_peerId_fkey";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_peerId_fkey" FOREIGN KEY ("peerId") REFERENCES "Peer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
