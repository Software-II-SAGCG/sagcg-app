import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const users = await prisma.usuario.findMany({
			orderBy:{
				id:'asc',
			}
		});

		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		console.error('Error al obtener los usuarios:', error);

		return NextResponse.json(
			{ message: 'Error interno en el servidor' },
			{ status: 500 }
		);
	}
}
