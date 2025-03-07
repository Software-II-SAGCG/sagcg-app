import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cosechas = await prisma.cosecha.findMany();

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