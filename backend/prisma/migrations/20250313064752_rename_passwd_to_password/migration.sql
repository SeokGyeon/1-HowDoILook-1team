/*
  Warnings:

  - You are about to drop the column `passwd` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `passwd` on the `Curation` table. All the data in the column will be lost.
  - Added the required column `password` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Curation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "passwd",
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Curation" DROP COLUMN "passwd",
ADD COLUMN     "password" TEXT NOT NULL;
