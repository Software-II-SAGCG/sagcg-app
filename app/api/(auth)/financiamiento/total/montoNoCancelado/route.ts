import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET monto total $ de financiamientos no cancelados

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientosNoCancelados = await prisma.financiamiento.findMany({
      where: { estado: false },
    });

    const montoTotalNoCancelado = financiamientosNoCancelados.reduce((total, financiamiento) => {
      return total + financiamiento.monto;
    }, 0);

    return new NextResponse(JSON.stringify({ montoTotalNoCancelado }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener el monto total no cancelado" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}