-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PRODUCT', 'OUTSOURCE', 'OUTSTAFF', 'STARTUP', 'AGENCY');

-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "companyType" "CompanyType";
