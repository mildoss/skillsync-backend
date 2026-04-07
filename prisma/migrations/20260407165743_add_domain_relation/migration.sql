/*
  Warnings:

  - You are about to drop the column `domain` on the `Vacancy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "domain",
ADD COLUMN     "domainId" TEXT;

-- AddForeignKey
ALTER TABLE "Vacancy" ADD CONSTRAINT "Vacancy_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
