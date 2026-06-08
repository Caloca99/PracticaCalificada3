"use client";

import { useEffect, useState } from "react";
import { api } from "../../../components/api.js";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import { useToast } from "../../../components/Toast.jsx";

export default function AdminUsuariosPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminUsuarios />
    </ProtectedRoute>
  );
}

function AdminUsuarios() {
  const { push } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/users");
        setUsers(data.users || []);
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
          <p className="eyebrow">Comunidad</p>
          <h1>Usuarios registrados</h1>
          <p className="hero-copy">
            Personas con cuenta en CALOCA GYM.
          </p>
        </div>
        <div className="stats">
          <span>{users.length} cuentas</span>
        </div>
      </section>

      <section className="catalog">
        {loading ? (
          <p className="empty">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="empty">Aun no hay usuarios registrados.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registrado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-pill role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
