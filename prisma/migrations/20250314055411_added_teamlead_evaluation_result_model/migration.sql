-- CreateTable
CREATE TABLE "TeamLeadEvaluationResult" (
    "evaluationId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "employeesId" INTEGER NOT NULL,
    "templateDetailId" INTEGER NOT NULL,

    CONSTRAINT "TeamLeadEvaluationResult_pkey" PRIMARY KEY ("evaluationId","questionId","employeesId","templateDetailId")
);

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluationResult" ADD CONSTRAINT "TeamLeadEvaluationResult_templateDetailId_fkey" FOREIGN KEY ("templateDetailId") REFERENCES "TemplateDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
