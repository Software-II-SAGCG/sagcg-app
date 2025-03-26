"use client";

import React from 'react';
import Modal from './Modal';
import { useState } from "react";
import Loader from './Loader';

interface User {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  rolid: number;
}

interface Rol {
  id: number;
  nombre: string;
}

interface ModalEditRolProps {
  isOpen: boolean;
  onClose: () => void;
  dataUser: User | null;
  userAuthId: number;
  rols: Rol[];
}

const EditRolModal: React.FC<ModalEditRolProps> = ({ isOpen, onClose, dataUser, rols, userAuthId }) => {

  const [rolid, setRolId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await fetch(`http://localhost:3000/api/admin/edit-rol/${dataUser?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify( {rolid, userAuthId}  ),
        });
  
        if (response.ok) {
          // Registro exitoso
          setIsLoading(true);
          const data = await response.json();
  
          // Redirige al login
          setTimeout(() => {
            setIsLoading(false); 
            onClose();
          }, 2000);
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
      <div className="bg-white p-4 shadow-md rounded-md w-full h-full">
        <h2 className="text-black text-center text-2xl font-bold mb-8">Editar Rol De Usuario</h2>
        <p className='text-black mb-2'>¿Desea cambiar el rol de: <strong>{dataUser?.nombre} {dataUser?.apellido}</strong>?</p>
        <p className='text-gray-800 mb-4'> Su rol actual es: <strong>{rols.find((rol) => rol.id === dataUser?.rolid)?.nombre}</strong></p>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
            <select 
              name="rolid" 
              value={rolid ?? ''}
              onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setRolId(Number(e.target.value))}
              className= "border p-2 mb-8 rounded-md text-gray-800"
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
            {isLoading? <Loader /> : "Confirmar"}
          </button>
        </form>
      </div>
    </div>
    </Modal>
  )
}
export default EditRolModal;