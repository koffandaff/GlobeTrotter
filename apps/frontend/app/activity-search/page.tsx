import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ActivitySearch } from "@/features/activities/components/ActivitySearch";

export const metadata: Metadata = {
  title: "Activity Search & Experiences",
  description: "Browse curated things to do, tours, culinary tastings, and adventures to add to your trip stops.",
};

export default function ActivitySearchPage() {
  return (
    <main className="page-main">
      <div className="page-header">
        <h1>Activity Search</h1>
        <p>Find things to do and add them directly to your itinerary.</p>
      </div>

      <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
        <ActivitySearch />
      </Suspense>
    </main>
  );
}
