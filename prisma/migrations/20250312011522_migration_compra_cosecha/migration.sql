/*
  Warnings:

  - Made the column `estado` on table `Cosecha` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fechaCierre` on table `Cosecha` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fechaInicio` on table `Cosecha` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "cosechaId" INTEGER;

-- AlterTable
ALTER TABLE "Cosecha" ALTER COLUMN "estado" SET NOT NULL,
ALTER COLUMN "fechaCierre" SET NOT NULL,
ALTER COLUMN "fechaInicio" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_cosechaId_fkey" FOREIGN KEY ("cosechaId") REFERENCES "Cosecha"("id") ON DELETE SET NULL ON UPDATE CASCADE;
