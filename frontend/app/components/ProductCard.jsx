"use client";

export default function ProductCard({ product, onEdit, onDelete, onAdd, adding }) {
  return (
    <article className="product-card">
      <img src={product.image_url} alt={product.name} loading="lazy" />
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
          {onAdd && (
            <button
              type="button"
              className="primary"
              onClick={() => onAdd(product)}
              disabled={adding || product.stock < 1}
            >
              {product.stock < 1 ? "Sin stock" : adding ? "Agregando..." : "Agregar"}
            </button>
          )}
          {onEdit && (
            <button type="button" onClick={() => onEdit(product)}>
              Editar
            </button>
          )}
          {onDelete && (
            <button type="button" className="danger" onClick={() => onDelete(product)}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
