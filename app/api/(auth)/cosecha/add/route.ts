import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    if (!body) {
      return new NextResponse(JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { nombre, estado, fechaInicio, fechaCierre, userAuthId } = JSON.parse(body);

    if (!nombre) {
      return new NextResponse(JSON.stringify({ error: "El nombre es obligatorio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
      nombre,
      estado: estado ?? true,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : new Date(),
      fechaCierre: fechaCierre ? new Date(fechaCierre) : new Date(),
    };

    const cosecha = await prisma.cosecha.create({ data });

    AddLogger('Agregar', 'Cosecha', userAuthId);

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