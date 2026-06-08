"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./components/AuthProvider.jsx";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? (user.role === "admin" ? "/admin" : "/tienda") : "/login");
  }, [user, loading, router]);

  return (
    <main className="shell">
      <p className="empty">Cargando...</p>
    </main>
  );
}
