import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, mockUsuarios } from './mock-data';

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('psis_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, _password: string) => {
    const found = mockUsuarios.find((u) => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('psis_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('psis_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
