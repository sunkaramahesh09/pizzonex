import React, { createContext, useContext, useState, ReactNode } from "react";
import { Pizza, CartItem } from "@/data/mockData";

interface CartContextType {
  items: CartItem[];
  addToCart: (pizza: Pizza, quantity?: number, customizations?: string[]) => void;
  removeFromCart: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (pizza: Pizza, quantity = 1, customizations?: string[]) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.pizza.id === pizza.id);
      if (existing) {
        return prev.map((i) =>
          i.pizza.id === pizza.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { pizza, quantity, customizations }];
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setItems((prev) => prev.filter((i) => i.pizza.id !== pizzaId));
  };

  const updateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.pizza.id === pizzaId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.pizza.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
