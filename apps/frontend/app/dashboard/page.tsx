import React from "react";
import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | GlobeTrotter",
  description: "View your upcoming trips, recent activity, and personal stats.",
};

export default function DashboardPage() {
  return (
    <main className="page-main">
      <DashboardView />
    </main>
  );
}
