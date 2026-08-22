import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ItineraryBuilder } from "@/features/itinerary/components/ItineraryBuilder";

export const metadata: Metadata = {
  title: "Itinerary Builder",
  description: "Plan your trip stops, organize destinations, and schedule daily activities.",
};

export default function ItineraryBuilderPage() {
  return (
    <main className="page-main" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="page-header">
        <h1>Itinerary Builder</h1>
        <p>Plan out your multi-city trip. Add destination stops, reorder routes, and schedule activities.</p>
      </div>

      <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
        <ItineraryBuilder />
      </Suspense>
    </main>
  );
}
