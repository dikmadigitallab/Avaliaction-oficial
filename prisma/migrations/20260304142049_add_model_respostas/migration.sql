-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resposta_formId_idx" ON "Resposta"("formId");

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
