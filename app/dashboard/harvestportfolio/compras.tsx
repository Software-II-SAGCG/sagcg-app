"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Compra {
  id: number;
  fecha: string;
  precio: number;
  cantidad: number;
  humedad: number;
  merma: number;
  mermaKg: number;
  cantidadTotal: number;
  montoTotal: number;
  observaciones: string;
  rubroId: number;
  productorId: number;
  cosechaId: number;
}

interface ComprasProps {
  cosechaId: number;         // ID de la cosecha
  onClose: () => void;       // Función para cerrar la ventana
}

export default function Compras({ cosechaId, onClose }: ComprasProps) {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Campos del formulario
  const [fecha, setFecha] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [humedad, setHumedad] = useState("");
  const [merma, setMerma] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [rubroId, setRubroId] = useState("");
  const [productorId, setProductorId] = useState("");

  // Cálculos automáticos
  const mermaKg = cantidad && merma
    ? parseFloat(cantidad) * (parseFloat(merma) / 100)
    : 0;
  const cantidadTotal = cantidad
    ? parseFloat(cantidad) - mermaKg
    : 0;
  const montoTotal = precio
    ? cantidadTotal * parseFloat(precio)
    : 0;

  // 1. Obtener compras
  const fetchCompras = async () => {
    try {
      setError("");
      setMessage("");
      const res = await fetch("/api/compra/get");
      if (!res.ok) {
        throw new Error("Error al obtener las compras");
      }
      const data: Compra[] = await res.json();
      // Filtra las compras de la cosecha actual
      setCompras(data.filter((c) => c.cosechaId === cosechaId));
    } catch (err: any) {
      setError(err.message || "Error desconocido al obtener compras");
    }
  };

  useEffect(() => {
    fetchCompras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Manejo del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const body = {
        fecha,
        precio: parseFloat(precio),
        cantidad: parseFloat(cantidad),
        humedad: parseFloat(humedad),
        merma: parseFloat(merma),
        mermaKg,
        cantidadTotal,
        montoTotal,
        observaciones,
        rubroId: parseInt(rubroId),
        productorId: parseInt(productorId),
        cosechaId,
      };

      const res = await fetch("/api/compra/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Error al crear la compra");
      }

      setMessage("Compra creada exitosamente");
      // Limpiar formulario
      setFecha("");
      setPrecio("");
      setCantidad("");
      setHumedad("");
      setMerma("");
      setObservaciones("");
      setRubroId("");
      setProductorId("");

      // Recargar la lista
      fetchCompras();
    } catch (err: any) {
      setError(err.message || "Error desconocido al crear compra");
    }
  };

  // 3. Eliminar una compra
  const handleDelete = async (id: number) => {
    try {
      setError("");
      setMessage("");
      const res = await fetch(`/api/compra/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Error al eliminar la compra");
      }
      setMessage("Compra eliminada correctamente");
      setCompras((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      setError(err.message || "Error desconocido al eliminar compra");
    }
  };

  // Render principal con estilo adaptado
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center bg-gray-100 overflow-auto z-50">
      <div className="bg-white text-black p-2 m-2 shadow-md rounded-md w-full max-w-7xl relative">
        {/* Botón para cerrar la ventana */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          title="Cerrar"
        >
          <FaTimes size={20} />
        </button>

        {/* Encabezado */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          Cosecha {cosechaId} - Datos de la Compra
        </h2>

        {/* Mensajes */}
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-2 text-center">{message}</p>}

        {/* Formulario para agregar compra */}
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block font-semibold">Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Cédula / Prod. ID:</label>
            <input
              type="number"
              value={productorId}
              onChange={(e) => setProductorId(e.target.value)}
              className="border p-2 rounded-md w-full"
              placeholder="Ej: 7764567"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Tipo de Rubro (rubroId):</label>
            <input
              type="number"
              value={rubroId}
              onChange={(e) => setRubroId(e.target.value)}
              className="border p-2 rounded-md w-full"
              placeholder="Ej: 1, 2..."
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Precio ($):</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="border p-2 rounded-md w-full"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Cantidad (Kg):</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="border p-2 rounded-md w-full"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Humedad (%):</label>
            <input
              type="number"
              value={humedad}
              onChange={(e) => setHumedad(e.target.value)}
              className="border p-2 rounded-md w-full"
              step="0.01"
            />
          </div>

          <div>
            <label className="block font-semibold">Merma (%):</label>
            <input
              type="number"
              value={merma}
              onChange={(e) => setMerma(e.target.value)}
              className="border p-2 rounded-md w-full"
              step="0.01"
            />
          </div>
          <div>
            <label className="block font-semibold">Merma (Kg):</label>
            <input
              type="number"
              value={mermaKg.toFixed(2)}
              readOnly
              className="border p-2 rounded-md w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-semibold">Cant. Total (Kg):</label>
            <input
              type="number"
              value={cantidadTotal.toFixed(2)}
              readOnly
              className="border p-2 rounded-md w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-semibold">Monto Total ($):</label>
            <input
              type="number"
              value={montoTotal.toFixed(2)}
              readOnly
              className="border p-2 rounded-md w-full bg-gray-100"
            />
          </div>

          <div className="col-span-3">
            <label className="block font-semibold">Observaciones:</label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="border p-2 rounded-md w-full"
              placeholder="Notas, etc."
            />
          </div>

          <div className="col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 font-bold rounded-md hover:bg-blue-600"
            >
              Guardar Compra
            </button>
          </div>
        </form>

        {/* Listado de compras existentes */}
        <h3 className="text-xl font-bold mb-2">Compras registradas</h3>
        <div className="overflow-auto max-h-64 border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Cédula</th>
                <th className="p-2 border">Rubro</th>
                <th className="p-2 border">Precio</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Humedad</th>
                <th className="p-2 border">Merma</th>
                <th className="p-2 border">Merma(Kg)</th>
                <th className="p-2 border">Cant. Total</th>
                <th className="p-2 border">Monto Total</th>
                <th className="p-2 border">Obs.</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td className="p-2 border text-center">{compra.id}</td>
                  <td className="p-2 border">{compra.fecha}</td>
                  <td className="p-2 border">{compra.productorId}</td>
                  <td className="p-2 border">{compra.rubroId}</td>
                  <td className="p-2 border">{compra.precio.toFixed(2)}</td>
                  <td className="p-2 border">{compra.cantidad.toFixed(2)}</td>
                  <td className="p-2 border">{compra.humedad.toFixed(2)}</td>
                  <td className="p-2 border">{compra.merma.toFixed(2)}%</td>
                  <td className="p-2 border">{compra.mermaKg.toFixed(2)}</td>
                  <td className="p-2 border">{compra.cantidadTotal.toFixed(2)}</td>
                  <td className="p-2 border">{compra.montoTotal.toFixed(2)}</td>
                  <td className="p-2 border">{compra.observaciones}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(compra.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {compras.length === 0 && (
                <tr>
                  <td colSpan={13} className="p-2 text-center">
                    No hay compras registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

