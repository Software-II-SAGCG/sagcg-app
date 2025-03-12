import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Asegúrate de usar await params

    const compra = await prisma.compra.findUnique({
      where: { id: parseInt(id) },
      include: { 
        rubro: true,  // Incluir la información del rubro
        productor: true  // Incluir la información del productor
      }
    });

    if (!compra) {
      return new NextResponse(JSON.stringify({ error: "Compra no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(compra), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la compra" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}