"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Productor {
  id: number;
  cedula: number;
  nombre: string;
  apellido: string;
  tlfnoLocal: string;
  direccion: string;
  tipoProductor: string;
}

interface FinanciamientoProps {
  onClose: () => void; // Función para cerrar el módulo
  userAuthId: number;  // Id del usuario autenticado
}

export default function CrearFinanciamiento({ onClose, userAuthId }: FinanciamientoProps) {
  // Estados de los campos del formulario
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [noLetra, setNoLetra] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState(false); // false: pendiente, true: pagado
  const [productorId, setProductorId] = useState<number | null>(null);

  // Estados para productores, mensajes y errores
  const [productores, setProductores] = useState<Productor[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Obtener la lista de productores desde el endpoint
  const getProductores = async () => {
    try {
      setError("");
      const res = await fetch("/api/financiamiento/get-producers");
      if (!res.ok) {
        throw new Error("Error al obtener productores");
      }
      const data = await res.json();
      setProductores(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido al obtener productores");
    }
  };

  useEffect(() => {
    getProductores();
  }, []);

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const body = {
        fechaInicio,                // Ej: "2025-03-19T09:05" (datetime-local retorna formato ISO sin segundos)
        fechaVencimiento,           // Ej: "2025-03-24T09:05"
        noLetra,
        monto: parseFloat(monto),
        estado,
        productorId,
        userAuthId,
      };

      const res = await fetch("/api/financiamiento/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Error al crear el financiamiento");
      }

      setMessage("Financiamiento creado exitosamente");
      // Limpiar campos del formulario
      setFechaInicio("");
      setFechaVencimiento("");
      setNoLetra("");
      setMonto("");
      setEstado(false);
      setProductorId(null);
      setTimeout(()=>{
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error desconocido al crear financiamiento");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center overflow-auto z-50">
      <div className="bg-white text-black p-8 shadow-md rounded-md w-full max-w-5xl relative">
        {/* Botón para cerrar el módulo */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          title="Cerrar"
        >
          <FaTimes size={20} />
        </button>

        {/* Encabezado */}
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Financiamiento</h2>

        {/* Mensajes de error o éxito */}
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-2 text-center">{message}</p>}

        {/* Formulario para crear financiamiento */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Fecha Inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Fecha Vencimiento:</label>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="border p-2 rounded-md w-full"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">No. Letra:</label>
            <input
              type="text"
              value={noLetra}
              onChange={(e) => setNoLetra(e.target.value)}
              className="border p-2 rounded-md w-full"
              placeholder="000123"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Monto ($):</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="border p-2 rounded-md w-full"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Estado:</label>
            <select
              value={estado ? "true" : "false"}
              onChange={(e) => setEstado(e.target.value === "true")}
              className="border p-2 rounded-md w-full"
            >
              <option value="false">Pendiente</option>
              <option value="true">Pagado</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Productor:</label>
            <select
              value={productorId ?? ""}
              onChange={(e) => setProductorId(Number(e.target.value))}
              className="border p-2 rounded-md w-full"
              required
            >
              <option value="" disabled>
                Selecciona un productor
              </option>
              {productores.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} {prod.apellido} - {prod.tipoProductor}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 font-bold rounded-md hover:bg-blue-600"
            >
              Guardar Financiamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}