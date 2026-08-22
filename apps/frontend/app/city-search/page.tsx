import React, { Suspense } from "react";
import type { Metadata } from "next";
import { CitySearch } from "@/features/cities/components/CitySearch";

export const metadata: Metadata = {
  title: "City Search & Discovery",
  description: "Search worldwide destination cities and add them directly to your travel itineraries.",
};

export default function CitySearchPage() {
  return (
    <main className="page-main">
      <div className="page-header">
        <h1>City Search & Discovery</h1>
        <p>Discover destinations worldwide and add them directly to your trips.</p>
      </div>

      <Suspense fallback={<div className="spinner" style={{ margin: "40px auto" }} />}>
        <CitySearch />
      </Suspense>
    </main>
  );
}
