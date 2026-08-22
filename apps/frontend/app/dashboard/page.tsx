import React from "react";
import Link from "next/link";
import { currentUser, trips, popularCities } from "@/data/data";
import { StatCard } from "@/components/StatCard";
import { TripCard } from "@/components/TripCard";
import { EmptyState } from "@/components/EmptyState";
import { CityTile } from "@/components/CityTile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your GlobeTrotter travel overview",
};

export default function DashboardPage() {
  const upcomingCount = trips.filter((t) => t.status === "upcoming").length;
  const completedCount = trips.filter((t) => t.status === "completed").length;
  const totalBudget = trips.reduce((acc, trip) => acc + (trip.budget || 0), 0);

  return (
    <main className="page-main">
      <div className="page-header">
        <div className="eyebrow">Overview</div>
        <h1>Where to next, {currentUser.firstName}?</h1>
        <p>Here is a quick summary of your travel plans and budgets.</p>
      </div>

      <section className="section">
        <div className="grid grid-3">
          <StatCard label="Upcoming Trips" value={upcomingCount} />
          <StatCard label="Completed Trips" value={completedCount} />
          <StatCard label="Total Planned Budget" value={`$${totalBudget.toLocaleString()}`} />
        </div>
      </section>

      <section className="section mt-4">
        <div className="section-title-row">
          <h2>Your trips</h2>
          <Link href="/create-trip" className="btn btn-primary">
            Plan a trip
          </Link>
        </div>
        {trips.length === 0 ? (
          <EmptyState
            title="No trips yet"
            message="You don't have any trips planned right now. Let's change that!"
            actionLabel="Plan a trip"
            actionHref="/create-trip"
          />
        ) : (
          <div className="grid grid-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      <section className="section mt-4">
        <div className="section-title-row">
          <h2>Popular destinations</h2>
        </div>
        <div className="grid grid-4">
          {popularCities.map((city) => (
            <CityTile key={city.id} city={city} />
          ))}
        </div>
      </section>

      <section className="section mt-4">
        <div className="section-title-row">
          <h2>Budget highlights</h2>
        </div>
        <div className="placeholder-box">
          <p className="mb-0">
            You have planned a total of <strong>${totalBudget.toLocaleString()}</strong> across{" "}
            {trips.length} trips.
          </p>
        </div>
      </section>
    </main>
  );
}
