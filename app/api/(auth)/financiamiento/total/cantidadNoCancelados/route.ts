import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET Total de financiamientos no cancelados

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const cantidadNoCancelados = await prisma.financiamiento.count({
      where: { estado: false },
    });

    return new NextResponse(JSON.stringify({ cantidadNoCancelados }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la cantidad de financiamientos no cancelados" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}