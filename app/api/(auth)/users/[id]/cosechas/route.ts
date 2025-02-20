import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type Params = {
  id: string;
};

export async function GET(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
      include: {
        cosechas: {
            include: {
                cosecha: true,
            },
        },
      },
    });

    if (!usuario) {
      return new NextResponse(JSON.stringify({ message: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(usuario.cosechas.map(c => c.cosecha), { status: 200 });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
