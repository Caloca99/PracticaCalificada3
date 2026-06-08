"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { api } from "./api.js";
import { useAuth } from "./AuthProvider.jsx";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoadingCart(true);
    try {
      const data = await api("/cart");
      setItems(data.items || []);
    } catch (error) {
      setItems([]);
    } finally {
      setLoadingCart(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    refresh();
  }, [user, loading, refresh]);

  const add = useCallback(
    async (productId, quantity = 1) => {
      const data = await api("/cart/items", { body: { product_id: productId, quantity } });
      setItems(data.items || []);
    },
    []
  );

  const update = useCallback(async (itemId, quantity) => {
    const data = await api(`/cart/items/${itemId}`, {
      method: "PUT",
      body: { quantity }
    });
    setItems(data.items || []);
  }, []);

  const remove = useCallback(async (itemId) => {
    const data = await api(`/cart/items/${itemId}`, { method: "DELETE" });
    setItems(data.items || []);
  }, []);

  const clear = useCallback(async () => {
    await api("/cart", { method: "DELETE" });
    setItems([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity), 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, loadingCart, totalCount, subtotal, refresh, add, update, remove, clear }),
    [items, loadingCart, totalCount, subtotal, refresh, add, update, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
