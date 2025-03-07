"use client";
import Modal from "@/app/components/Modal";
import Loader from "@/app/components/Loader";
import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import RegisterModal from "@/app/components/RegisterModal";
import EditRolModal from "@/app/components/EditRolModal";
import DeleteUserModal from "@/app/components/DeleteUserModal";
import { MdEdit } from "react-icons/md";
import Table from "@/app/components/Table";
import Header from "@/app/components/Header";
import { GiCorn } from "react-icons/gi";

interface Cosecha {
  id: number;
  nombre: string;
}

export default function UserProfiles() {
  interface User {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    rolid: number;
  }

  const [users, setUsers] = useState<User[]>([]);
  interface Rol {
    id: number;
    nombre: string;
  }

  const [rols, setRols] = useState<Rol[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditRolModalOpen, setIsEditRolOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [userId, setUserId] = useState(0);
  const [dataUser, setDataUser] = useState<User | null>(null);

  const headers = ["Id", "Username", "Nombre", "Apellido", "Rol", ""];
  const rows = users.map((user) => [
    user.id,
    user.username,
    user.nombre,
    user.apellido,
    <>
      {rols.find((rol) => rol.id === user.rolid)?.nombre}
      <button
        onClick={() => {
          setIsEditRolOpen(true);
          setDataUser(user);
        }}
        title="Editar Rol"
        className="ml-4"
      >
        <MdEdit />
      </button>
    </>,
    <>
      <button
        onClick={() => {
          setIsModalOpen(true);
          setUserId(user.id);
        }}
        title="Ver Cosechas"
        className="bg-green-300 text-black px-4 py-2 rounded-lg shadow-lg border border-green-500 hover:bg-green-500 mx-2"
      >
        <GiCorn size={24}/>
      </button>
      <button
        onClick={() => {
          setIsDeleteUserModalOpen(true);
          setDataUser(user);
        }}
        title="Eliminar Usuario"
        className="bg-red-300 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500 hover:bg-red-500 mx-2"
      >
        <FaTimes size={24} />
      </button>
    </>
  ]);



  const fetchCosechas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${userId}/cosechas`
      );
      const data = await res.json();
      if (res.ok) {
        setCosechas(data);
      } else {
        setError("Error al cargar cosechas.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCosechas();
    }
  }, [isModalOpen]);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };
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
    getUsers();
    getRols();
  }, []);


  const handleAddButton = () => {
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <Header
        title="Perfiles de Usuarios"
        showSearchBar = {true}
        showSearchButton = {true}
        showAddButton = {true}
        onAdd={handleAddButton}
      />

      {/* User List */}
      
      <Table headers={headers} rows={rows} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {error && (
              <div>
                <br />
                <h2 className="text-red-500 mb-4">{error}</h2>
              </div>
            )}
            {cosechas.length === 0 && (
              <div>
                <br />
                <h2 className="text-red-500 mb-4">
                  El usuario no posee cosechas
                </h2>
              </div>
            )}
            {cosechas.length > 0 && (
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
          </>
        )}
      </Modal>

      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />

      <EditRolModal 
        isOpen={isEditRolModalOpen} 
        onClose={()=> setIsEditRolOpen(false)} 
        dataUser = {dataUser}
        rols={rols}/>

      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={()=> setIsDeleteUserModalOpen(false)}
        dataUser={dataUser}/>
    </div>
  );
}
