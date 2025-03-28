"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, Users, FileText, BookOpen, LogOut, MoreVertical, User, Logs, DollarSign, ChartBar  } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

interface SidebarProps {
  rolid: number;
}

const Sidebar = ({ rolid }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: <Home size={20} />, roles: [1,2,3] },
    { name: "Perfil", href: "/dashboard/profile", icon: <User size={20} />, roles: [1,2,3] },
    { name: "Perfiles de Usuarios", href: "/dashboard/customerprofile", icon: <Users size={20} />, roles: [1] },
    { name: "Datos del Productor", href: "/dashboard/datosproductor", icon: <FileText size={20} />, roles: [1,3] },
    { name: "Portafolio de Cosechas", href: "/dashboard/harvestportfolio", icon: <BookOpen size={20} />, roles: [1,3] },
    { name: "Logger de Eventos", href: "/dashboard/eventlogger", icon: <Logs size={20} />, roles: [1] },
    { name: "Financiamiento", href: "/dashboard/financiamiento", icon: <DollarSign size={20} />, roles: [1,3] },
    { name: "Estadisticas", href: "/dashboard/statistics", icon: <ChartBar size={20} style={{ transform: "rotate(-90deg)" }} />, roles: [1]}
  ];
  
  const handleLogout = () => {
    if(authContext){
      authContext.logout();
    }
    router.push("/");
  };

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-4 flex flex-col overflow-y-auto z-50">
      <h2 className="text-lg text-center font-bold mb-6">Menú</h2>
      <nav className="space-y-2 flex-grow">
        {menuItems
        .filter(item => item.roles.includes(rolid))
        .map((item) => (
          <Link
           key={item.name}
           href={item.href}
           className={`flex items-center gap-3 p-2 rounded-lg transition-colors
            ${pathname === item.href ? "bg-blue-500" : "hover:bg-gray-700"}`}>
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex justify-end bg-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="w-5 h-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-gray-800">
            <DropdownMenuLabel>Cuenta: {authContext?.user?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => handleLogout()}>
                <LogOut className="mr-2 h-4 w-4 text-destructive" />
                <span className="text-destructive">Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;

