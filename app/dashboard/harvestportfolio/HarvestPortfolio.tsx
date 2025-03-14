"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { LuClipboardList } from "react-icons/lu";
import { FaPlay } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import Table from "@/app/components/Table";
import Header from "@/app/components/Header";
import Compras from "./compras";

interface Harvest {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaCierre: string;
  estado: boolean;
}

export default function HarvestPortfolio() {
  const [harvest, setHarvest] = useState<Harvest[]>([]);
  const [searchId, setSearchId] = useState("");
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCompras, setShowCompras] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaCierre: "",
    id: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [harvestToDelete, setHarvestToDelete] = useState<Harvest | null>(null);

  const headers = ["ID", "Descripcion", "Inicio", "Cierre", ""];

  const rows = harvest.map((harvest) => [
    harvest.id,
    harvest.nombre,
    new Date(harvest.fechaInicio).toISOString().split("T")[0],
    new Date(harvest.fechaCierre).toISOString().split("T")[0],
    <>
      <button
        onClick={() => openEditModal(harvest)}
        className={`bg-yellow-300 text-black px-4 py-2 rounded-lg shadow-lg border border-yellow-500 mx-2 hover:bg-yellow-500 ${!harvest.estado ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Editar Cosecha"
        disabled={!harvest.estado}
      >
        <MdEdit size={20} />
      </button>
      <button
        onClick={() => handleDelete(harvest)}
        className={`bg-red-300 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500 mx-2 hover:bg-red-500 ${!harvest.estado ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Eliminar Cosecha"
        disabled={!harvest.estado}
      >
        <FaTimes size={20} />
      </button>
      <button
        onClick={() => setShowCompras(true)}
        className={`bg-blue-300 text-black px-4 py-2 rounded-lg shadow-lg border border-blue-500 mx-2 hover:bg-blue-500 ${!harvest.estado ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Generar Compras"
        disabled={!harvest.estado}
      >
        <BiPurchaseTagAlt size={20} />
      </button>
      <button
        className={`bg-blue-300 text-black px-4 py-2 rounded-lg shadow-lg border border-blue-500 mx-2 hover:bg-blue-500 ${!harvest.estado ? "opacity-50 cursor-not-allowed" : ""}`}
        title="Listar Compras"
        disabled={!harvest.estado}
      >
        <LuClipboardList size={20} />
      </button>
      {showCompras && (
        <Compras
          cosechaId={harvest.id}          // El ID de la cosecha que corresponda
          onClose={() => setShowCompras(false)}
        />
      )}
      {harvest.estado ? (
        <button
          onClick={() => handleChangeStatus(harvest, false)}
          className="bg-red-300 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500 mx-2 hover:bg-red-500"
          title="Cerrar Cosecha"
        >
          <AiOutlineStop size={20} />
        </button>
      ) : (
        <button
          onClick={() => handleChangeStatus(harvest, true)}
          className="bg-green-300 text-black px-4 py-2 rounded-lg shadow-lg border border-green-500 mx-2 hover:bg-green-500"
          title="Habilitar Cosecha"
        >
          <FaPlay size={20} />
        </button>
      )}
    </>,
  ]);

  // Consultar datos al cargar el componente
  useEffect(() => {
    fetchHarvest();
  }, []);

  const fetchHarvest = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cosecha/obtener");
      const data = await res.json();
      if (res.ok) {
        setHarvest(data);
      } else {
        setError("Error al cargar cosechas.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  const handleSearch = async () => {
    if (!searchId) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/cosecha/obtener/${searchId}`
      );
      const data = await res.json();
      if (res.ok) {
        setHarvest([data]);
      } else {
        setError("Cosecha no encontrada.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      nombre: "",
      fechaInicio: "",
      fechaCierre: "",
      id: "",
    });
    setShowModal(true);
  };

  const openEditModal = (harvest: Harvest) => {
    setIsEditMode(true);
    setSelectedHarvest(harvest);
    setFormData({
      nombre: harvest.nombre,
      fechaInicio: new Date(harvest.fechaInicio).toISOString().split("T")[0],
      fechaCierre: new Date(harvest.fechaCierre).toISOString().split("T")[0],
      id: harvest.id.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (harvest: Harvest) => {
    setHarvestToDelete(harvest);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!harvestToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/cosecha/delete/${harvestToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMessage("Cosecha eliminada exitosamente.");
        setHarvest(harvest.filter((p) => p.id !== harvestToDelete.id));
      } else {
        setError("Error al eliminar cosecha.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
    setShowDeleteConfirm(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const payload = {
      nombre: formData.nombre,
      fechaInicio: formData.fechaInicio,
      fechaCierre: formData.fechaCierre,
    };

    try {
      let res;
      if (isEditMode && selectedHarvest) {
        res = await fetch(
          `http://localhost:3000/api/cosecha/editar/${selectedHarvest.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch("http://localhost:3000/api/cosecha/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        setMessage(
          isEditMode
            ? "Cosecha actualizada exitosamente."
            : "Cosecha agregada exitosamente."
        );
        setShowModal(false);
        fetchHarvest();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar cosecha.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value);
  };

  const handleChangeStatus = async (harvest: Harvest, newStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cosecha/change-status/${harvest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
      });
      if (res.ok) {
        setMessage(`Cosecha ${newStatus ? "habilitada" : "cerrada"} exitosamente.`);
        fetchHarvest();
      } else {
        setError("Error al cambiar el estado de la cosecha.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <Header
        title="Portafolio de Cosechas"
        showSearchBar={true}
        showSearchButton={true}
        showAddButton={true}
        searchValue={searchId}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onAdd={openAddModal}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      {/* Lista de Cosechas */}

      <Table headers ={headers} rows={rows} />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-md w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Editar Cosecha" : "Agregar Cosecha"}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <label htmlFor="nombre" className="mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <label htmlFor="fechaInicio" className="mb-1">Fecha de Inicio</label>
              <input
                type="date"
                name="fechaInicio"
                placeholder="Inicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <label htmlFor="fechaCierre" className="mb-1">Fecha de Cierre</label>
              <input
                type="date"
                name="fechaCierre"
                placeholder="Cierre"
                value={formData.fechaCierre}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <button
                type="submit"
                className="bg-blue-500 text-black py-2 rounded-md font-bold"
              >
                {isEditMode ? "Actualizar" : "Agregar"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-black py-2 rounded-md font-bold mt-2"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <div className="bg-white text-black p-6 items-center rounded-md w-96 shadow-lg">
            <p className="mb-4 text-center">¿Desea eliminar esta cosecha?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sí
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}