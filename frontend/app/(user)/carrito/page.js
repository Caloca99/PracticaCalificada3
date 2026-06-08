"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../../components/CartProvider.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useToast } from "../../components/Toast.jsx";

export default function CarritoPage() {
  return (
    <ProtectedRoute>
      <Carrito />
    </ProtectedRoute>
  );
}

function Carrito() {
  const { items, subtotal, update, remove, clear, loadingCart } = useCart();
  const { push } = useToast();
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [emptying, setEmptying] = useState(false);

  async function changeQuantity(item, delta) {
    const next = Number(item.quantity) + delta;
    if (next < 1) return;
    if (next > item.stock) {
      push(`Solo hay ${item.stock} unidades disponibles`, "error");
      return;
    }
    setBusyId(item.id);
    try {
      await update(item.id, next);
    } catch (error) {
      push(error.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(item) {
    setBusyId(item.id);
    try {
      await remove(item.id);
    } catch (error) {
      push(error.message, "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleClear() {
    setEmptyying(true);
    try {
      await clear();
    } catch (error) {
      push(error.message, "error");
    } finally {
      setEmptyying(false);
    }
  }

  if (loadingCart) {
    return (
      <main className="shell">
        <p className="empty">Cargando carrito...</p>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="topbar topbar-compact">
        <div>
          <p className="eyebrow">Tu seleccion</p>
          <h1>Carrito de compras</h1>
          <p className="hero-copy">
            Revisa los productos antes de confirmar la compra.
          </p>
        </div>
        <div className="stats">
          <span>{items.length} items</span>
          <span>Total S/ {subtotal.toFixed(2)}</span>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="empty">Tu carrito esta vacio.</p>
          <Link href="/tienda" className="primary btn-inline">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div className="cart-item-body">
                  <h3>{item.name}</h3>
                  <p>S/ {Number(item.price).toFixed(2)} c/u</p>
                  <div className="cart-item-controls">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item, -1)}
                      disabled={busyId === item.id}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item, 1)}
                      disabled={busyId === item.id || item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-side">
                  <strong>S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleRemove(item)}
                    disabled={busyId === item.id}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="cart-summary">
            <h2>Resumen</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>S/ {subtotal.toFixed(2)}</strong>
            </div>
            <p className="cart-summary-hint">Envio y pagos se coordinan al confirmar.</p>
            <button
              type="button"
              className="primary"
              onClick={() => router.push("/checkout")}
            >
              Ir a checkout
            </button>
            <button
              type="button"
              className="ghost"
              onClick={handleClear}
              disabled={emptying}
            >
              {emptying ? "Vaciando..." : "Vaciar carrito"}
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
