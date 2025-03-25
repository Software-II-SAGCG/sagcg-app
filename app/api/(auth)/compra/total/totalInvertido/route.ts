import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const compras = await prisma.compra.findMany();

    const montoTotalInvertido = compras.reduce((total, compra) => {
      return total + compra.montoTotal;
    }, 0);

    return new NextResponse(JSON.stringify({ montoTotalInvertido }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la suma total del monto invertido" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}