"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login");
        }
      } else if (user) {
        // Authenticated user logic
        if (user.role === "ADMIN") {
          if (!pathname.startsWith("/admin")) {
            router.push("/admin");
          }
        } else {
          // Normal user logic
          if (pathname.startsWith("/admin")) {
            router.push("/dashboard");
          } else if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
            router.push("/dashboard");
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;
  }

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup") {
    return null; // Prevents flash of protected content
  }

  return <>{children}</>;
}
