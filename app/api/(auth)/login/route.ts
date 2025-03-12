import bcrypt from 'bcryptjs';
import basicAuth from 'basic-auth';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma'; // Importamos la instancia única de Prisma


export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new NextResponse(JSON.stringify({ error: 'Se requieren credenciales' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const credentials = basicAuth({ headers: { authorization: authHeader } } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (!credentials) {
      return new NextResponse(JSON.stringify({ error: 'Se requieren credenciales' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { username: credentials.name },
      });

      if (!usuario || !(await bcrypt.compare(credentials.pass, usuario.password))) {
        return new NextResponse(JSON.stringify({ error: 'Credenciales incorrectas' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new NextResponse(JSON.stringify({ 
        data: usuario,
        message: 'Inicio de sesión exitoso' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error("Error en la consulta a la BD:", error);
      return new NextResponse(JSON.stringify({ error: 'Error al iniciar sesión' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Error en basicAuth:", error);
    return new NextResponse(JSON.stringify({ error: 'Error en la autenticación' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
