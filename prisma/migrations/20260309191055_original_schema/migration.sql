/*
  Warnings:

  - You are about to drop the column `cpf` on the `Form` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Form_cpf_key";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "cpf";
