-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "template_name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
