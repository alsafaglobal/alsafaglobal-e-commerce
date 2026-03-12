'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qty = newItem.quantity ?? 1;
    setItems((prev) => {
      const key = `${newItem.id}-${newItem.size}`;
      const existing = prev.find((i) => `${i.id}-${i.size}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.size}` === key
            ? { ...i, quantity: Math.min(i.quantity + qty, 10) }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((i) => `${i.id}-${i.size}` !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => `${i.id}-${i.size}` !== cartKey));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (`${i.id}-${i.size}` === cartKey ? { ...i, quantity: Math.min(quantity, 10) } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
