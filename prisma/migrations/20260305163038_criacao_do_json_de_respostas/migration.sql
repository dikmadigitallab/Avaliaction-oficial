/*
  Warnings:

  - Added the required column `respostas` to the `Resposta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resposta" ADD COLUMN     "respostas" JSONB NOT NULL;
