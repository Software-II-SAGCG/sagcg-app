"use client";
import Sidebar from "../components/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authContext = useContext(AuthContext);
  if (!authContext?.user) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex">
      <Sidebar rolid={authContext.user.rolid}/>
      <main className="flex-1">{children}</main>
    </div>
  );
}