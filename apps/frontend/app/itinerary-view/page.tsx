import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ItineraryView } from "@/features/itinerary/components/ItineraryView";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export const metadata: Metadata = {
  title: "Itinerary View",
  description: "Explore your complete day-by-day travel itinerary schedule and timeline.",
};

export default function ItineraryViewPage() {
  return (
    <ProtectedRoute>
      <main className="page-main" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
          <ItineraryView />
        </Suspense>
      </main>
    </ProtectedRoute>
  );
}
