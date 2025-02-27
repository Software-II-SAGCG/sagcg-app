"use client";

import React from 'react';
import Modal from './Modal';
import { useEffect, useState } from "react";

interface ModalEditRolProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  userNombre: string;
  userApellido: string;
}

const EditRolModal: React.FC<ModalEditRolProps> = ({ isOpen, onClose, userId, userNombre, userApellido }) => {
  
  interface Rol {
    id: number;
    nombre: string;
  }

  const [rolid, setRolId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [rols, setRols] = useState<Rol[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await fetch(`http://localhost:3000/api/admin/edit-rol/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify( {rolid} ),
        });
  
        if (response.ok) {
          // Registro exitoso
          const data = await response.json();
  
          // Redirige al login
          setTimeout(() => onClose(), 2000);
        } else {
          // Error en el registro
          const data = await response.json();
          setError(data.error || "Error al editar el rol del usuario");
        }
      } catch (err) {
        console.error("Error durante la solicitud:", err);
        setError("Error en la conexión al servidor");
      }
    };

  return(
    <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-black text-center text-2xl font-bold mb-2">Editar Rol De Usuario</h2>
        <p className='text-black'>Se va a cambiar el rol del usuario: <strong>{userNombre} {userApellido}</strong></p>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
            <select 
              name="rolid" 
              value={rolid ?? ''}
              onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setRolId(Number(e.target.value))}
              className= "border p-2 mb-4 rounded-md text-gray-800"
            >
              <option value="" disabled> Selecciona un rol</option>
              {rols.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 font-bold rounded-md"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
    </Modal>
  )
}
export default EditRolModal;