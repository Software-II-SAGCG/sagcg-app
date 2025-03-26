"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Table from "@/app/components/Table";
import Header from "@/app/components/Header";

interface Logger {
  id: number;
  evento: string;
  modulo: string;
  fecha: number;
}

export default function EventLogger() {
  const [loggers, setLoggers] = useState<Logger[]>([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Logger | null>(
    null
  );

  const headers = [
    "ID",
    "Evento",
    "Modulo",
    "Fecha",
    "Hora",
    "",
  ];

  const rows = loggers.map((event) => [
    event.id,
    event.evento,
    event.modulo,
    new Date(event.fecha).toISOString().split("T")[0],
    new Date(event.fecha).toLocaleTimeString(),
    <>
      <button
        onClick={() => handleDelete(event)}
        className="bg-red-300 text-black px-4 py-2 rounded-lg shadow-lg border border-red-500 mx-2 hover:bg-red-500"
        title="Eliminar Productor"
      >
        <FaTimes size={20} />
      </button>
    </>,
  ]);

  // Consultar datos al cargar el componente
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/logger/get");
      const data = await res.json();
      if (res.ok) {
        setLoggers(data);
      } else {
        setError("Error al cargar eventos.");
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
        `http://localhost:3000/api/logger/get/${searchId}`
      );
      const data = await res.json();
      if (res.ok) {
        setLoggers([data]);
      } else {
        setError("Usuario no encontrado.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
  };

  const handleDelete = (event: Logger) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/logger/delete/${eventToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMessage("Evento eliminado exitosamente.");
        setLoggers(loggers.filter((p) => p.id !== eventToDelete.id));
      } else {
        setError("Error al eliminar evento.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en la conexión al servidor.");
    }
    setShowDeleteConfirm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value);
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <Header
        title="Logger de Eventos"
        showSearchBar={true}
        showSearchButton={true}
        searchValue={searchId}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      {/* Lista de Logger de eventos */}

      <Table headers={headers} rows={rows} />

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50">
          <div className="bg-white text-black p-6 items-center rounded-md w-96 shadow-lg">
            <p className="mb-4 text-center">¿Desea eliminar este evento?</p>
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
