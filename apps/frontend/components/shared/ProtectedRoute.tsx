"use client";

import React from "react";
import { useAuthGuard } from "@/lib/auth/useAuthGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "ADMIN";
}

/**
 * Wraps protected pages. Redirects to /login if unauthenticated.
 * Use in Server Component pages that can't call hooks directly.
 */
export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuthGuard(requireRole);

  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return <>{children}</>;
}
