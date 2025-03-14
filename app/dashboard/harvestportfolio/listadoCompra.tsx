import { useQuery } from '@tanstack/react-query';
import { getCompras } from '../../services/compraService';

/* Props del Modal */
interface ListadoComprasProps {
  onClose: () => void; // Función para cerrar el Modal
}

const ListadoCompras: React.FC<ListadoComprasProps> = ({ onClose }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['compras'],
    queryFn: getCompras
  });

  // Fetch para Cantidad Total de Kg Recolectados
  const { data: totalKgData, isLoading: isLoadingKg } = useQuery({
    queryKey: ['totalKg'],
    queryFn: async () => {
      const response = await fetch('/api/compra/total/cantidadTotal');
      const result = await response.json();
      return result.sumaTotalKg;
    }
  });

  // Fetch para Monto Total Invertido
  const { data: totalMontoData, isLoading: isLoadingMonto } = useQuery({
    queryKey: ['totalMonto'],
    queryFn: async () => {
      const response = await fetch('/api/compra/total/totalInvertido');
      const result = await response.json();
      return result.montoTotalInvertido;
    }
  });

  if (isLoading) return <p>Cargando compras...</p>;
  if (error) return <p>Error al cargar las compras</p>;

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

        {/* Contenido del Modal */}
        <div className="p-6">
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

          {/* Líneas adicionales */}
          <div className="mt-6">
            <p className="text-lg font-semibold">
              Cantidad Total de Kg Recolectados: {totalKgData?.toFixed(2)} Kg
            </p>
            <p className="text-lg font-semibold">
              Monto Total Invertido ($): {totalMontoData?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoCompras;