"use client";
import { useEffect, useState, useContext } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import CrearFinanciamiento from './crear';
import EditarFinanciamiento from './editar';
import { AuthContext } from "@/app/context/AuthContext";
import Table from '@/app/components/Table';
import Header from '@/app/components/Header';
import ListadoFinanciamiento from './ListadoFinanciamiento';

interface Financiamiento {
  id: number;
  fechaInicio: string;
  fechaVencimiento: string;
  nroLetra: string;
  monto: number;
  estado: boolean;
  productorId: number;
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCrear, setShowCrear] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [showListadoFinanciamientos, setShowListadoFinanciamientos] = useState(false);
  const [financiamientoData, setFinanciamientoData] = useState<Financiamiento>();
  const [financiamientoId, setFinanciamientoId] = useState<number | null>(null)

  if (!authContext?.user) {
    return <p>Cargando...</p>;
  }
  const { id: userAuthId} = authContext.user;
  const fetchFinanciamientos = async () => {
    try {
      const response = await fetch('/api/financiamiento/get');
      if (!response.ok) throw new Error('Error al obtener los financiamientos');

      const data = await response.json();
      console.log(data);
      setFinanciamientos(data);
      setFilteredFinanciamientos(data);
    } catch (error) {
      setError('Hubo un problema al cargar los financiamientos.');
    }
  }
  useEffect(() => {
    
    fetchFinanciamientos();
  }, []);

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

  const deleteFinanciamiento = async (id: number, userAuthId:number) => {
    try {
      const response = await fetch(`/api/financiamiento/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAuthId })
      });

      if (!response.ok) throw new Error('Error al eliminar el financiamiento');

      fetchFinanciamientos();
      setMessage('Financiamiento eliminado con éxito');
      setShowDeleteConfirm(false);
    } catch (error) {
      setMessage('Error al eliminar el financiamiento');
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
    'Pagó', 
    ''
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
    financiamiento.estado ? 'Sí' : 'No',
    <>
      <button 
        className="bg-yellow-300 text-black px-4 py-2 rounded-lg shadow-lg border border-yellow-500 hover:bg-yellow-500 m-1" 
        title="Editar"
        onClick={() => {
          setShowEditar(true)
          setFinanciamientoData(financiamiento)}}
      >
        <MdEdit size={10}/>
      </button>
      <button 
        className="bg-red-300 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500 hover:bg-red-500 my-1" 
        title="Eliminar"
        onClick={() => {setShowDeleteConfirm(true); setFinanciamientoId(financiamiento.id)}}
      >
        <FaTimes size={10}/>
      </button>
    </>
  ]);
  return (
    <div className="px-2 py-6 bg-gray-200 min-h-screen">
      <Header 
        title='Datos del Financiamiento'
        showSearchBar = {true}
        showAddButton = {true}
        showSearchButton = {true}
        showListButton = {true}
        onAdd={()=> setShowCrear(true)}
        onList={() => setShowListadoFinanciamientos(true)}/>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      {showCrear && (
        <CrearFinanciamiento
          onClose={() => {setShowCrear(false); fetchFinanciamientos()}}
          userAuthId={userAuthId}
        />
      )}
      {showEditar && (
        <EditarFinanciamiento 
        onClose={()=> {setShowEditar(false); fetchFinanciamientos()}}
        userAuthId={userAuthId}
        financiamientoData={financiamientoData}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <div className="bg-white text-black p-6 items-center rounded-md w-96 shadow-lg">
            <p className="mb-4 text-center">¿Desea eliminar este financiamiento?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => deleteFinanciamiento(financiamientoId ?? 0, userAuthId)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sí
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {financiamientos.length === 0 ? (
        <p className="text-center text-gray-600">No se encontraron resultados.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table headers={headers} rows={rows}/>
        </div>
      )}
      {showListadoFinanciamientos && (
        <ListadoFinanciamiento
          onClose={() => setShowListadoFinanciamientos(false)}
        />
      )}
    </div>
  );
};

export default Financiamiento;
