import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "GlobeTrotter",
    template: "%s | GlobeTrotter",
  },
  description: "Empowering Personalized Travel Planning",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="app-shell">
            <Navigation />
            {children}
            <footer className="site-footer">GlobeTrotter — Hackathon</footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
