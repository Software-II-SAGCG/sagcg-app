import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET monto total $ de financiamientos cancelados

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientosCancelados = await prisma.financiamiento.findMany({
      where: { estado: true },
    });

    const montoTotalCancelado = financiamientosCancelados.reduce((total, financiamiento) => {
      return total + financiamiento.monto;
    }, 0);

    return new NextResponse(JSON.stringify({ montoTotalCancelado }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener el monto total cancelado" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}