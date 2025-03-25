import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

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
      fechaInicio,
      fechaVencimiento,
      noLetra,
      monto,
      estado,
      observaciones,
      productorId,
    } = JSON.parse(body);

    const financiamientoActualizado = await prisma.financiamiento.update({
      where: { id: parseInt(id) },
      data: {
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        noLetra,
        monto,
        estado,
        observaciones,
        productorId,
      },
    });

    AddLogger('Editar', 'Financiamiento');

    return new NextResponse(
      JSON.stringify({ message: "Financiamiento actualizado con éxito", financiamientoActualizado }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al actualizar el financiamiento";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}