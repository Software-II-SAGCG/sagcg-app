"use client";

import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const user = useAuth();

  if (!user) return null;

  return <h1>Bienvenido {user.username} al Dashboard</h1>;
}
