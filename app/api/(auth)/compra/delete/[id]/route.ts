import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Asegúrate de usar await params
    const { userAuthId } = await req.json();

    await prisma.compra.delete({
      where: { id: parseInt(id) },
    });

    AddLogger('Eliminar', 'Compra', userAuthId);

    return new NextResponse(JSON.stringify({ message: "Compra eliminada con éxito" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al eliminar la compra" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}