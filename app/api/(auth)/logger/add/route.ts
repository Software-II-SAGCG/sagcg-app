// app/api/loggers/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { modulo, evento } = body;

    if (!modulo || !evento) {
      return NextResponse.json({ error: "Modulo y evento son obligatorios" }, { status: 400 });
    }

    const logger = await prisma.logger.create({
      data: {
        evento,
        modulo,
        fecha: new Date(),
      },
    });

    return NextResponse.json(logger, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear el registro de logger" }, { status: 500 });
  }
}