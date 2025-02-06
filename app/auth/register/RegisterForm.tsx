"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, nombre, apellido, email, password }),
      });

      if (response.ok) {
        // Registro exitoso
        const data = await response.json();
        console.log("Usuario registrado:", data.usuario);
        // Redirige al login
        router.push("/");
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-black text-center text-2xl font-bold mb-2">Registrarse</h2>
        <p className="text-center text-gray-600 mb-4">
          ¿Ya tienes un usuario?{" "}
          <span 
            className="text-blue-500 cursor-pointer underline" 
            onClick={() => router.push("/")}
          >
            Inicia sesión
          </span>
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Usuario"
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

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 font-bold rounded-md"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
