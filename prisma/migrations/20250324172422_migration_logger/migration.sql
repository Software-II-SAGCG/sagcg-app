/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Logger` table. All the data in the column will be lost.
  - Added the required column `evento` to the `Logger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Logger" DROP CONSTRAINT "Logger_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Logger" DROP COLUMN "usuarioId",
ADD COLUMN     "evento" TEXT NOT NULL;
