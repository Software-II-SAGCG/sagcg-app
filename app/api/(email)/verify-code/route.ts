import { NextResponse } from 'next/server';
import { codes } from '../utils/codeStore';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json() as { userId?: string; code?: string };

    if ( !code || !userId) {
      return NextResponse.json({ error: 'Se requiere id y codigo' }, { status: 400 });
    }

    // Buscar el usuario en la base de datos
		const usuario = await prisma.usuario.findUnique({
			where: { id: Number(userId) },
		});

    if (!usuario) {
			return NextResponse.json(
				{ error: 'Usuario no encontrado' },
				{ status: 404 }
			);
		}

    const storedData = codes.get(usuario.email);
    if (!storedData) {
      return NextResponse.json({ error: 'Código no encontrado o expirado' }, { status: 400 });
    }

    if (Date.now() > storedData.expiresAt) {
      codes.delete(usuario.email);
      return NextResponse.json({ error: 'El código ha expirado' }, { status: 400 });
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 });
    }

    // El código es válido, lo eliminamos
    codes.delete(usuario.email);

    // Actualizar el usuario en la base de datos
    await prisma.usuario.update({
      where: { id: Number(userId) },
      data: { emailVerified: true },
    });

    return NextResponse.json({ success: true, message: 'Email verificado exitosamente' });
  } catch (error) {
    console.error('Error al verificar código:', error);
    return NextResponse.json({ error: 'Error al verificar código' }, { status: 500 });
  }
}
