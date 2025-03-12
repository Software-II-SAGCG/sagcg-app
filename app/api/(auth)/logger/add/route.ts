// app/api/loggers/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { modulo, usuarioId } = body;

    if (!modulo || !usuarioId) {
      return NextResponse.json({ error: "Modulo y usuarioId son obligatorios" }, { status: 400 });
    }

    const logger = await prisma.logger.create({
      data: {
        modulo,
        fecha: new Date(),
        usuarioId,
      },
    });

    return NextResponse.json(logger, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear el registro de logger" }, { status: 500 });
  }
}