/*
  Warnings:

  - Added the required column `usuarioId` to the `Logger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logger" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Logger" ADD CONSTRAINT "Logger_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
