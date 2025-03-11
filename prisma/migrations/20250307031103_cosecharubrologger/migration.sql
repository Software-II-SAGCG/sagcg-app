-- AlterTable
ALTER TABLE "Cosecha" ADD COLUMN     "estado" BOOLEAN,
ADD COLUMN     "fechaCierre" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TipoProductor" ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE "Rubro" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "humedad" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "merma" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "mermaKg" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "cantidadTotal" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "montoTotal" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "observaciones" TEXT NOT NULL,
    "rubroId" INTEGER NOT NULL,
    "productorId" INTEGER NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financiamiento" (
    "id" SERIAL NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "noLetra" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "estado" BOOLEAN NOT NULL,
    "observaciones" TEXT NOT NULL,
    "productorId" INTEGER NOT NULL,

    CONSTRAINT "Financiamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logger" (
    "id" SERIAL NOT NULL,
    "modulo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Logger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_productorId_fkey" FOREIGN KEY ("productorId") REFERENCES "Productor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financiamiento" ADD CONSTRAINT "Financiamiento_productorId_fkey" FOREIGN KEY ("productorId") REFERENCES "Productor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logger" ADD CONSTRAINT "Logger_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
