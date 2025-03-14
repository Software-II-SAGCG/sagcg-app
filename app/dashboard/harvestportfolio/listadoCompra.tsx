import { useQuery } from '@tanstack/react-query';
import { getCompras } from '../../services/compraService';

interface listadoComprasProps {         // ID de la cosecha
    onClose: () => void;       // Función para cerrar la ventana
  }

const ListadoCompras = ({ onClose }: listadoComprasProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['compras'],
    queryFn: getCompras
  });

  if (isLoading) return <p>Cargando compras...</p>;
  if (error) return <p>Error al cargar las compras</p>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Listado de Compras</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Precio ($)</th>
              <th className="p-2 border">Cantidad (Kg)</th>
              <th className="p-2 border">Humedad (%)</th>
              <th className="p-2 border">Merma (%)</th>
              <th className="p-2 border">Merma (Kg)</th>
              <th className="p-2 border">Cantidad Total (Kg)</th>
              <th className="p-2 border">Monto ($)</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((compra: any) => (
              <tr key={compra.id} className="hover:bg-gray-100">
                <td className="p-2 border">{compra.id}</td>
                <td className="p-2 border">{new Date(compra.fecha).toLocaleString()}</td>
                <td className="p-2 border">{compra.precio.toFixed(2)}</td>
                <td className="p-2 border">{compra.cantidad.toFixed(2)}</td>
                <td className="p-2 border">{compra.humedad}%</td>
                <td className="p-2 border">{compra.merma}%</td>
                <td className="p-2 border">{compra.mermaKg.toFixed(2)}</td>
                <td className="p-2 border">{compra.cantidadTotal.toFixed(2)}</td>
                <td className="p-2 border">{compra.montoTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoCompras;