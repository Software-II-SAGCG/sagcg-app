"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface Cosecha {
  id: number;
  nombre: string;
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const userId = 1; // Reemplaza con el ID del usuario actual

  const fetchCosechas = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${userId}/cosechas`
      );
      const data = await res.json();
      if (res.ok) {
        setCosechas(data);
      } else {
        setError("El usuario no posee cosechas");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCosechas();
    }
  }, [isModalOpen]);

  const router = useRouter();

  const handleLogout = () => {
    // Aquí se puede limpiar tokens o datos de sesión si los tienes
    router.push("/");
  };
  const DatosProductor = () => {
    router.push("/dashboard/datosproductor"); // Redirige a la página de registro
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Bienvenido a SAGCG</h1>
        <p className="mt-4 text-gray-700">
          Nos alegra verte aquí. Explora todas las herramientas y
          funcionalidades que tenemos para optimizar tu experiencia.
        </p>
        <div className="mt-6">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition">
            Empezar
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
          <button
            onClick={DatosProductor}
            className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 transition"
          >
            Datos Productor
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Ver Cosechas
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {error.length === 0 && (
              <h2 className="text-red-800 text-xl font-bold mb-4">
                El usuario no posee cosechas
              </h2>
            )}
            {!error && (
              <div>
                <h2 className="text-gray-800 text-2xl font-bold mb-4">
                  Cosechas
                </h2>
                <ul>
                  {cosechas.map((cosecha) => (
                    <li key={cosecha.id} className="mb-2 text-gray-800">
                      {cosecha.nombre}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}
