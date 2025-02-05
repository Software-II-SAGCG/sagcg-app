import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type Params = {
  id: string;
};

export async function GET(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return new NextResponse(JSON.stringify({ message: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;
  const { username, nombre, apellido, email, rolid } = await req.json();

  if (!username || !nombre || !apellido || !email || !rolid) {
    return new NextResponse(JSON.stringify({ error: 'Todos los campos son obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        username,
        nombre,
        apellido,
        email,
        rolid: Number(rolid),
      },
    });

    return NextResponse.json({ message: 'Usuario actualizado con éxito', usuario }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al actualizar el usuario:', error);

    let status = 500;
    let message = 'Error al actualizar usuario';

    if (error instanceof Prisma.PrismaClientKnownRequestError){
      if (error.code === 'P2002') {
        status = 400;
        message = 'El email o username ya existen.';
      } else if (error.name === 'PrismaClientKnownRequestError') {
        console.error('Prisma Error:', error);
        message = 'Error en la base de datos.';
      }
    }
    

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;

  try {
    const usuario = await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Usuario eliminado con éxito', usuario }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al eliminar el usuario:', error);

    let status = 500;
    let message = 'Error al eliminar usuario';

    if (error instanceof Prisma.PrismaClientKnownRequestError){
      if (error.code === 'P2025') {
        status = 404;
        message = 'Usuario no encontrado.';
      }
    }
    
    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
