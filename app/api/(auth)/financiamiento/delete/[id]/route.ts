import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Asegúrate de usar await params

    await prisma.financiamiento.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(JSON.stringify({ message: "Financiamiento eliminado con éxito" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al eliminar el financiamiento" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}