"use client";
import { useEffect, useState, useContext } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaList } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import CrearFinanciamiento from './crear';
import { AuthContext } from "@/app/context/AuthContext";

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

const Financiamiento = () => {
  const [financiamientos, setFinanciamientos] = useState<Financiamiento[]>([]);
  const [filteredFinanciamientos, setFilteredFinanciamientos] = useState<Financiamiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCrear, setShowCrear] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.user) {
      const fetchFinanciamientos = async () => {
        try {
          const response = await fetch('/api/financiamiento/get');
          if (!response.ok) throw new Error('Error al obtener los financiamientos');

          const data = await response.json();
          console.log('Financiamientos obtenidos:', data); // Verifica los datos obtenidos
          setFinanciamientos(data);
          setFilteredFinanciamientos(data);
        } catch (error) {
          setError('Hubo un problema al cargar los financiamientos.');
        }
      };

      fetchFinanciamientos();
    }
  }, [authContext?.user]);

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

  const deleteFinanciamiento = async (id: number) => {
    try {
      const response = await fetch(`/api/financiamiento/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAuthId: authContext?.user?.id || '' })
      });

      if (!response.ok) throw new Error('Error al eliminar el financiamiento');

      setFinanciamientos(financiamientos.filter((fin) => fin.id !== id));
      alert('Financiamiento eliminado con éxito');
    } catch (error) {
      alert('Error al eliminar el financiamiento');
    }
  };

  const updateFinanciamiento = async (id: number, updatedData: Partial<Financiamiento>) => {
    try {
      const response = await fetch(`/api/financiamiento/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedData, userAuthId: authContext?.user?.id || '' })
      });

      if (!response.ok) throw new Error('Error al actualizar el financiamiento');

      const updatedFinanciamiento = await response.json();
      setFinanciamientos(financiamientos.map(fin => fin.id === id ? { ...fin, ...updatedData } : fin));
      alert('Financiamiento actualizado con éxito');
    } catch (error) {
      alert('Error al actualizar el financiamiento');
    }
  };

  const paginatedFinanciamientos = filteredFinanciamientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredFinanciamientos.length / itemsPerPage);

  if (!authContext?.user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="bg-blue-500 text-3xl font-bold text-center text-white mb-6">Datos del Financiamiento</h1>
      <div className="flex justify-end space-x-4 mb-4 ">
          <button
            onClick={() => setShowCrear(true)}
            className="bg-blue-300 text-black px-4 py-2 rounded-lg shadow-lg border border-blue-500 mx-2 hover:bg-blue-500"          >
            <FaPlus size={20} />
          </button>

          {showCrear && (
            <CrearFinanciamiento
              onClose={() => setShowCrear(false)}
              userAuthId={authContext?.user?.id }
            />
          )}
          <button
            onClick={() => router.push('/dashboard/financiamiento/listaFinanciamiento')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaList className="mr-2" />
          </button>
        </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar por cédula o nombre..."
        className="mb-4 p-2 border border-gray-400 rounded text-black"
      />

      {paginatedFinanciamientos.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron resultados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-grey-200">
            <thead className="bg-gray-300 text-black">
              <tr>
                {['ID', 'Fecha Inicio', 'Cédula', 'Apellidos', 'Nombres', 'Teléfono Local', 'Dirección', 'Tipo de Recolector', 'N° Letra Cambio', 'F. De Vencimiento', 'Monto ($)', 'Pagó', 'Acciones'].map((header) => (
                  <th key={header} className="py-3 px-5 border-b text-left font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedFinanciamientos.map((financiamiento) => (
                <tr key={financiamiento.id}>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.id}</td>
                  <td className="py-2 px-4 border-b text-black">{formatFecha(financiamiento.fechaInicio)}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.productorCedula || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.productorApellido || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.productorNombre || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.productorTlfLocal || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.productorDireccion || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.productorTipo || 'N/A'}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.nroLetra || '000001'}</td>
                  <td className="py-2 px-4 border-b text-black">{formatFecha(financiamiento.fechaVencimiento)}</td>
                  <td className="py-2 px-4 border-b text-black">${financiamiento.monto}</td>
                  <td className="py-2 px-4 border-b text-black">{financiamiento.estado ? 'Sí' : 'No'}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button className="p-2 text-yellow-500 hover:text-yellow-700" title="Editar"
                      onClick={() => updateFinanciamiento(financiamiento.id, { monto: 1500 })}>
                      <FaEdit />
                    </button>
                    <button className="p-2 text-red-500 hover:text-red-700" title="Eliminar"
                    onClick={() => deleteFinanciamiento(financiamiento.id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`p-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Financiamiento;
