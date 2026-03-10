/*
  Warnings:

  - You are about to drop the column `cpfId` on the `Resposta` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resposta" DROP CONSTRAINT "Resposta_cpfId_fkey";

-- DropIndex
DROP INDEX "Resposta_cpfId_formId_key";

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "cpf_list" TEXT[];

-- AlterTable
ALTER TABLE "Resposta" DROP COLUMN "cpfId";
