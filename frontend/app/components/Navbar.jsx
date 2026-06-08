"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider.jsx";
import { useCart } from "./CartProvider.jsx";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { totalCount } = useCart();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="navbar">
      <Link href={user ? "/tienda" : "/login"} className="navbar-brand">
        CALOCA <span>GYM</span>
      </Link>
      <nav className="navbar-links">
        {user && (
          <Link href="/tienda" className="navbar-link">
            Tienda
          </Link>
        )}
        {user && (
          <Link href="/carrito" className="navbar-link navbar-cart">
            Carrito
            {totalCount > 0 && <span className="navbar-badge">{totalCount}</span>}
          </Link>
        )}
        {user?.role === "admin" && (
          <Link href="/admin" className="navbar-link">
            Panel admin
          </Link>
        )}
        {!loading && !user && (
          <>
            <Link href="/login" className="navbar-link">
              Ingresar
            </Link>
            <Link href="/registro" className="navbar-link navbar-link-primary">
              Crear cuenta
            </Link>
          </>
        )}
        {!loading && user && (
          <>
            <span className="navbar-user">
              Hola, <strong>{user.name.split(" ")[0]}</strong>
              {user.role === "admin" && <span className="navbar-role">admin</span>}
            </span>
            <button type="button" className="navbar-link navbar-button" onClick={handleLogout}>
              Salir
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
