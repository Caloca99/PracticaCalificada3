"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/AuthProvider.jsx";
import { useToast } from "../../components/Toast.jsx";

export default function RegistroPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function validateClient() {
    if (form.name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Ingresa un email valido";
    }
    if (form.password.length < 8) {
      return "La contrasena debe tener al menos 8 caracteres";
    }
    if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      return "La contrasena debe incluir al menos una letra y un numero";
    }
    if (form.password !== form.password_confirm) {
      return "Las contrasenas no coinciden";
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

    setSubmitting(true);
    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      push(`Cuenta creada, bienvenido ${result.name.split(" ")[0]}`, "success");
      router.replace("/tienda");
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
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Registrate para comprar productos fitness.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nombre completo
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={120}
              required
            />
          </label>
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
              autoComplete="new-password"
              minLength={8}
              maxLength={64}
              value={form.password}
              onChange={handleChange}
              required
            />
            <span className="form-hint">Minimo 8 caracteres, con al menos una letra y un numero.</span>
          </label>
          <label>
            Repetir contrasena
            <input
              type="password"
              name="password_confirm"
              autoComplete="new-password"
              minLength={8}
              maxLength={64}
              value={form.password_confirm}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="message message-error">{error}</p>}

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="auth-footer">
          Ya tienes cuenta? <Link href="/login">Ingresa aqui</Link>
        </p>
      </section>
    </main>
  );
}
