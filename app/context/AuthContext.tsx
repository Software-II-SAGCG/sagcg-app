"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolid: number;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
