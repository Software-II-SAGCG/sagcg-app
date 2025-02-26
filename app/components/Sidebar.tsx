"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, BookOpen, LogOut, MoreVertical, User } from "lucide-react";
import { useRouter } from "next/navigation";
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

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: <Home size={20} />, roles: [1,2,3] },
    { name: "Perfil", href: "/dashboard/profile", icon: <User size={20} />, roles: [1,2,3] },
    { name: "Datos del Productor", href: "/dashboard/datosproductor", icon: <FileText size={20} />, roles: [1,3] },
    { name: "Perfiles de Usuarios", href: "/dashboard/customerprofile", icon: <Users size={20} />, roles: [1] },
    /*{ name: "Logger de Eventos", href: "/dashboard/logger-eventos", icon: <BookOpen size={20} /> },*/
  ];
  
  const handleLogout = () => {
    // Aquí se puede limpiar tokens o datos de sesión si los tienes
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col overflow-y-auto">
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
      {/* Botón de Cerrar Sesión */}
    
      <div className="mt-auto flex justify-end bg-gray-800">  
        <DropdownMenu> 
          <DropdownMenuTrigger>
            <MoreVertical className="w-5 h-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
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
