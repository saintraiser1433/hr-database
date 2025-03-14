/*
  Warnings:

  - You are about to drop the `AssignTaskCriteria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssignTaskCriteria" DROP CONSTRAINT "AssignTaskCriteria_employeesId_fkey";

-- DropForeignKey
ALTER TABLE "AssignTaskCriteria" DROP CONSTRAINT "AssignTaskCriteria_teamLeadEvaluationId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_assignTaskCriteriaId_fkey";

-- DropTable
DROP TABLE "AssignTaskCriteria";

-- CreateTable
CREATE TABLE "TeamLeadAssignTaskCriteria" (
    "id" SERIAL NOT NULL,
    "employeesId" INTEGER NOT NULL,
    "teamLeadEvaluationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TeamLeadAssignTaskCriteria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamLeadAssignTaskCriteria" ADD CONSTRAINT "TeamLeadAssignTaskCriteria_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadAssignTaskCriteria" ADD CONSTRAINT "TeamLeadAssignTaskCriteria_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assignTaskCriteriaId_fkey" FOREIGN KEY ("assignTaskCriteriaId") REFERENCES "TeamLeadAssignTaskCriteria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
