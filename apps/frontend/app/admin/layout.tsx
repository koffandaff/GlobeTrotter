"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "ADMIN") {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading admin interface...</div>;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "250px", borderRight: "1px solid var(--color-border)", background: "var(--color-surface)", padding: "var(--space-4)", display: "flex", flexDirection: "column" }}>
        <h2 style={{ marginBottom: "var(--space-6)" }}>Admin Panel</h2>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Link 
            href="/admin" 
            style={{ 
              padding: "var(--space-2) var(--space-3)", 
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              color: isActive("/admin") ? "var(--color-primary)" : "var(--color-text)",
              background: isActive("/admin") ? "var(--color-primary-soft)" : "transparent",
              fontWeight: isActive("/admin") ? 600 : 400
            }}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/users" 
            style={{ 
              padding: "var(--space-2) var(--space-3)", 
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              color: isActive("/admin/users") ? "var(--color-primary)" : "var(--color-text)",
              background: isActive("/admin/users") ? "var(--color-primary-soft)" : "transparent",
              fontWeight: isActive("/admin/users") ? 600 : 400
            }}
          >
            User Management
          </Link>
          <Link 
            href="/admin/logs" 
            style={{ 
              padding: "var(--space-2) var(--space-3)", 
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              color: isActive("/admin/logs") ? "var(--color-primary)" : "var(--color-text)",
              background: isActive("/admin/logs") ? "var(--color-primary-soft)" : "transparent",
              fontWeight: isActive("/admin/logs") ? 600 : 400
            }}
          >
            System Logs
          </Link>
        </nav>
      </aside>
      
      <div style={{ flex: 1, padding: "0" }}>
        {children}
      </div>
    </div>
  );
}