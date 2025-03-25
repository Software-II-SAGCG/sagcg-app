import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        rubro: true,
        productor: true,
      },
    });

    return new NextResponse(JSON.stringify(compras), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener las compras" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}