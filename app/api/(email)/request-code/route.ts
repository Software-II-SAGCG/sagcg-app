import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { codes, CodeData } from '../utils/codeStore';

const prisma = new PrismaClient();

// Configuración del transportador SMTP usando Gmail y contraseña de aplicaciones
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_APP_PASSWORD,
	},
});

export async function POST(request: Request) {
	try {
		// Se espera recibir { "userId": number }
		const { userId } = (await request.json()) as { userId?: number };

		if (!userId) {
			return NextResponse.json(
				{ error: 'El id del usuario es obligatorio' },
				{ status: 400 }
			);
		}

		// Buscar el usuario en la base de datos
		const usuario = await prisma.usuario.findUnique({
			where: { id: userId },
		});

		if (!usuario) {
			return NextResponse.json(
				{ error: 'Usuario no encontrado' },
				{ status: 404 }
			);
		}

		const email = usuario.email;
		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			return NextResponse.json(
				{ error: 'El usuario no tiene un email válido' },
				{ status: 400 }
			);
		}

		// Generar un código de 6 dígitos
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		// Guardar el código junto con su expiración (5 minutos)
		const data: CodeData = {
			code,
			expiresAt: Date.now() + 5 * 60 * 1000,
		};
		codes.set(email, data);

		// Configurar las opciones del correo a enviar
		const mailOptions = {
			from: process.env.EMAIL_USER, 
			to: email, // Destinatario (obtenido de la base de datos)
			subject: 'Tu código de verificación',
			text: `Tu código de verificación es: ${code}`,
		};

		// Enviar el email usando Nodemailer a través de SMTP
		await transporter.sendMail(mailOptions);

		return NextResponse.json(
			{ success: true, message: 'Código enviado al email del usuario' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error en el endpoint request-code:', error);
		return NextResponse.json({ error: 'Error al enviar email' }, { status: 500 });
	}
}
