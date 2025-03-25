"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Table from "@/app/components/Table";
import Header from "@/app/components/Header";

interface Producer {
  id: number;
  nombre: string;
  apellido: string;
  cedula: number;
  nacionalidadId: number;
  telefonoLocal: string;
  direccion1: string;
  direccion2: string;
  tipoid: number;
}

interface Nationality {
  id: number;
  nombre: string;
}

interface ProducerType {
  id: number;
  nombre: string;
  precio: number;
}

export default function DatosProductor() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [producerTypes, setProducerTypes] = useState<ProducerType[]>([]);
  const [searchId, setSearchId] = useState("");
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    nacionalidadId: "",
    telefonoLocal: "",
    direccion1: "",
    direccion2: "",
    tipoid: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [producerToDelete, setProducerToDelete] = useState<Producer | null>(
    null
  );

  const headers = [
    "ID",
    "Nombre",
    "Apellido",
    "Cédula",
    "Nacionalidad",
    "Teléfono",
    "Dirección 1",
    "Dirección 2",
    "Tipo",
    "",
  ];

  const rows = producers.map((producer) => [
    producer.id,
    producer.nombre,
    producer.apellido,
    producer.cedula,
    nationalities.find((nat) => nat.id === producer.nacionalidadId)?.nombre ||
      producer.nacionalidadId,
    producer.telefonoLocal,
    producer.direccion1,
    producer.direccion2,
    producerTypes.find((tp) => tp.id === producer.tipoid)?.nombre ||
      producer.tipoid,
    <>
      <button
        onClick={() => openEditModal(producer)}
        className="bg-yellow-300 text-black px-4 py-2 rounded-lg shadow-lg border border-yellow-500 mx-2 hover:bg-yellow-500"
        title="Editar Productor"
      >
        <MdEdit size={20} />
      </button>
      <button
        onClick={() => handleDelete(producer)}
        className="bg-red-300 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500 mx-2 hover:bg-red-500"
        title="Eliminar Productor"
      >
        <FaTimes size={20} />
      </button>
    </>,
  ]);

  // Consultar datos al cargar el componente
  useEffect(() => {
    fetchProducers();
    fetchNationalities();
    fetchProducerTypes();
  }, []);

  const fetchProducers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/producers");
      const data = await res.json();
      if (res.ok) {
        setProducers(data);
      } else {
        setError("Error al cargar productores.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  const fetchNationalities = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/producers/nationalities"
      );
      const data = await res.json();
      if (res.ok) {
        setNationalities(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducerTypes = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/producers/types-producer"
      );
      const data = await res.json();
      if (res.ok) {
        setProducerTypes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!searchId) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/producers/${searchId}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducers([data]);
      } else {
        setError("Productor no encontrado.");
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
      apellido: "",
      cedula: "",
      nacionalidadId: "",
      telefonoLocal: "",
      direccion1: "",
      direccion2: "",
      tipoid: "",
    });
    setShowModal(true);
  };

  const openEditModal = (producer: Producer) => {
    setIsEditMode(true);
    setSelectedProducer(producer);
    setFormData({
      nombre: producer.nombre,
      apellido: producer.apellido,
      cedula: producer.cedula.toString(),
      nacionalidadId: producer.nacionalidadId.toString(),
      telefonoLocal: producer.telefonoLocal,
      direccion1: producer.direccion1,
      direccion2: producer.direccion2,
      tipoid: producer.tipoid.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (producer: Producer) => {
    setProducerToDelete(producer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!producerToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/producers/${producerToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMessage("Productor eliminado exitosamente.");
        setProducers(producers.filter((p) => p.id !== producerToDelete.id));
      } else {
        setError("Error al eliminar productor.");
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
      apellido: formData.apellido,
      cedula: parseInt(formData.cedula),
      nacionalidadId: parseInt(formData.nacionalidadId),
      telefonoLocal: formData.telefonoLocal,
      direccion1: formData.direccion1,
      direccion2: formData.direccion2,
      tipoid: parseInt(formData.tipoid),
    };

    try {
      let res;
      if (isEditMode && selectedProducer) {
        res = await fetch(
          `http://localhost:3000/api/producers/${selectedProducer.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch("http://localhost:3000/api/producers/add-producer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        setMessage(
          isEditMode
            ? "Productor actualizado exitosamente."
            : "Productor agregado exitosamente."
        );
        setShowModal(false);
        fetchProducers();
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar productor.");
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

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <Header
        title="Datos del productor"
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

      {/* Lista de Productores */}

      <Table headers={headers} rows={rows} />

      {/* Modal para Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-md w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Editar Productor" : "Agregar Productor"}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <input
                type="number"
                name="cedula"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <select
                name="nacionalidadId"
                value={formData.nacionalidadId}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              >
                <option value="">Seleccionar Nacionalidad</option>
                {nationalities.map((nat) => (
                  <option key={nat.id} value={nat.id}>
                    {nat.nombre}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="telefonoLocal"
                placeholder="Teléfono Local"
                value={formData.telefonoLocal}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <input
                type="text"
                name="direccion1"
                placeholder="Dirección 1"
                value={formData.direccion1}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <input
                type="text"
                name="direccion2"
                placeholder="Dirección 2"
                value={formData.direccion2}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              />
              <select
                name="tipoid"
                value={formData.tipoid}
                onChange={handleInputChange}
                className="border p-2 mb-2 rounded-md text-black"
              >
                <option value="">Seleccionar Tipo</option>
                {producerTypes.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.nombre} - precio: {tp.precio*100}%
                  </option>
                ))}
              </select>
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

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <div className="bg-white text-black p-6 items-center rounded-md w-96 shadow-lg">
            <p className="mb-4 text-center">¿Desea eliminar este productor?</p>
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
