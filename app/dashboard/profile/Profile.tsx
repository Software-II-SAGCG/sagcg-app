"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ProfilePage() {
  interface Rol {
    id: number;
    nombre: string;
  }
  const authContext = useContext(AuthContext);
  const [rols, setRols] = useState<Rol[]>([]);

  if (!authContext?.user) {
    return <p>Cargando...</p>;
  }

  const { username, nombre, apellido, email, rolid } = authContext.user;

  const getRols = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/rols");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRols(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
      getRols();
  }, []);

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <div className="bg-blue-500 text-white p-3 rounded-md text-center text-lg font-bold">
        Perfil
      </div>
      <div className="bg-white p-4 rounded-md shadow-md mt-4">
        <h2 className="text-gray-800 text-2xl font-bold mb-4">Detalles del Usuario</h2>
        <div className="space-y-2 text-gray-800">
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Apellido:</strong> {apellido}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Rol:</strong> {rols.find((rol)=> rol.id === rolid)?.nombre}</p>
            
        </div>
        
      </div>
      
    </div>
  );
}
