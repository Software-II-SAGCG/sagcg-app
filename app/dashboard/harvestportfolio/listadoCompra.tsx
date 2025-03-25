import { useQuery } from '@tanstack/react-query';
import { getCompras } from '../../services/compraService';
import { FiPrinter } from "react-icons/fi";
import Loader from '@/app/components/Loader';

/* Props del Modal */
interface ListadoComprasProps {
  cosechaId: number;
  onClose: () => void; 
}

const ListadoCompras: React.FC<ListadoComprasProps> = ({ cosechaId, onClose }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['compras', cosechaId],
    queryFn: () => getCompras(cosechaId),
    enabled: !!cosechaId
  });

  const {data: totalesData, isLoading: isLoadingTotales } = useQuery({
    queryKey: ['totales', cosechaId],
    queryFn: async () => {
      const response = await fetch(`/api/compra/total/${cosechaId}`);
      const result = await response.json();
      return result;
    }
  })

  if (error) return <p>Error al cargar las compras</p>;
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-auto relative flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }
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
                {data?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-2 border text-center">
                      No hay compras para esta cosecha!
                    </td>
                  </tr>
                ) : (
                  data?.map((compra: any) => (
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
                  ))
                )}
              </tbody>

            </table>
          </div>
          <div className="mt-6">
            {isLoadingTotales ? (
              <p className="text-lg font-semibold">Cargando...</p>
            ) : (
              totalesData && (
                <>
                  <p className="text-lg font-semibold">
                    Cantidad Total de Kg Recolectados: {totalesData.sumaTotalKg?.toFixed(2)} Kg
                  </p>
                  <p className="text-lg font-semibold">
                    Monto Total Invertido ($): {totalesData.montoTotalInvertido?.toFixed(2)}
                  </p>
                </>
              )
            )}
          </div>
          {/* Botón para imprimir */}
          <button
            onClick={() => window.print()}
            title='Imprimir'
            className="absolute top-4 right-20 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none"
          >
            <FiPrinter size={24}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListadoCompras;