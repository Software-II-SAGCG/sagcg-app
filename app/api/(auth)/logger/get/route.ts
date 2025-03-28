import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const loggers = await prisma.logger.findMany({
      include: {usuario:true},
      orderBy: {id: 'asc'}
    });

    const roles = await prisma.rol.findMany({
      select:{
        id: true,
        nombre: true
      }
    })

    const data = loggers.map(logger => {
      const rolUser = roles.find(rol => rol.id === logger.usuario.rolid)
      return{
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
    })

    return NextResponse.json(data, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los registros de logger" }, { status: 500 });
  }
}