// app/api/download/[id]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cosecha = await prisma.cosecha.findUnique({
      where: { id: parseInt(id) },
      include: { usuarios: true }, // Incluye los usuarios asociados a la cosecha, si es necesario
    });

    if (!cosecha) {
      return NextResponse.json({ error: "Cosecha no encontrada" }, { status: 404 });
    }

    // Formatea los datos como texto plano
    const textData = formatDataAsText(cosecha);

    // Configura la respuesta para la descarga del archivo TXT
    return new NextResponse(textData, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="cosecha_${id}.txt"`,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error al descargar la cosecha" }, { status: 500 });
  }
}

// Función para formatear los datos como texto plano
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDataAsText(cosecha: any): string {
  let text = `ID: ${cosecha.id}\n`;
  text += `Nombre: ${cosecha.nombre}\n`;
  text += `Estado: ${cosecha.estado}\n`;
  text += `Fecha Inicio: ${cosecha.fechaInicio}\n`;
  text += `Fecha Cierre: ${cosecha.fechaCierre}\n`;

  // Si necesitas incluir los usuarios, puedes agregar más líneas al texto aquí

  return text;
}