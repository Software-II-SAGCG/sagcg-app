import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

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