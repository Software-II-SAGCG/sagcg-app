import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  id: string;
};

export async function GET(req: NextRequest, { params }: {params:Params}) {
  const { id } = await params;

  try {
    const logger = await prisma.logger.findUnique({
      include: {usuario: true},
      where: { id: Number(id) }
    });

    if (!logger) {
      return new NextResponse(JSON.stringify({ message: 'Logger no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const roles = await prisma.rol.findMany({
      select:{
        id: true,
        nombre: true
      }
    });
    const rolUser = roles.find(rol => rol.id === logger.usuario.rolid)
    const data = {
      id: logger.id,
      evento: logger.evento,
      modulo: logger.modulo,
      fecha: logger.fecha,
      userAuthId: logger.usuarioId,
      userAuthNombre: logger.usuario.nombre,
      userAuthApellido: logger.usuario.apellido,
      userAuthUsername: logger.usuario.username,
      userAuthRol: rolUser ? rolUser.nombre : "Desconocido"
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el logger:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}