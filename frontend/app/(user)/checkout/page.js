"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../components/api.js";
import { useCart } from "../../components/CartProvider.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useToast } from "../../components/Toast.jsx";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  );
}

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { push } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({ address: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validateClient() {
    if (form.address.trim().length < 10) {
      return "La direccion debe tener al menos 10 caracteres";
    }
    if (!/^[0-9 +()\-]{6,20}$/.test(form.phone.trim())) {
      return "Ingresa un telefono valido (6 a 20 caracteres)";
    }
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }
    if (items.length === 0) {
      setError("Tu carrito esta vacio");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api("/orders/checkout", {
        body: {
          address: form.address.trim(),
          phone: form.phone.trim()
        }
      });
      await clear();
      setConfirmation(data.order);
      push("Compra realizada con exito", "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && !confirmation) {
    return (
      <main className="shell">
        <p className="empty">Tu carrito esta vacio. Agrega productos antes de pagar.</p>
      </main>
    );
  }

  if (confirmation) {
    return (
      <main className="shell">
        <section className="auth-card confirmation">
          <p className="eyebrow">Compra confirmada</p>
          <h1>Gracias por tu compra</h1>
          <p className="hero-copy">
            Tu orden #{confirmation.id} por S/ {Number(confirmation.total).toFixed(2)} fue
            registrada con exito.
          </p>
          <button type="button" className="primary" onClick={() => router.push("/tienda")}>
            Seguir comprando
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="topbar topbar-compact">
        <div>
          <p className="eyebrow">Pago</p>
          <h1>Checkout</h1>
          <p className="hero-copy">
            Confirma tu direccion de envio y telefono de contacto.
          </p>
        </div>
        <div className="stats">
          <span>{items.length} items</span>
          <span>Total S/ {subtotal.toFixed(2)}</span>
        </div>
      </section>

      <div className="cart-layout">
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Direccion de envio
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              minLength={10}
              maxLength={200}
              required
              placeholder="Ej. Av. Principal 123, Lima, Peru"
            />
          </label>
          <label>
            Telefono de contacto
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              minLength={6}
              maxLength={20}
              required
              placeholder="+51 999 888 777"
            />
          </label>

          {error && <p className="message message-error">{error}</p>}

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Procesando..." : "Confirmar compra"}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Resumen de la orden</h2>
          <ul className="cart-summary-items">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>
                  S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </strong>
              </li>
            ))}
          </ul>
          <div className="cart-summary-row">
            <span>Total</span>
            <strong>S/ {subtotal.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
