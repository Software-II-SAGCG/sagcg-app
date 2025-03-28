import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaPlus, FaList } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation'; 

interface Financiamiento {
  id: number;
  fecha: string;
  cedula: string;
  apellidos: string;
  nombres: string;
  telefonoLocal: string;
  direccion: string;
  tipoRecolector: string;
  numeroLetraCambio: string;
  fechaVencimiento: string;
  monto: number;
  pago: string;
}

const Financiamiento = () => {
  const [financiamientos, setFinanciamientos] = useState<Financiamiento[]>([]);
  const [filteredFinanciamientos, setFilteredFinanciamientos] = useState<Financiamiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [producers, setProducers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter(); // Para navegación

  useEffect(() => {
    const fetchFinanciamientos = async () => {
      try {
        const response = await fetch('/api/financiamiento/get');
        if (!response.ok) throw new Error('Error al obtener los financiamientos');

        const data = await response.json();
        setFinanciamientos(data);
        setFilteredFinanciamientos(data);
      } catch (error) {
        setError('Hubo un problema al cargar los financiamientos.');
      }
    };

    const fetchProducers = async () => {
      try {
        const response = await fetch('/api/financiamiento/get-producers');
        if (!response.ok) throw new Error('Error al obtener los productores');

        const data = await response.json();
        setProducers(data);
      } catch (error) {
        setError('Hubo un problema al cargar los productores.');
      }
    };

    fetchFinanciamientos();
    fetchProducers();
  }, []);

  const getProducerData = (producerId: number) => {
    const producer = producers.find((p) => p.id === producerId);
    return producer ? producer : {};
  };

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
      (financiamiento.cedula?.toLowerCase().includes(term) || '') ||   // Validación de `cedula`
      (financiamiento.nombres?.toLowerCase().includes(term) || '')     // Validación de `nombres`
    );
  
    setFilteredFinanciamientos(filtered);
    setCurrentPage(1);
  };
  
  const deleteFinanciamiento = async (id: number) => {
    try {
      const response = await fetch(`/api/financiamiento/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAuthId: 1 }) // Cambiar por el ID real del usuario autenticado
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
        body: JSON.stringify({ ...updatedData, userAuthId: 1 }) // Cambiar por el ID real del usuario autenticado
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

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="bg-blue-500 text-3xl font-bold text-center text-white mb-6">Datos del Financiamiento</h1>
      <div className="flex justify-end space-x-4 mb-4 ">
          <button 
            onClick={() => router.push('./crear')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaPlus className="mr-2" /> Crear
          </button>
          <button 
            onClick={() => router.push('/dashboard/financiamiento/listaFinanciamiento')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaList className="mr-2" /> Lista
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
                {['ID', 'Fecha', 'Cédula', 'Apellidos', 'Nombres', 'Teléfono Local', 'Dirección', 'Tipo de Recolector', 'N° Letra Cambio', 'F. De Vencimiento', 'Monto ($)', 'Pagó', 'Acciones'].map((header) => (
                  <th key={header} className="py-3 px-5 border-b text-left font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedFinanciamientos.map((financiamiento) => {
                const producer = getProducerData(financiamiento.id);

                return (
                  <tr key={financiamiento.id}>
                    <td className="py-2 px-4 border-b text-black">{financiamiento.id}</td>
                    <td className="py-2 px-4 border-b text-black">{formatFecha(financiamiento.fecha)}</td>
                    <td className="py-2 px-4 border-b text-black">{producer.cedula || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-black">{producer.apellido || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-black">{producer.nombre || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-black">{producer.tlfnoLocal || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-black">{producer.direccion || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-black">{producer.tipoProductor || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-black">{financiamiento.numeroLetraCambio || '000001'}</td>
                    <td className="py-2 px-4 border-b text-black">{formatFecha(financiamiento.fechaVencimiento)}</td>
                    <td className="py-2 px-4 border-b text-black">${financiamiento.monto}</td>
                    <td className="py-2 px-4 border-b text-black">{financiamiento.pago}</td>
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
                );
              })}
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
