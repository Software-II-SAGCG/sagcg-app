import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.cosecha.delete({
      where: { id: parseInt(id) },
    });

    AddLogger('Eliminar', 'Cosecha');

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