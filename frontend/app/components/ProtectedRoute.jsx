"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/tienda");
    }
  }, [user, loading, requiredRole, router]);

  if (loading || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="route-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  return children;
}
