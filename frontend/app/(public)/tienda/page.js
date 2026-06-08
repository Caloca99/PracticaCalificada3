"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../components/api.js";
import { useAuth } from "../../components/AuthProvider.jsx";
import { useCart } from "../../components/CartProvider.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import { useToast } from "../../components/Toast.jsx";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";

export default function TiendaPage() {
  return (
    <ProtectedRoute>
      <Tienda />
    </ProtectedRoute>
  );
}

function Tienda() {
  const { user } = useAuth();
  const { add } = useCart();
  const { push } = useToast();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api("/products");
        setProducts(data);
      } catch (error) {
        push(error.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [push]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        )
      : products;

    if (sort === "price-asc") {
      return [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price-desc") {
      return [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return filtered;
  }, [products, search, sort]);

  async function handleAdd(product) {
    if (!user) {
      router.push("/login?next=/tienda");
      return;
    }
    setAddingId(product.id);
    try {
      await add(product.id, 1);
      push(`${product.name} agregado al carrito`, "success");
    } catch (error) {
      push(error.message, "error");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <main className="shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Catalogo fitness</p>
          <h1>Bienvenido, {user?.name.split(" ")[0]}</h1>
          <p className="hero-copy">
            Explora suplementos, accesorios y equipamiento para llevar tu
            entrenamiento al siguiente nivel.
          </p>
        </div>
        <div className="stats">
          <span>{products.length} productos</span>
        </div>
      </section>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="relevance">Orden: Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </section>

      {loading ? (
        <p className="empty">Cargando productos...</p>
      ) : visible.length === 0 ? (
        <p className="empty">No se encontraron productos.</p>
      ) : (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={handleAdd}
              adding={addingId === product.id}
            />
          ))}
        </div>
      )}
    </main>
  );
}
