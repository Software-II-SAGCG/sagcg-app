"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

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

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <div className="bg-blue-500 text-white p-3 rounded-md text-center text-lg font-bold">
        Datos del Productor
      </div>
      <div className="p-4">
        {/* Botón Agregar y Buscador */}
        <div className="flex justify-between items-center  text-black mb-4">
          <div className="flex items-center">
            <button
              onClick={openAddModal}
              className="bg-green-500 text-black px-4 py-2 rounded-full mr-2"
            >
              +
            </button>
            <input
              type="text"
              placeholder="Buscar por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border p-2 rounded-md"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-400 p-2 rounded text-white"
            >
              <FaSearch />
            </button>
            {/* <button
              onClick={handleSearch}
              className="bg-blue-500 text-black px-4 py-2 rounded-md ml-2"
            >
              Buscar
            </button> */}
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        {/* Lista de Productores */}
        <div className="overflow-x-auto bg-white p-4 rounded-md shadow-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-300 text-gray-800">
                <th className="p-2">ID</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Apellido</th>
                <th className="p-2">Cédula</th>
                <th className="p-2">Nacionalidad</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Dirección 1</th>
                <th className="p-2">Dirección 2</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {producers.map((producer) => (
                <tr className="border-b bg-gray-100 text-gray-900" key={producer.id}>
                  <td className="border p-2">{producer.id}</td>
                  <td className="border p-2">{producer.nombre}</td>
                  <td className="border p-2">{producer.apellido}</td>
                  <td className="border p-2">{producer.cedula}</td>
                  <td className="border p-2">
                    {nationalities.find(
                      (nat) => nat.id === producer.nacionalidadId
                    )?.nombre || producer.nacionalidadId}
                  </td>
                  <td className="border p-2">{producer.telefonoLocal}</td>
                  <td className="border p-2">{producer.direccion1}</td>
                  <td className="border p-2">{producer.direccion2}</td>
                  <td className="border p-2">
                    {producerTypes.find((tp) => tp.id === producer.tipoid)
                      ?.nombre || producer.tipoid}
                  </td>
                  <td className="p-2 flex space-x-2 mt-2">
                    <button
                      onClick={() => openEditModal(producer)}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg border border-yellow-500"
                      title="Editar Productor"
                    >
                      <MdEdit size={24}/>
                    </button>
                    <button
                      onClick={() => handleDelete(producer)}
                      className="bg-red-400 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500"
                      title="Eliminar Productor"
                    >
                      <FaTimes size={24}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                      {tp.nombre}
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
              <p className="mb-4 text-center">
                ¿Desea eliminar este productor?
              </p>
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
    </div>
  );
}
