/*
  Warnings:

  - You are about to drop the column `vitual` on the `cards` table. All the data in the column will be lost.
  - Added the required column `virtual` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "vitual",
ADD COLUMN     "virtual" BOOLEAN NOT NULL;
