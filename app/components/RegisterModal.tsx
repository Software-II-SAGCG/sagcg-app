"use client";

import React from 'react';
import Modal from './Modal';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface ModalRegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<ModalRegisterProps> = ({ isOpen, onClose }) => {
  
  interface Rol {
    id: number;
    nombre: string;
  }  
    
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolid, setRolId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
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
    setShowToast(true);
    getRols();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, nombre, apellido, email, password, rolid }),
      });

      if (response.ok) {
        // Registro exitoso
        const data = await response.json();
        toast.success("Registro exitoso");

        // Redirige al login
        setTimeout(() => onClose(), 2000);
      } else {
        // Error en el registro
        const data = await response.json();
        setError(data.error || "Error al registrar el usuario");
      }
    } catch (err) {
      console.error("Error durante la solicitud:", err);
      setError("Error en la conexión al servidor");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-center bg-gray-100">
      {showToast && <ToastContainer />}
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-black text-center text-2xl font-bold mb-2">Registrar Usuario</h2>
  
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />

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
            Registrar
          </button>
        </form>
      </div>
    </div>
    </Modal>
  );
};

export default RegisterModal;
