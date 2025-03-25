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
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";

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
  const [isAssignHarvest, setIsAssignHarvest] = useState(false);
  const [muestraCosechas, setMuestraCosechas] = useState<Cosecha[]>([]);
  const [cosechaId, setCosechaId] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

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

  const getCosechas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/get-harvest");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMuestraCosechas(data);
    }catch(err){
      console.error(err);
    }
  }
  useEffect(() => {
    getUsers();
    getRols();
    getCosechas();
  }, []);


  const handleAddButton = () => {
    setIsRegisterModalOpen(true);
  };

  const handleAssignHarvest = async (cosechaId: number, usuarioId: number) => {
    try {
      const response = await fetch("/api/cosecha/assign-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cosechaId, usuarioId }),
      });
      if(response.ok){
        setCosechaId(null);
        fetchCosechas();
      }
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
    
  }

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

      <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false), setIsAssignHarvest(false)}}>
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
            <div className="flex">
              <button 
                onClick={()=>setIsAssignHarvest(prev => !prev)}
                className="text-black flex">
                ¿Desea asignar alguna cosecha a este usuario?
                {isAssignHarvest
                  ? <IoMdArrowDropup size={20}/>
                  : <IoMdArrowDropdown size={20} />
                }
              </button>
            </div>
            { isAssignHarvest ? (
              <div className="mt-4">
                <select 
                  name="cosechaId" 
                  value={cosechaId ?? ''}
                  onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setCosechaId(Number(e.target.value))}
                  className= "border p-2 mb-4 rounded-md text-gray-800"
                >
                  <option value="" disabled> Selecciona una cosecha</option>
                    {muestraCosechas
                    .filter(cos => !cosechas.some(cosecha => cosecha.id === cos.id))
                    .map((cos) => (
                      <option key={cos.id} value={cos.id}>
                        {cos.nombre}
                      </option>
                    ))}
                </select>
                <button
                  onClick={()=>{
                    if (cosechaId != null){
                      handleAssignHarvest(cosechaId, userId)
                      setShowError(false)
                    }else{
                      setShowError(true);
                    }
                    }
                  }
                  className="bg-blue-300 text-black px-4 py-2 rounded-lg shadow-lg border border-blue-500 hover:bg-blue-500 ml-8"
                  title="Asignar Cosecha">
                    <MdOutlineAssignmentTurnedIn size={20}/>
                </button>
                {showError && (
                  <p className="text-red-500"> Debe seleccionar una cosecha </p>
                )}
              </div>
            ):(
              <div></div>
            )

            }
          </>
        )}
      </Modal>

      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => {setIsRegisterModalOpen(false), getUsers()}} />

      <EditRolModal 
        isOpen={isEditRolModalOpen} 
        onClose={()=> {setIsEditRolOpen(false), getUsers()}} 
        dataUser = {dataUser}
        rols={rols}/>

      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        onClose={()=> setIsDeleteUserModalOpen(false)}
        dataUser={dataUser}/>
    </div>
  );
}
