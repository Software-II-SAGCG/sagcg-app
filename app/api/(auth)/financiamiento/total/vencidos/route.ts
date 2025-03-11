import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientos = await prisma.financiamiento.findMany();

    const cantidadVencidos = financiamientos.reduce((count, financiamiento) => {
      if (financiamiento.fechaVencimiento < new Date()) {
        return count + 1;
      }
      return count;
    }, 0);

    return new NextResponse(JSON.stringify({ cantidadVencidos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({
        error: 'Error al calcular la cantidad de financiamientos vencidos',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}