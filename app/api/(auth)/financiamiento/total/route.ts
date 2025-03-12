import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET monto total financiado

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientos = await prisma.financiamiento.findMany();

    const montoTotalFinanciado = financiamientos.reduce((total, financiamiento) => {
      return total + financiamiento.monto;
    }, 0);

    return new NextResponse(JSON.stringify({ montoTotalFinanciado }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener el monto total financiado" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}