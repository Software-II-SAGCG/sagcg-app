import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Asegúrate de usar await params
    const body = await req.text();
    if (!body) {
      return new NextResponse(JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      fecha,
      precio,
      cantidad,
      humedad,
      merma,
      mermaKg,
      cantidadTotal,
      montoTotal,
      observaciones,
      rubroId,
      productorId,
    } = JSON.parse(body);

    const compraActualizada = await prisma.compra.update({
      where: { id: parseInt(id) },
      data: {
        fecha: fecha ? new Date(fecha) : undefined,
        precio,
        cantidad,
        humedad,
        merma,
        mermaKg,
        cantidadTotal,
        montoTotal,
        observaciones,
        rubroId,
        productorId,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Compra actualizada con éxito", compraActualizada }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al actualizar la compra";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}