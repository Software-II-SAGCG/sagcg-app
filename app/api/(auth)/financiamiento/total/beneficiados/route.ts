import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET total de productores beneficiarios

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientos = await prisma.financiamiento.findMany({
      select: { productorId: true },
    });

    const productoresUnicos = new Set(financiamientos.map((f) => f.productorId));

    const cantidadBeneficiarios = productoresUnicos.size;

    return new NextResponse(JSON.stringify({ cantidadBeneficiarios }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la cantidad de beneficiarios" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}