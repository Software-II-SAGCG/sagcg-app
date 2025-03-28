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

interface FinanciamientoProps {
  onClose: () => void; 
  userAuthId: number; 
  financiamientoData?: Financiamiento;
}

export default function EditarFinanciamiento({ onClose, userAuthId, financiamientoData }: FinanciamientoProps) {

  const [fechaInicio, setFechaInicio] = useState(
  financiamientoData?.fechaInicio ? financiamientoData.fechaInicio.split("T")[0] : "");
  const [fechaVencimiento, setFechaVencimiento] = useState(
    financiamientoData?.fechaVencimiento ? financiamientoData.fechaVencimiento.split("T")[0] : "");
  const [noLetra, setNoLetra] = useState(financiamientoData?.nroLetra || "");
  const [monto, setMonto] = useState(financiamientoData?.monto.toString() || "");
  const [estado, setEstado] = useState(financiamientoData?.estado || false);
  const [productorId, setProductorId] = useState<number | null>(null);
  const [productores, setProductores] = useState<Productor[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
  const handleSubmit = async (e: React.FormEvent, id:number, userAuthId:number) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const body = {
        fechaInicio,
        fechaVencimiento,
        noLetra,
        monto: parseFloat(monto),
        estado,
        productorId,
        userAuthId,
      };

      const res = await fetch(`/api/financiamiento/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el financiamiento");
      }

      setMessage("Financiamiento actualizado exitosamente");
      setTimeout(()=>{
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error desconocido al actualizar financiamiento");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center overflow-auto z-50">
      <div className="bg-white text-black p-8 shadow-md rounded-md w-full max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          title="Cerrar"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Editar Financiamiento</h2>

        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-2 text-center">{message}</p>}
        <form onSubmit={(e)=>handleSubmit(e, financiamientoData?.id || 0, userAuthId)} className="grid grid-cols-2 gap-4">
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
              Actualizar Financiamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
