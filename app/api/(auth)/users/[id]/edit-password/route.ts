import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type Params = {
  id: string;
};

export async function PUT(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;
  const {password} = await req.json();

  if (!password) {
    return new NextResponse(JSON.stringify({ error: 'La contraseña es obligatoria' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        password: hashedPassword,
      },
    });

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