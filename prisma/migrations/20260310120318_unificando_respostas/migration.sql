/*
  Warnings:

  - A unique constraint covering the columns `[cpfId,formId]` on the table `Resposta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpfId` to the `Resposta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resposta" ADD COLUMN     "cpfId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Resposta_cpfId_formId_key" ON "Resposta"("cpfId", "formId");

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_cpfId_fkey" FOREIGN KEY ("cpfId") REFERENCES "Cpf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
