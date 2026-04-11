/*
  Warnings:

  - The `location` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `location` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('ALL_WORLD', 'EUROPA', 'CIS', 'AMERICA', 'ASIA', 'AUSTRALIA', 'OTHER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "location",
ADD COLUMN     "location" "LocationType";

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "location",
ADD COLUMN     "location" "LocationType";
