/*
  Warnings:

  - You are about to drop the column `nameCriteria` on the `AssignTaskCriteria` table. All the data in the column will be lost.
  - Added the required column `name` to the `AssignTaskCriteria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignTaskCriteria" DROP COLUMN "nameCriteria",
ADD COLUMN     "name" TEXT NOT NULL;
