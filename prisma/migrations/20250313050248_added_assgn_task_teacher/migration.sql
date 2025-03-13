-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "assignTaskTeacherId" INTEGER;

-- AlterTable
ALTER TABLE "TeamLeadEvaluation" ADD COLUMN     "forTeamLead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AssignTaskTeacher" (
    "id" SERIAL NOT NULL,
    "employeesId" INTEGER NOT NULL,
    "teamLeadEvaluationId" INTEGER NOT NULL,
    "nameCriteria" TEXT NOT NULL,

    CONSTRAINT "AssignTaskTeacher_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignTaskTeacher" ADD CONSTRAINT "AssignTaskTeacher_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignTaskTeacher" ADD CONSTRAINT "AssignTaskTeacher_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assignTaskTeacherId_fkey" FOREIGN KEY ("assignTaskTeacherId") REFERENCES "AssignTaskTeacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
