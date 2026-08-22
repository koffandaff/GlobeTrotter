"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

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
    { href: "/my-trips", label: "My Trips" },
    { href: "/itinerary-builder", label: "Itinerary Builder" },
    { href: "/itinerary-view", label: "Itinerary View" },
    { href: "/community", label: "Community" },
    { href: "/city-search", label: "City Search" },
    { href: "/activity-search", label: "Activities" },
    { href: "/budget", label: "Budget" },
    { href: "/calendar", label: "Calendar" },
    { href: "/shared-itinerary", label: "Shared View" },
    { href: "/profile", label: "Profile" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="flex items-center gap-2">
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
            <Link href="/" className="brand" onClick={closeNav}>
              <span className="brand-mark" aria-hidden="true"></span>
              GlobeTrotter
            </Link>
          </div>

          <div className="header-actions">
            <Link href="/profile" className="avatar-btn" aria-label="User profile">
              U
            </Link>
          </div>
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
          <Link href="/login" className={pathname === "/login" ? "active" : ""} onClick={closeNav}>
            Log in
          </Link>
          <Link
            href="/signup"
            className={pathname === "/signup" ? "active" : ""}
            onClick={closeNav}
          >
            Sign up
          </Link>
        </div>
      </nav>
    </>
  );
}
