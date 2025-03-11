/*
  Warnings:

  - You are about to drop the column `title` on the `Peer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Peer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Peer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Peer" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Peer_name_key" ON "Peer"("name");
