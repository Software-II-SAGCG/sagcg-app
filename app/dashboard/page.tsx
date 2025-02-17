"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Aquí se puede limpiar tokens o datos de sesión si los tienes
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Bienvenido a SAGCG</h1>
        <p className="mt-4 text-gray-700">
          Nos alegra verte aquí. Explora todas las herramientas y funcionalidades que tenemos para optimizar tu experiencia.
        </p>
        <div className="mt-6">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition">
            Empezar
          </button>
        </div>
        <div className="mt-4">
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600 transition">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
