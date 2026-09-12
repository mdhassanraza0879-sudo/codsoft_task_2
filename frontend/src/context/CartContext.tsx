'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MenuItem, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('dinedesk_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Save cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dinedesk_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (menuItem: MenuItem, quantity: number = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prevItems.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prevItems, { menuItem, quantity }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = parseFloat(
    items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0).toFixed(2)
  );

  const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% sales tax
  const deliveryFee = subtotal > 35 || subtotal === 0 ? 0 : 3.99; // Free delivery over $35
  const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        tax,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
