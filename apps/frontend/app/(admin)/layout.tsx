import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | GlobeTrotter",
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="admin-shell">
        {children}
      </div>
    </>
  );
}