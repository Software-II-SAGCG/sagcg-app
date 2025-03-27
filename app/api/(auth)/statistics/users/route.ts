import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const loggers = await prisma.logger.findMany({
      include: { usuario: true },
      orderBy: { id: 'asc' }, 
    });

    const resultado: Record<string, Record<string, Record<string, number>>> = {};

    loggers.forEach((logger) => {
      const { modulo, evento, usuario } = logger;

      if (!resultado[modulo]) {
        resultado[modulo] = {};
      }

      if (!resultado[modulo][evento]) {
        resultado[modulo][evento] = {};
      }

      if (!resultado[modulo][evento][usuario.username]) {
        resultado[modulo][evento][usuario.username] = 0;
      }

      resultado[modulo][evento][usuario.username] += 1;
    });

    return NextResponse.json(resultado, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener los registros agrupados' },
      { status: 500 }
    );
  }
}
