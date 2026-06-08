"use client";

import { useEffect, useState } from "react";
import { api } from "../../../components/api.js";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import ProductCard from "../../../components/ProductCard.jsx";
import ProductForm from "../../../components/ProductForm.jsx";
import { useToast } from "../../../components/Toast.jsx";

export default function AdminProductosPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminProductos />
    </ProtectedRoute>
  );
}

function AdminProductos() {
  const { push } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api("/products");
      setProducts(data);
    } catch (error) {
      push(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      if (editing) {
        await api(`/products/${editing.id}`, { method: "PUT", body: payload });
        push("Producto actualizado", "success");
      } else {
        await api("/products", { method: "POST", body: payload });
        push("Producto creado", "success");
      }
      setEditing(null);
      await load();
    } catch (error) {
      push(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Eliminar ${product.name}?`)) return;
    try {
      await api(`/products/${product.id}`, { method: "DELETE" });
      push("Producto eliminado", "success");
      await load();
    } catch (error) {
      push(error.message, "error");
    }
  }

  function startEdit(product) {
    setEditing({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <main className="shell">
      <section className="topbar topbar-compact">
        <div>
          <p className="eyebrow">Inventario</p>
          <h1>Gestion de productos</h1>
          <p className="hero-copy">
            Crea, edita o elimina productos del catalogo fitness.
          </p>
        </div>
        <div className="stats">
          <span>{products.length} productos</span>
        </div>
      </section>

      <div className="workspace">
        <ProductForm
          initial={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <section className="catalog">
          <div className="catalog-heading">
            <h2>Productos</h2>
            <button type="button" className="ghost" onClick={load}>
              Recargar
            </button>
          </div>
          {loading ? (
            <p className="empty">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="empty">Aun no hay productos registrados.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
