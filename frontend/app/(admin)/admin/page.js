"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../components/api.js";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { useAuth } from "../../components/AuthProvider.jsx";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, orders: 0, total: 0, lowStock: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usersData, ordersData, productsData] = await Promise.all([
          api("/users"),
          api("/orders"),
          api("/products")
        ]);

        const total = (ordersData.orders || []).reduce(
          (sum, order) => sum + Number(order.total),
          0
        );
        const lowStock = (productsData || []).filter((product) => Number(product.stock) < 5);

        setStats({
          users: (usersData.users || []).length,
          orders: (ordersData.orders || []).length,
          total,
          lowStock
        });
      } catch (error) {
        setStats((current) => ({ ...current, error: error.message }));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="shell">
      <section className="topbar topbar-compact">
        <div>
          <p className="eyebrow">Panel admin</p>
          <h1>Hola, {user?.name.split(" ")[0]}</h1>
          <p className="hero-copy">
            Resumen general de la tienda, ordenes y alertas de inventario.
          </p>
        </div>
        <div className="stats">
          <span>{stats.users} usuarios</span>
          <span>{stats.orders} ordenes</span>
        </div>
      </section>

      <div className="admin-grid">
        <Link href="/admin/productos" className="admin-card">
          <h3>Productos</h3>
          <p>Crear, editar y eliminar productos del catalogo.</p>
        </Link>
        <Link href="/admin/ordenes" className="admin-card">
          <h3>Ordenes</h3>
          <p>Revisa las compras realizadas por los clientes.</p>
        </Link>
        <Link href="/admin/usuarios" className="admin-card">
          <h3>Usuarios</h3>
          <p>Lista de personas registradas en la plataforma.</p>
        </Link>
        <div className="admin-card admin-card-metric">
          <h3>Total vendido</h3>
          <p className="admin-metric">
            {loading ? "..." : `S/ ${stats.total.toFixed(2)}`}
          </p>
        </div>
      </div>

      <section className="catalog">
        <div className="catalog-heading">
          <h2>Alertas de stock bajo</h2>
        </div>
        {loading ? (
          <p className="empty">Cargando...</p>
        ) : stats.lowStock.length === 0 ? (
          <p className="empty">No hay productos con stock bajo.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStock.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className="cell-warn">{product.stock}</td>
                  <td>S/ {Number(product.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
