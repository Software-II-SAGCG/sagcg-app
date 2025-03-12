import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Importamos la instancia única de Prisma

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    if (!body) {
      return new NextResponse(JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {nombre, apellido, cedula, nacionalidadId, telefonoLocal, direccion1, direccion2, tipoid } = JSON.parse(body);

    if (!nombre || !apellido || !cedula || !nacionalidadId || !telefonoLocal || !direccion1 || !direccion2 || !tipoid) {
      return new NextResponse(JSON.stringify({ error: "Todos los campos son obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = {
        nombre, 
        apellido, 
        cedula, 
        nacionalidadId, 
        telefonoLocal, 
        direccion1, 
        direccion2, 
        tipoid
    }
    
    const productor = await prisma.productor.create({data});

    return new NextResponse(JSON.stringify({ message: "Productor agregado con éxito", productor }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    const status = 500;
    let message = "Error al agregar el productor";

    if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}