import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BudgetView } from "@/features/budget/components/BudgetView";

export const metadata: Metadata = {
  title: "Budget & Cost Breakdown",
  description: "Track and manage your trip financial allocations, expenses, and budget alerts.",
};

export default function BudgetPage() {
  return (
    <main className="page-main">
      <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
        <BudgetView />
      </Suspense>
    </main>
  );
}
