import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma'; // Importamos la instancia única de Prisma

import bcrypt from 'bcryptjs';



export async function PUT(req: NextRequest) {
  const {username, password} = await req.json();

  if (!password) {
    return new NextResponse(JSON.stringify({ error: 'La contraseña es obligatoria' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const usuario = await prisma.usuario.update({
      where: { username: username },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Usuario actualizado con éxito', usuario }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error al actualizar el usuario:', error);

    const status = 500;
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