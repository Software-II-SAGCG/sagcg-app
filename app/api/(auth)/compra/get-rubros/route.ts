import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rubros = await prisma.rubro.findMany();
    return NextResponse.json(rubros, { status: 200 });
  } catch (error) {
    console.error('Error al obtener las nacionalidades:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}