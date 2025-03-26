import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.logger.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Registro de logger eliminado con éxito" }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al eliminar el registro de logger" }, { status: 500 });
  }
}