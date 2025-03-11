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

    if (!fecha || !rubroId || !productorId) {
      return new NextResponse(JSON.stringify({ error: "Fecha, rubroId y productorId son obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
      fecha: new Date(fecha),
      precio: precio || 0.00,
      cantidad: cantidad || 0.00,
      humedad: humedad || 0.00,
      merma: merma || 0.00,
      mermaKg: mermaKg || 0.00,
      cantidadTotal: cantidadTotal || 0.00,
      montoTotal: montoTotal || 0.00,
      observaciones: observaciones || "",
      rubroId,
      productorId,
    };

    const compra = await prisma.compra.create({ data });

    return new NextResponse(JSON.stringify({ message: "Compra creada con éxito", compra }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al crear la compra";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}