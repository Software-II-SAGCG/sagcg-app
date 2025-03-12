import bcrypt from 'bcryptjs';
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

    const { username, nombre, apellido, email, password } = JSON.parse(body);

    if (!username || !nombre || !apellido || !email || !password) {
      return new NextResponse(JSON.stringify({ error: "Todos los campos son obligatorios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        username,
        nombre,
        apellido,
        email,
        password: hashedPassword,
        emailVerified: false,
        rolid: 2,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Usuario registrado con éxito", usuario }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error(error);

    let status = 500;
    let message = "Error al registrar usuario";

    if (error.code === "P2002") {
      status = 400;
      message = "El email o username ya existen.";
    } else if (error.name === "PrismaClientKnownRequestError") {
      message = "Error en la base de datos.";
    }

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

