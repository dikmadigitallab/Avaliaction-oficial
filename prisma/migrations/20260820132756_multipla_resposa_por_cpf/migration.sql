-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "allowMultipleResponses" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requireCpf" BOOLEAN NOT NULL DEFAULT true;
