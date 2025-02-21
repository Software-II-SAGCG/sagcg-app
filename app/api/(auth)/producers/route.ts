import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Importamos la instancia única de Prisma


export async function GET() {
  try {
    const producers = await prisma.productor.findMany();
    return NextResponse.json(producers, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}