"use client";

import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {user ? user.name : "Invitado"}</h1>
    </div>
  );
}