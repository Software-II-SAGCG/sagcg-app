"use client";
import { useEffect, useState, useContext } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { AuthContext } from "@/app/context/AuthContext";
import Table from '@/app/components/Table';
import { FiPrinter } from "react-icons/fi";


interface Financiamiento {
  id: number;
  fechaInicio: string;
  fechaVencimiento: string;
  nroLetra: string;
  monto: number;
  estado: boolean;
  productorCedula: string;
  productorNombre: string;
  productorApellido: string;
  productorTlfLocal: string;
  productorDireccion: string;
  productorTipo: string;
}

interface FinanciamientoDataTotal {
  cantidadBeneficiarios: number;
  cantidadCancelados: number;
  cantidadNoCancelados: number;
  cantidadVencidos: number;
  montoTotalCancelado: number;
  montoTotalFinanciado: number;
  montoTotalNoCancelado: number;
}
interface ListadoFinanciamiento {
  onClose: () => void;
}

const listadoFinanciamiento: React.FC<ListadoFinanciamiento> = ({ onClose }) => {
  const [financiamientos, setFinanciamientos] = useState<Financiamiento[]>([]);
  const [financiamientosDataTotal, setFinanciamientosDataTotal] = useState<FinanciamientoDataTotal>({
    cantidadBeneficiarios: 0,
    cantidadCancelados: 0,
  cantidadNoCancelados: 0,
  cantidadVencidos: 0,
  montoTotalCancelado: 0,
  montoTotalFinanciado: 0,
  montoTotalNoCancelado: 0
  });
  const [filteredFinanciamientos, setFilteredFinanciamientos] = useState<Financiamiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCrear, setShowCrear] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext?.user) {
    return <p>Cargando...</p>;
  }
  const { id: userAuthId } = authContext.user;
  const fetchTotalDataFinanciamiento = async () => {
    const response = await fetch('/api/financiamiento/totales');
    if (!response.ok) throw new Error('Error al obtener los datos totales de financiamientos');

    const data = await response.json();
    setFinanciamientosDataTotal(data);
  }
  const fetchListadoFinanciamientos = async () => {
    try {
      const response = await fetch('/api/financiamiento/get');
      if (!response.ok) throw new Error('Error al obtener los financiamientos');

      const data = await response.json();

      setFinanciamientos(data);
      setFilteredFinanciamientos(data);

    } catch (error) {
      setError('Hubo un problema al cargar los financiamientos.');
    }
  }
  useEffect(() => {
    fetchListadoFinanciamientos();
    fetchTotalDataFinanciamiento();
  }, []);
  console.log(financiamientosDataTotal)
  const formatFecha = (fecha: string) => {
    try {
      const parsedDate = new Date(fecha);
      return format(parsedDate, 'dd/MM/yy hh:mm a', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = financiamientos.filter(financiamiento =>
      (financiamiento.productorCedula?.toLowerCase().includes(term) || '') ||
      (financiamiento.productorNombre?.toLowerCase().includes(term) || '')
    );

    setFilteredFinanciamientos(filtered);
    setCurrentPage(1);
  };


  const paginatedFinanciamientos = filteredFinanciamientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredFinanciamientos.length / itemsPerPage);

  const headers = [
    'ID',
    'Fecha Inicio',
    'Cédula',
    'Apellidos',
    'Nombres',
    'Teléfono Local',
    'Dirección',
    'Tipo de Recolector',
    'N° Letra Cambio',
    'F. De Vencimiento',
    'Monto ($)',
    'Pagó'
  ];

  const rows = financiamientos.map((financiamiento) => [
    financiamiento.id,
    formatFecha(financiamiento.fechaInicio),
    financiamiento.productorCedula || 'N/A',
    financiamiento.productorApellido || 'N/A',
    financiamiento.productorNombre || 'N/A',
    financiamiento.productorTlfLocal || 'N/A',
    financiamiento.productorDireccion || 'N/A',
    financiamiento.productorTipo || 'N/A',
    financiamiento.nroLetra || '000001',
    formatFecha(financiamiento.fechaVencimiento),
    `$${financiamiento.monto}`,
    financiamiento.estado ? 'Sí' : 'No'
  ]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-auto relative">
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none"
        >
          X
        </button>
        <button
          onClick={() => window.print()}
          title='Imprimir'
          className="absolute top-4 right-20 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
        >
          <FiPrinter size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-xl text-center text-black font-bold mb-4">Datos del Financiamiento</h2>
          <div className="overflow-x-auto">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {financiamientos.length === 0 ? (
              <p className="text-center text-gray-600">No se encontraron resultados.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className='mb-5'>
                  <Table headers={headers} rows={rows} />
                </div>
                <div className='flex justify-end'>
                <div className="max-w-2xl p-5 border border-gray-200 rounded-lg shadow-sm text-black">
                  <h2 className="text-xl font-bold mb-4">Resumen de Financiamientos</h2>
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Cantidad de Recolectores Beneficiados:</td>
                        <td className="py-3 text-right">{financiamientosDataTotal.cantidadBeneficiarios}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Cantidad de Financiamientos Cancelados:</td>
                        <td className="py-3 text-right font-medium">{financiamientosDataTotal.cantidadCancelados}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Cantidad de Financiamientos No Cancelados:</td>
                        <td className="py-3 text-right font-medium">{financiamientosDataTotal.cantidadNoCancelados}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Cantidad de Financiamientos con Plazo Vencidos:</td>
                        <td className="py-3 text-right font-medium">{financiamientosDataTotal.cantidadVencidos}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Monto Total Cancelado ($):</td>
                        <td className="py-3 text-right font-medium">{financiamientosDataTotal.montoTotalCancelado}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Monto Total No Cancelado ($)</td>
                        <td className="py-3 text-right font-medium">{financiamientosDataTotal.montoTotalNoCancelado}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Monto Total Financiado ($):</td>
                        <td className="py-3 text-right font-medium">{financiamientosDataTotal.montoTotalFinanciado}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default listadoFinanciamiento;
