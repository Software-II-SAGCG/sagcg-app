"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    if (!username) {
      setError("Error: Usuario no encontrado.");
    }
  }, [username]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username) {
      setError("Error: No se encontró el usuario.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${username}/edit-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage("Contraseña restablecida correctamente.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Error al restablecer la contraseña.");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setError("Error en la conexión al servidor.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">Restablecer Contraseña</h2>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleReset} className="flex flex-col">
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded-md font-bold">
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
}