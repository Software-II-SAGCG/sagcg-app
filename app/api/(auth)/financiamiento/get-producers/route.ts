import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const producers = await prisma.productor.findMany();
    const typesProductor = await prisma.tipoProductor.findMany();

    const producersWithTypeName = producers.map((productor) => {
      const tipo = typesProductor.find((tipo) => tipo.id === productor.tipoid);
      return {
        id: productor.id,
        cedula: productor.cedula,
        nombre: productor.nombre,
        apellido: productor.apellido,
        tlfnoLocal: productor.telefonoLocal,
        direccion: productor.direccion1,
        tipoProductor: tipo ? tipo.nombre : "Desconocido",
      };
    });

    return NextResponse.json(producersWithTypeName, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los productores:', error);
    return new NextResponse(JSON.stringify({ message: 'Error interno en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}