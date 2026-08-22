"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
    closeNav();
  };

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    // Read avatar from localStorage
    const saved = localStorage.getItem("userAvatar");
    if (saved) {
      setAvatar(saved);
    }
  }, [pathname]); // Re-check when route changes (e.g. after login/profile update)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNav();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-trip", label: "Plan a Trip" },
    { href: "/itinerary-builder", label: "Itinerary Builder" },
    { href: "/my-trips", label: "My Trips" },
    { href: "/profile", label: "Profile" },
    { href: "/city-search", label: "City Search" },
    { href: "/activity-search", label: "Activities" },
    { href: "/itinerary-view", label: "Itinerary View" },
    { href: "/budget", label: "Budget" },
    { href: "/community", label: "Community" },
    { href: "/calendar", label: "Calendar" },
  ];

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="flex items-center gap-2">
            {!isAuthPage && user?.role !== "ADMIN" && (
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
              <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="brand" onClick={closeNav}>
                <span className="brand-mark" aria-hidden="true"></span>
                GlobeTrotter
              </Link>
            )}
          </div>

          {!isAuthPage && (
            <div className="header-actions" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link href={user?.role === "ADMIN" ? "/admin" : "/profile"} className="avatar-btn" aria-label={user?.role === "ADMIN" ? "Admin dashboard" : "User profile"} style={{ padding: (avatar && user?.role !== "ADMIN") ? 0 : undefined, overflow: "hidden" }}>
                {user?.role === "ADMIN" ? "AP" : avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase() : "U"
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost"
                style={{
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  color: "var(--color-danger)"
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {user?.role !== "ADMIN" && (
        <>
          <div
            className={`nav-backdrop ${isOpen ? "open" : ""}`}
            onClick={closeNav}
            aria-hidden="true"
          />

          <nav className={`main-nav ${isOpen ? "open" : ""}`} aria-label="Primary">
            {navLinks.map((link) => {
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

            <div
              style={{
                marginTop: "auto",
                paddingTop: "16px",
                borderTop: "1px solid var(--color-border)",
              }}
            >
            </div>
          </nav>
        </>
      )}
    </>
  );
}
