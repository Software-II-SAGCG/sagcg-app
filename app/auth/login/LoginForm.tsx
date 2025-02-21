"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showResetButton, setShowResetButton] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      // Codificar las credenciales en Base64 para Basic Auth
      const credentials = btoa(`${username}:${password}`);
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json"
        }
      });
  
      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos.");
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= 3) {
          setShowResetButton(true);
        }
      }
    } catch (err) {
      console.error("Error durante la solicitud:", err);
      setError("Error en la conexión al servidor.");
    }
  };
  
  const handleRegister = () => {
    router.push("/auth/register"); // Redirige a la página de registro
  };

  const handleResetPassword = async () => {
    router.push(`/auth/reset?username=${username}`);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 items-center justify-center shadow-md rounded-md w-96">
        <h2 className="text-black text-center text-2xl font-bold mb-4">SAGCG</h2>
        <h2 className="text-black text-center text-2xl font-bold mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 rounded-md text-black"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 font-bold rounded-md">
            Iniciar Sesión
          </button>
          {/* 🔹 Botón de Registrarse */}
          <button 
            onClick={handleRegister} 
            className="bg-gray-300 text-black py-2 rounded-md font-bold mt-4 w-full">
            Registrarse
          </button>
        </form>
        {showResetButton && (
          <button
            onClick={handleResetPassword}
            className="bg-gray-300 text-black py-2 rounded-md font-bold mt-4 w-full"
          >
            Restablecer Contraseña
          </button>
        )}
      </div>
    </div>
  );
}
