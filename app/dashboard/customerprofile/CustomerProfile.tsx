"use client";
import { useState,useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTimes } from "react-icons/fa";


export default function UserProfiles() {
    const [users, setUsers] = useState([]);
    const [rols, setRols] = useState([]);

    const getUsers = async () => { 
        try {
            const response = await fetch("http://localhost:3000/api/users"); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            setUsers(data)
          } catch (err) {
            console.error(err);
          }
    }
    const getRols = async () => { 
        try {
            const response = await fetch("http://localhost:3000/api/admin/rols"); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            setRols(data)
          } catch (err) {
            console.error(err);
          }
    }
    useEffect(() => {
        getUsers();
        getRols();
      }, []);

    console.log(rols); 
    return (
        <div className="p-6 bg-gray-200 min-h-screen">
            <div className="bg-blue-500 text-white p-3 rounded-md text-center text-lg font-bold">
                Perfiles de Usuarios
            </div>

            {/* Search and Add Buttons */}
            <div className="flex justify-between my-4">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    className="border p-2 rounded w-full max-w-md text-gray-900"
                />
                <div className="flex gap-2">
                    <button className="bg-gray-400 p-2 rounded text-white">
                        <FaSearch />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                        <FaPlus />
                    </button>
                </div>
            </div>

            {/* User List */}
            <div className="bg-white p-4 rounded-md shadow-md">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-300 text-gray-800">
                            <th className="p-2">Id</th>
                            <th className="p-2">username</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Apellido</th>
                            <th className="p-2">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b bg-gray-100 text-gray-900">
                                <td className="p-2 text-center font-semibold">{user.id}</td>
                                <td className="p-2 text-center">
                                    <span>{user.username}</span>
                                </td>
                                <td className="p-2 text-center">
                                    <span>{user.nombre}</span>
                                </td>
                                <td className="p-2 text-center">
                                    <span>{user.apellido}</span>
                                </td>
                                <td className="p-2 text-center">
                                    <span>{rols.find(rol => rol.id === user.rolid )?.nombre }</span>
                                    {/* {nationalities.find(nat => nat.id === producer.nacionalidadId)?.nombre || producer.nacionalidadId} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
