import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const { userAuthId } = await req.json();

    await prisma.financiamiento.delete({
      where: { id: parseInt(id) },
    });

    AddLogger('Eliminar', 'Financiamiento', userAuthId);

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