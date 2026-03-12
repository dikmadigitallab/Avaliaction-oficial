/*
  Warnings:

  - You are about to drop the column `required` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "required";

-- DropTable
DROP TABLE "QuestionOption";
