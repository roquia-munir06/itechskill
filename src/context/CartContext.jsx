// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const STORAGE_KEY = "itechskill_cart";

export const CartProvider = ({ children }) => {

  // ── Load from localStorage on first render ──
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Sync to localStorage whenever cart changes ──
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // private browsing / quota exceeded — fail silently
    }
  }, [cartItems]);

  const addToCart = (course) => {
    setCartItems((prev) => {
      if (prev.find((item) => item._id === course._id)) return prev; // no duplicates
      return [...prev, course];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  // ── Price helpers ──
  const cartTotal = cartItems
    .reduce((sum, item) => {
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      return sum + price;
    }, 0)
    .toFixed(2);

  const cartOriginalTotal = cartItems
    .reduce((sum, item) => {
      const price = parseFloat(String(item.originalPrice || item.price).replace(/[^0-9.]/g, "")) || 0;
      return sum + price;
    }, 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartOriginalTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);