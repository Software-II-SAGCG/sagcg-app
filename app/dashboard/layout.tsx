"use client";
import Sidebar from "../components/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  const [queryClient] = useState(() => new QueryClient());

  if (!authContext?.user) {
    return <p>Loading...</p>;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex">
        <Sidebar rolid={authContext.user.rolid} />
        <main className="flex-1 ml-64">{children}</main>
      </div>
    </QueryClientProvider>
  )
}