"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNav();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    closeNav();
    logout();
    router.push("/login");
  };

  // Compute user initials for avatar
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-trip", label: "Plan a Trip" },
    { href: "/itinerary-builder", label: "Itinerary Builder" },
    { href: "/my-trips", label: "My Trips" },
    { href: "/profile", label: "Profile" },
    { href: "/city-search", label: "City Search" },
    { href: "/activity-search", label: "Activities" },
    { href: "/budget", label: "Budget" },
    { href: "/community", label: "Community" },
    { href: "/calendar", label: "Calendar" },
  ];

  // Only show Admin link if the user is an ADMIN
  if (user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="flex items-center gap-2">
            {!isAuthPage && (
              <button
                className="nav-toggle"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                onClick={toggleNav}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            {isAuthPage ? (
              <span className="brand" style={{ cursor: "default" }}>
                <span className="brand-mark" aria-hidden="true"></span>
                GlobeTrotter
              </span>
            ) : (
              <Link href="/" className="brand" onClick={closeNav}>
                <span className="brand-mark" aria-hidden="true"></span>
                GlobeTrotter
              </Link>
            )}
          </div>

          {!isAuthPage && (
            <div className="header-actions">
              {!isLoading && isAuthenticated ? (
                <Link href="/profile" className="avatar-btn" aria-label="User profile" title={`${user?.firstName} ${user?.lastName}`}>
                  {initials}
                </Link>
              ) : (
                !isLoading && (
                  <Link href="/login" className="btn btn-primary" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                    Log in
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </header>

      <div
        className={`nav-backdrop ${isOpen ? "open" : ""}`}
        onClick={closeNav}
        aria-hidden="true"
      />

      <nav className={`main-nav ${isOpen ? "open" : ""}`} aria-label="Primary">
        {/* Authenticated nav links */}
        {!isLoading && isAuthenticated && navLinks.map((link) => {
          const isActive =
            pathname === link.href || (pathname === "/" && link.href === "/dashboard");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "active" : ""}
              aria-current={isActive ? "page" : undefined}
              onClick={closeNav}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Auth links — only show when NOT authenticated */}
        {!isLoading && !isAuthenticated && (
          <>
            <Link href="/login" onClick={closeNav}>Log in</Link>
            <Link href="/signup" onClick={closeNav}>Sign up</Link>
          </>
        )}

        {/* Logout — only show when authenticated */}
        {!isLoading && isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-danger, #dc2626)",
              cursor: "pointer",
              fontSize: "inherit",
              fontWeight: 600,
              padding: "var(--space-3) var(--space-4)",
              textAlign: "left",
              width: "100%",
              marginTop: "auto",
            }}
          >
            Log out
          </button>
        )}
      </nav>
    </>
  );
}
