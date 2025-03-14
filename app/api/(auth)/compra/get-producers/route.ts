import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Importamos la instancia única de Prisma

export async function GET() {
  try {
    // Obtén todos los productores desde la base de datos
    const producers = await prisma.productor.findMany();

    // Obtén todos los tipos de productores desde el otro endpoint o Prisma
    const typesProductor = await prisma.tipoProductor.findMany();

    // Mapea los productores para agregar el nombre del tipo correspondiente
    const producersWithTypeName = producers.map((productor) => {
      const tipo = typesProductor.find((tipo) => tipo.id === productor.tipoid);
      return {
        id: productor.id,
        nombre: productor.nombre,
        apellido: productor.apellido,
        tipoProductor: tipo ? tipo.nombre : "Desconocido", // Maneja casos donde no haya un match
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

