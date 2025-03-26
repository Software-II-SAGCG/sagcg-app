import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

type Params = {
  id: string;
};

export async function PUT(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;
  const {rolid, userAuthId} = await req.json();

  if (!rolid) {
    return new NextResponse(JSON.stringify({ error: 'Todos los campos son obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        rolid: Number(rolid),
      },
    });

    AddLogger('Editar Rol', 'Usuario', userAuthId);
    return NextResponse.json({ message: 'Usuario actualizado con éxito', usuario }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al actualizar el usuario:', error);

    let status = 500;
    let message = 'Error al actualizar usuario';

    if (error instanceof Prisma.PrismaClientKnownRequestError){
        console.error('Prisma Error:', error);
        message = 'Error en la base de datos.';
    }
    

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}