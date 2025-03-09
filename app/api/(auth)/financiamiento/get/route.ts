import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientos = await prisma.financiamiento.findMany({
      include: { productor: true },
    });

    return new NextResponse(JSON.stringify(financiamientos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener los financiamientos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}