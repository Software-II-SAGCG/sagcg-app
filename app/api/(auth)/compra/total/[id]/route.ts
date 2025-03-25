import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; 
    const cosechaId = parseInt(id); 

    const compras = await prisma.compra.findMany({
      where: { cosechaId }, 
    });

    const sumaTotalKg = compras.reduce((total, compra) => {
      return total + compra.cantidadTotal;
    }, 0);

    const montoTotalInvertido = compras.reduce((total, compra) => {
        return total + compra.montoTotal;
      }, 0);

    return new NextResponse(JSON.stringify({ 
        sumaTotalKg: sumaTotalKg,
        montoTotalInvertido: montoTotalInvertido }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la suma total de la cantidad total de compras" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
