import React from "react";
import type { Metadata } from "next";
import { TripList } from "@/features/trips/components/TripList";

export const metadata: Metadata = {
  title: "My Trips",
  description: "Manage all your past, present, and future travel plans.",
};

export default function MyTripsPage() {
  return (
    <main className="page-main">
      <div className="page-header">
        <h1>My Trips</h1>
        <p>Manage all your past, present, and future adventures.</p>
      </div>

      <TripList />
    </main>
  );
}
