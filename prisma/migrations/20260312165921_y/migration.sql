-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "itens" TEXT[],
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT true;
