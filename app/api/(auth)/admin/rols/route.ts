import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    const rols = await prisma.rol.findMany({
        select: {
            id: true,
            nombre: true
        },
    });
    return NextResponse.json(rols, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}