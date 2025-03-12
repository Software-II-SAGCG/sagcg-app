import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.cosecha.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(JSON.stringify({ message: "Cosecha eliminada con éxito" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al eliminar la cosecha" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}