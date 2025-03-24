import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// GET monto total financiado

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const financiamientos = await prisma.financiamiento.findMany();

    const totales = financiamientos.reduce((acumulador, financiamiento) => {
      if (financiamiento.estado === false){
        acumulador.cantidadNoCancelado += 1;
        acumulador.montoNoCancelado += financiamiento.monto;
        if (financiamiento.fechaVencimiento < new Date()) {
          acumulador.vencidos += 1;
        }
      }else{
        acumulador.cantidadCancelado += 1;
        acumulador.montoCancelado += financiamiento.monto;
      }
      acumulador.montoTotalFinanciado += financiamiento.monto;
      return acumulador;
    },{
      cantidadNoCancelado: 0,
      montoNoCancelado: 0, 
      cantidadCancelado: 0, 
      montoCancelado: 0, 
      vencidos: 0,
      montoTotalFinanciado: 0});

    const productoresUnicos = new Set(financiamientos.map(financiamiento => financiamiento.productorId));
    const beneficiarios = productoresUnicos.size;

    return new NextResponse(JSON.stringify({
      cantidadBeneficiarios: beneficiarios,
      cantidadCancelados: totales.cantidadCancelado,
      cantidadNoCancelados: totales.cantidadNoCancelado,
      cantidadVencidos: totales.vencidos,
      montoTotalCancelado: totales.montoCancelado,
      montoTotalNoCancelado: totales. montoNoCancelado,
      montoTotalFinanciado: totales.montoTotalFinanciado
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: "Error al obtener el monto total financiado" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}