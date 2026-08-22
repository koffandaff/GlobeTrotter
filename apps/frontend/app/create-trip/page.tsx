import React, { Suspense } from "react";
import type { Metadata } from "next";
import { CreateTripForm } from "@/features/trips/components/CreateTripForm";
import { SuggestionCard } from "@/components/ui/SuggestionCard";
import { tripSuggestions } from "@/data/data";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export const metadata: Metadata = {
  title: "Plan a New Trip",
  description: "Create and plan a new personalized travel itinerary.",
};

export default function CreateTripPage() {
  return (
    <ProtectedRoute>
      <main
        className="page-main"
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
          <div className="page-header">
            <h1>Plan a new trip</h1>
            <p>Fill in the details below to start planning your next adventure.</p>
          </div>
          <CreateTripForm />
        </div>

        <aside style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <div className="page-header">
            <h2 style={{ fontSize: "1.25rem", margin: 0, paddingBottom: "8px" }}>
              Suggested places to visit
            </h2>
          </div>
          <div>
            {tripSuggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </aside>
      </main>
    </ProtectedRoute>
  );
}
