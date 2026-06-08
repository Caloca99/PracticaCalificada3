"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../components/AuthProvider.jsx";
import { useToast } from "../../components/Toast.jsx";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="shell"><p className="empty">Cargando...</p></main>}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const { user, loading, login } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/tienda";

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) {
    if (typeof window !== "undefined") {
      router.replace(nextPath);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Ingresa un email valido");
      return;
    }
    if (form.password.length < 1) {
      setError("La contrasena es obligatoria");
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(form.email.trim().toLowerCase(), form.password);
      push(`Bienvenido, ${result.name.split(" ")[0]}`, "success");
      router.replace(result.role === "admin" && nextPath === "/tienda" ? "/admin" : nextPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">CALOCA GYM</p>
        <h1>Ingresar</h1>
        <p className="auth-subtitle">Accede para comprar o administrar la tienda.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contrasena
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              minLength={1}
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="message message-error">{error}</p>}

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-footer">
          No tienes cuenta? <Link href="/registro">Registrate aqui</Link>
        </p>
      </section>
    </main>
  );
}
