import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "user" | "admin";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const CartContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    // Mock: admin@pizza.com = admin, else user
    const role: UserRole = email === "admin@pizza.com" ? "admin" : "user";
    setUser({ name: role === "admin" ? "Admin" : "User", email, role });
    return true;
  };

  const register = (name: string, email: string, _password: string) => {
    setUser({ name, email, role: "user" });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <CartContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </CartContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
