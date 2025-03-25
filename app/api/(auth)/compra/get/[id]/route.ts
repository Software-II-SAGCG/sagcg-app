import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; 

    const compra = await prisma.compra.findUnique({
      where: { id: parseInt(id) },
      include: { 
        rubro: true, 
        productor: true 
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