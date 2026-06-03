"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image_url: ""
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.stock), 0),
    [products]
  );

  async function loadProducts() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url.trim()
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = response.status === 204 ? null : await response.json();

      if (!response.ok) {
        throw new Error(data?.details?.join(", ") || data?.message || "Error");
      }

      setMessage(editingId ? "Producto actualizado" : "Producto creado");
      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm("Eliminar este producto?");

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "No se pudo eliminar");
      }

      setMessage("Producto eliminado");
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Express + MySQL + Next.js</p>
          <h1>CALOCA GYM</h1>
          <p className="hero-copy">
            Administra productos fitness, controla stock y publica articulos
            listos para entrenar.
          </p>
        </div>
        <div className="stats" aria-label="Resumen de inventario">
          <span>{products.length} productos</span>
          <span>{totalStock} unidades</span>
        </div>
      </section>

      <section className="workspace">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>{editingId ? "Editar producto" : "Nuevo producto fitness"}</h2>
            {editingId && (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>

          <label>
            Nombre
            <input
              name="name"
              placeholder="Ej. Proteina Whey 2 lb"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              required
            />
          </label>

          <label>
            Descripcion
            <textarea
              name="description"
              placeholder="Describe el producto, uso recomendado o caracteristicas principales"
              value={form.description}
              onChange={handleChange}
              minLength={5}
              required
            />
          </label>

          <div className="form-grid">
            <label>
              Precio
              <input
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Imagen URL
            <input
              name="image_url"
              type="url"
              placeholder="https://ejemplo.com/producto.jpg"
              value={form.image_url}
              onChange={handleChange}
            />
          </label>

          <div className="image-helper">
            {form.image_url ? (
              <img src={form.image_url} alt="Vista previa del producto" />
            ) : (
              <span>Si dejas este campo vacio, la API asignara una imagen automaticamente.</span>
            )}
          </div>

          <button className="primary" disabled={saving}>
            {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>

        <section className="catalog">
          <div className="catalog-heading">
            <h2>Catalogo fitness</h2>
            <button className="ghost" onClick={loadProducts}>
              Recargar
            </button>
          </div>

          {loading ? (
            <p className="empty">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="empty">Aun no hay productos fitness registrados.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.image_url} alt={product.name} />
                  <div className="product-body">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </div>
                    <div className="product-meta">
                      <strong>S/ {Number(product.price).toFixed(2)}</strong>
                      <span>{product.stock} en stock</span>
                    </div>
                    <div className="actions">
                      <button onClick={() => startEdit(product)}>Editar</button>
                      <button
                        className="danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
