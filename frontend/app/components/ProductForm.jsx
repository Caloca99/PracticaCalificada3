"use client";

import { useState } from "react";

const empty = { name: "", description: "", price: "", stock: "", image_url: "" };

export default function ProductForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial || empty);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }
    if (form.description.trim().length < 5) {
      setError("La descripcion debe tener al menos 5 caracteres");
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }
    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un entero mayor o igual a 0");
      return;
    }
    if (form.image_url && !/^https?:\/\//i.test(form.image_url)) {
      setError("La URL de la imagen debe empezar con http:// o https://");
      return;
    }

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      stock,
      image_url: form.image_url.trim()
    });
  }

  const isEdit = Boolean(initial);

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>{isEdit ? "Editar producto" : "Nuevo producto fitness"}</h2>
        {isEdit && (
          <button type="button" className="ghost" onClick={onCancel}>
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
          maxLength={120}
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
          Precio (S/)
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

      {error && <p className="message message-error">{error}</p>}

      <button className="primary" disabled={submitting}>
        {submitting ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
