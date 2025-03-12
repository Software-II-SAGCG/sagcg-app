import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    if (!body) {
      return new NextResponse(JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { nombre, estado, fechaInicio, fechaCierre } = JSON.parse(body);

    if (!nombre) {
      return new NextResponse(JSON.stringify({ error: "El nombre es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
      nombre,
      estado,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaCierre: fechaCierre ? new Date(fechaCierre) : null,
    };

    const cosecha = await prisma.cosecha.create({ data });

    return new NextResponse(JSON.stringify({ message: "Cosecha creada con éxito", cosecha }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al crear la cosecha";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}