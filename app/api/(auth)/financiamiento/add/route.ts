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

    const { fechaInicio, fechaVencimiento, noLetra, monto, estado, observaciones, productorId } = JSON.parse(body);

    if (!fechaInicio || !fechaVencimiento || !noLetra || !productorId) {
      return new NextResponse(JSON.stringify({ error: "fechaInicio, fechaVencimiento, noLetra y productorId son obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
      fechaInicio: new Date(fechaInicio),
      fechaVencimiento: new Date(fechaVencimiento),
      noLetra,
      monto: monto || 0.00,
      estado: estado || false,
      observaciones: observaciones || "",
      productorId,
    };

    const financiamiento = await prisma.financiamiento.create({ data });

    AddLogger('Agregar', 'Financiamiento');

    return new NextResponse(JSON.stringify({ message: "Financiamiento creado con éxito", financiamiento }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al crear el financiamiento";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}