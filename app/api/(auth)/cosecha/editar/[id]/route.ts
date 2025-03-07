import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.text();
    if (!body) {
      return new NextResponse(JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { nombre, estado, fechaInicio, fechaCierre } = JSON.parse(body);

    const cosechaActualizada = await prisma.cosecha.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        estado,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaCierre: fechaCierre ? new Date(fechaCierre) : null,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Cosecha actualizada con éxito", cosechaActualizada }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al actualizar la cosecha";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}