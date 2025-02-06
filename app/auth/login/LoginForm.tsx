"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 🔴 Comentamos la validación real y solo redirigimos al usuario
    // Aquí normalmente iría la llamada a la API para validar usuario y contraseña.
    // Ejemplo de endpoint que podrías usar en el futuro:
    // fetch("http://localhost:3000/api/login", { method: "POST", body: JSON.stringify({ username, password }) })

    router.push("/dashboard"); // Redirige al dashboard sin validar datos.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 rounded-md"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 rounded-md"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded-md">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
