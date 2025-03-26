import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  id: string;
};

export async function GET(req: NextRequest, { params }: {params:Params}) {
  const { id } = await params;

  try {
    const logger = await prisma.logger.findUnique({
      where: { id: Number(id) },
    });

    if (!logger) {
      return new NextResponse(JSON.stringify({ message: 'Logger no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(logger, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el logger:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}