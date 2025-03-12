import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET total de financiamientos cancelados

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const cantidadCancelados = await prisma.financiamiento.count({
      where: { estado: true },
    });

    return new NextResponse(JSON.stringify({ cantidadCancelados }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la cantidad de financiamientos cancelados" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}