-- AlterTable
ALTER TABLE "PeerEvaluation" ADD COLUMN     "status" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "PeerEvaluationResult" (
    "id" SERIAL NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "peerCategoryId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "employeesId" INTEGER NOT NULL,
    "templateDetailId" INTEGER NOT NULL,

    CONSTRAINT "PeerEvaluationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerEvaluationResult_academicYearId_questionId_peerCategory_key" ON "PeerEvaluationResult"("academicYearId", "questionId", "peerCategoryId", "employeesId", "templateDetailId");

-- AddForeignKey
ALTER TABLE "PeerEvaluationResult" ADD CONSTRAINT "PeerEvaluationResult_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluationResult" ADD CONSTRAINT "PeerEvaluationResult_peerCategoryId_fkey" FOREIGN KEY ("peerCategoryId") REFERENCES "PeerCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluationResult" ADD CONSTRAINT "PeerEvaluationResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluationResult" ADD CONSTRAINT "PeerEvaluationResult_employeesId_fkey" FOREIGN KEY ("employeesId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluationResult" ADD CONSTRAINT "PeerEvaluationResult_templateDetailId_fkey" FOREIGN KEY ("templateDetailId") REFERENCES "TemplateDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
