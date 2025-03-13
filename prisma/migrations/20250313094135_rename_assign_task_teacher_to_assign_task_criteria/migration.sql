/*
  Warnings:

  - You are about to drop the column `assignTaskTeacherId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `AssignTaskTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssignTaskTeacher" DROP CONSTRAINT "AssignTaskTeacher_employeesId_fkey";

-- DropForeignKey
ALTER TABLE "AssignTaskTeacher" DROP CONSTRAINT "AssignTaskTeacher_teamLeadEvaluationId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_assignTaskTeacherId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "assignTaskTeacherId",
ADD COLUMN     "assignTaskCriteriaId" INTEGER;

-- DropTable
DROP TABLE "AssignTaskTeacher";

-- CreateTable
CREATE TABLE "AssignTaskCriteria" (
    "id" SERIAL NOT NULL,
    "employeesId" INTEGER NOT NULL,
    "teamLeadEvaluationId" INTEGER NOT NULL,
    "nameCriteria" TEXT NOT NULL,

    CONSTRAINT "AssignTaskCriteria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignTaskCriteria" ADD CONSTRAINT "AssignTaskCriteria_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignTaskCriteria" ADD CONSTRAINT "AssignTaskCriteria_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assignTaskCriteriaId_fkey" FOREIGN KEY ("assignTaskCriteriaId") REFERENCES "AssignTaskCriteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
