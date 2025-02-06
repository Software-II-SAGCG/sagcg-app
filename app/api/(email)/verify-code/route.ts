// app/api/verify-code/route.ts
import { NextResponse } from 'next/server';
import { codes } from '../utils/codeStore';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json() as { email?: string; code?: string };

    if (!email || !code) {
      return NextResponse.json({ error: 'Se requiere email y código' }, { status: 400 });
    }
    const storedData = codes.get(email);
    if (!storedData) {
      return NextResponse.json({ error: 'Código no encontrado o expirado' }, { status: 400 });
    }

    if (Date.now() > storedData.expiresAt) {
      codes.delete(email);
      return NextResponse.json({ error: 'El código ha expirado' }, { status: 400 });
    }

    if (storedData.code !== code) {
      return NextResponse.json({ error: 'Código incorrecto' }, { status: 400 });
    }

    // El código es válido, lo eliminamos
    codes.delete(email);
    return NextResponse.json({ success: true, message: 'Email verificado exitosamente' });
  } catch (error) {
    console.error('Error al verificar código:', error);
    return NextResponse.json({ error: 'Error al verificar código' }, { status: 500 });
  }
}
