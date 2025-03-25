import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cosechas = await prisma.cosecha.findMany({
        where: {
            fechaCierre:{
                gt: new Date()
            }
        },
        select: {
            id: true,
            nombre: true
        }
    });

    return NextResponse.json(cosechas);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener las cosechas" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}