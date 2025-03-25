import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cosechaId = parseInt(id);

    const compras = await prisma.compra.findMany({
      where: { cosechaId },
      include: { 
        rubro: true,
        productor: true
      }
    });

    if (!compras ) {
      return new NextResponse(JSON.stringify({message: "No se encontraron compras para esta cosecha"}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

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
