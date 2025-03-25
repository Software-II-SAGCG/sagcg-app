// app/api/loggers/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const loggers = await prisma.logger.findMany();

    return NextResponse.json(loggers, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los registros de logger" }, { status: 500 });
  }
}