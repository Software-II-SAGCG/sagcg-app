import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cosecha = await prisma.cosecha.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cosecha) {
      return new NextResponse(JSON.stringify({ error: "Cosecha no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(cosecha), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener la cosecha" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}