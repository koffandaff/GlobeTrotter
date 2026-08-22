"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

/**
 * Auth guard hook. Call at the top of any protected client component.
 * - If not authenticated → redirect to /login
 * - If requireRole is set and user doesn't have it → redirect to /dashboard
 */
export function useAuthGuard(requireRole?: "ADMIN") {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to resolve

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requireRole && user?.role !== requireRole) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, requireRole, router]);

  return { user, isLoading, isAuthenticated };
}
