"use client";

import { useEffect, useState } from "react";
import { api } from "../../../components/api.js";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import { useToast } from "../../../components/Toast.jsx";

export default function AdminOrdenesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminOrdenes />
    </ProtectedRoute>
  );
}

function AdminOrdenes() {
  const { push } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/orders");
        setOrders(data.orders || []);
      } catch (error) {
        push(error.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [push]);

  return (
    <main className="shell">
      <section className="topbar topbar-compact">
        <div>
          <p className="eyebrow">Ventas</p>
          <h1>Ordenes registradas</h1>
          <p className="hero-copy">
            Listado de todas las compras confirmadas en la tienda.
          </p>
        </div>
        <div className="stats">
          <span>{orders.length} ordenes</span>
        </div>
      </section>

      <section className="catalog">
        {loading ? (
          <p className="empty">Cargando ordenes...</p>
        ) : orders.length === 0 ? (
          <p className="empty">Aun no hay ordenes registradas.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>{order.user_name}</div>
                    <small>{order.user_email}</small>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>
                    <ul className="mini-list">
                      {(order.items || []).map((item) => (
                        <li key={`${order.id}-${item.product_id}`}>
                          {item.quantity} x {item.product_name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <strong>S/ {Number(order.total).toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`status-pill status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
