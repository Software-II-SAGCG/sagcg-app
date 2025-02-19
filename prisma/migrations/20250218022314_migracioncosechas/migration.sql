-- CreateTable
CREATE TABLE "TipoProductor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoProductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" INTEGER NOT NULL,
    "nacionalidadId" INTEGER NOT NULL,
    "telefonoLocal" TEXT NOT NULL,
    "direccion1" TEXT NOT NULL,
    "direccion2" TEXT NOT NULL,
    "tipoid" INTEGER NOT NULL,

    CONSTRAINT "Productor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nacionalidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Nacionalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cosecha" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Cosecha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CosechaUsuario" (
    "cosechaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "CosechaUsuario_pkey" PRIMARY KEY ("cosechaId","usuarioId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoProductor_nombre_key" ON "TipoProductor"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Nacionalidad_nombre_key" ON "Nacionalidad"("nombre");

-- AddForeignKey
ALTER TABLE "Productor" ADD CONSTRAINT "Productor_nacionalidadId_fkey" FOREIGN KEY ("nacionalidadId") REFERENCES "Nacionalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productor" ADD CONSTRAINT "Productor_tipoid_fkey" FOREIGN KEY ("tipoid") REFERENCES "TipoProductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosechaUsuario" ADD CONSTRAINT "CosechaUsuario_cosechaId_fkey" FOREIGN KEY ("cosechaId") REFERENCES "Cosecha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CosechaUsuario" ADD CONSTRAINT "CosechaUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
