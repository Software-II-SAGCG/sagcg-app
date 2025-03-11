import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Asegúrate de usar await params

    const financiamiento = await prisma.financiamiento.findUnique({
      where: { id: parseInt(id) },
      include: { productor: true },
    });

    if (!financiamiento) {
      return new NextResponse(JSON.stringify({ error: "Financiamiento no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(financiamiento), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener el financiamiento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}