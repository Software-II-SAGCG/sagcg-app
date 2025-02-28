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

interface ModalDeleteUserProps {
  isOpen: boolean;
  onClose: () => void;
  dataUser: User | null;
}

const DeleteUserModal: React.FC<ModalDeleteUserProps> = ({isOpen, onClose, dataUser}) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleDeleteUser = async() => {
    try{
      const response = await fetch(`http://localhost:3000/api/users/${dataUser?.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok){
        setIsLoading(true);
        const data = await response.json();
        setTimeout(() => {
          setIsLoading(false); 
          onClose();
          window.location.reload();
        }, 2000);

      }else{
        const data = await response.json();
        setError(data.error || "Error al eliminar el usuario");
      }
    }catch(err){
      console.error("Error durante la solicitud:", err);
      setError("Error en la conexión al servidor");
    }
  }
  return(
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white p-4 shadow-md rounded-md w-full h-full">
          <h2 className="text-black text-center text-2xl font-bold mb-8">Editar Rol De Usuario</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p className="mb-4 text-center text-black">
            ¿Desea eliminar al usuario <strong>{dataUser?.nombre} {dataUser?.apellido}</strong>?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDeleteUser}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              {isLoading ? <Loader /> : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
export default DeleteUserModal;