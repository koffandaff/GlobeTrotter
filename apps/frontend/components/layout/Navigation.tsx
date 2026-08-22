"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
              <Link href="/dashboard" className="brand" onClick={closeNav}>
                <span className="brand-mark" aria-hidden="true"></span>
                GlobeTrotter
              </Link>
            )}
          </div>

          {!isAuthPage && (
            <div className="header-actions">
              <Link href="/profile" className="avatar-btn" aria-label="User profile" style={{ padding: avatar ? 0 : undefined, overflow: "hidden" }}>
                {avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  "VP"
                )}
              </Link>
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
          <button
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "12px 24px",
              background: "none",
              border: "none",
              color: "var(--color-danger)",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}
