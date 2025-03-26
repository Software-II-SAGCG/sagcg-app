import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AddLogger } from '@/app/services/addLogger';

type Params = {
  id: string;
};

export async function GET(req: NextRequest, { params }: {params:Params}) {
  const { id } = await params;

  try {
    const producer = await prisma.productor.findUnique({
      where: { id: Number(id) },
    });

    if (!producer) {
      return new NextResponse(JSON.stringify({ message: 'Productor no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(producer, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el productor:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;
  const { nombre, apellido, cedula, nacionalidadId, telefonoLocal, direccion1, direccion2, tipoid, userAuthId} = await req.json();

  if (!nombre || !apellido || !cedula || !nacionalidadId || !telefonoLocal || !direccion1 || !direccion2 || !tipoid) {
    return new NextResponse(JSON.stringify({ error: 'Todos los campos son obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const producer = await prisma.productor.update({
      where: { id: Number(id) },
      data: {
        nombre, 
        apellido, 
        cedula, 
        nacionalidadId, 
        telefonoLocal, 
        direccion1, 
        direccion2, 
        tipoid
      },
    });

    AddLogger('Editar', 'Productor', userAuthId);

    return NextResponse.json({ message: 'Productor actualizado con éxito', producer }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al actualizar el productor:', error);

    let status = 500;
    let message = 'Error al actualizar productor';

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

export async function DELETE(req: NextRequest, { params }: {params:Params}) {
  const { id } = params;
  const { userAuthId } = await req.json();

  try {
    const producer = await prisma.productor.delete({
      where: { id: Number(id) },
    });

    AddLogger('Eliminar', 'Productor', userAuthId);

    return NextResponse.json({ message: 'Productor eliminado con éxito', producer }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al eliminar el productor:', error);

    let status = 500;
    let message = 'Error al eliminar productor';

    if (error instanceof Prisma.PrismaClientKnownRequestError){
      if (error.code === 'P2025') {
        status = 404;
        message = 'Productor no encontrado.';
      }
    }
    
    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
