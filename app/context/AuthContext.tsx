"use client";

import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { username: string } | null;
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null);

  const login = (username: string) => setUser({ username });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
