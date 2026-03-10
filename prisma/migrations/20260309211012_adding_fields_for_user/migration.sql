/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "employmentTypes" "EmploymentType"[],
ADD COLUMN     "experience" DOUBLE PRECISION,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "workFormats" "VacancyType"[];
