-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "teamLeadSubcategoryId" TEXT,
ALTER COLUMN "peerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TeamLeadEvaluation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "evaluationId" INTEGER NOT NULL,

    CONSTRAINT "TeamLeadEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamLeadSubcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamLeadEvaluationId" INTEGER NOT NULL,

    CONSTRAINT "TeamLeadSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamLeadEvaluation_name_key" ON "TeamLeadEvaluation"("name");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_teamLeadSubcategoryId_fkey" FOREIGN KEY ("teamLeadSubcategoryId") REFERENCES "TeamLeadSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadEvaluation" ADD CONSTRAINT "TeamLeadEvaluation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLeadSubcategory" ADD CONSTRAINT "TeamLeadSubcategory_teamLeadEvaluationId_fkey" FOREIGN KEY ("teamLeadEvaluationId") REFERENCES "TeamLeadEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
