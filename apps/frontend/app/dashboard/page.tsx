import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/components/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "Your GlobeTrotter travel hub, recent trips, recommendations, and budget highlights.",
};

export default function DashboardPage() {
  return (
    <main className="page-main">
      <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
        <DashboardView />
      </Suspense>
    </main>
  );
}
