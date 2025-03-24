import { PrismaClient } from '@prisma/client';
import { DnaIcon } from 'lucide-react';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientos = await prisma.financiamiento.findMany({
      include: { productor: true },
      orderBy: {id: 'asc'}
    });
    
    const tiposProductores = await prisma.tipoProductor.findMany({
      select:{
        id: true,
        nombre: true
      }
    });

    const financiamientosTransformados = financiamientos.map(financiamiento => {
      const tipoProductor = tiposProductores.find(tipo => tipo.id === financiamiento.productor.id);
      return {
        id: financiamiento.id,
        fechaInicio: financiamiento.fechaInicio,
        fechaVencimiento: financiamiento.fechaVencimiento,
        nroLetra: financiamiento.noLetra,
        monto: financiamiento.monto,
        estado: financiamiento.estado,
        productorCedula: financiamiento.productor.cedula,
        productorNombre: financiamiento.productor.nombre,
        productorApellido: financiamiento.productor.apellido,
        productorTlfLocal: financiamiento.productor.telefonoLocal,
        productorDireccion: financiamiento.productor.direccion1,
        productorTipo: tipoProductor ? tipoProductor.nombre : null
      };
    });

    return new NextResponse(JSON.stringify(financiamientosTransformados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener los financiamientos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}