import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { cosechaId, usuarioId } = await req.json();

    if (!cosechaId || !usuarioId) {
      return new NextResponse(JSON.stringify({ message: 'cosechaId y usuarioId son obligatorios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const relacion = await prisma.cosechaUsuario.create({
      data: {
        cosechaId,
        usuarioId,
      },
    });

    return NextResponse.json(relacion, { status: 201 });
  } catch (error) {
    console.error('Error al crear la relación entre usuario y cosecha:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
