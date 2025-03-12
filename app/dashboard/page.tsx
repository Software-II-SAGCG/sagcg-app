"use client";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  return (  
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">Hola, {authContext?.user?.nombre} {authContext?.user?.apellido}</h1>
        <h1 className="text-3xl font-bold text-blue-600">Bienvenido a SAGCG</h1>
        <p className="mt-4 text-gray-700">
          Nos alegra verte aquí. Explora todas las herramientas y funcionalidades que tenemos para optimizar tu experiencia.
        </p>      
      </div>
    </div>
  );
}
