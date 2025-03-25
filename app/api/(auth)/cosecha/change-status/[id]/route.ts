import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

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

    const { estado } = JSON.parse(body);

    if (typeof estado !== "boolean") {
      return new NextResponse(JSON.stringify({ error: "El estado es obligatorio y debe ser un valor booleano." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cosechaActualizada = await prisma.cosecha.update({
      where: { id: parseInt(id) },
      data: { estado },
    });

    AddLogger('Cambiar Estado', 'Cosecha');

    return new NextResponse(JSON.stringify({ message: "Estado de la cosecha actualizado con éxito", cosechaActualizada }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error al actualizar el estado de la cosecha:", error);

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
