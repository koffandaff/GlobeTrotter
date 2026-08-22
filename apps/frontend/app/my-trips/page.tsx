"use client";

import React, { useState, useMemo } from "react";
import { trips, Trip } from "@/data/data";
import { Toolbar } from "@/components/shared/Toolbar";
import { TripListSection } from "@/components/layout/TripListSection";

export default function MyTripsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [groupBy, setGroupBy] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");

  // Options for toolbar
  const groupByOptions = [
    { label: "Status", value: "status" },
    { label: "Destination", value: "destination" },
  ];

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
  ];

  const sortOptions = [
    { label: "Start date", value: "startDate" },
    { label: "Recently added", value: "recent" },
  ];

  // Derive filtered and sorted trips
  const processedTrips = useMemo(() => {
    let result = [...trips];

    // 1. Search (case insensitive matching on name or destination)
    if (searchValue.trim()) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(lowerSearch) ||
          t.destination.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Filter Status
    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "startDate") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        // "recent" - assuming higher ID or just reverse natural order to simulate recent
        // For mock data, we just reverse the array comparison to show newer things first
        // A simple way is string comparison on ID if they are sequential (e.g., t1, t2, t3)
        return b.id.localeCompare(a.id);
      }
    });

    return result;
  }, [searchValue, filterStatus, sortBy]);

  // Compute sections based on groupBy
  const sections = useMemo(() => {
    if (groupBy === "status") {
      // Show the three sections if we're grouping by status
      // Note: If filterStatus is set to "upcoming", the other sections will just be empty.
      return [
        {
          title: "Ongoing",
          trips: processedTrips.filter((t) => t.status === "ongoing"),
          emptyMessage: "No ongoing trips right now.",
        },
        {
          title: "Upcoming",
          trips: processedTrips.filter((t) => t.status === "upcoming"),
          emptyMessage: "No upcoming trips right now.",
        },
        {
          title: "Completed",
          trips: processedTrips.filter((t) => t.status === "completed"),
          emptyMessage: "No completed trips right now.",
        },
      ];
    } else if (groupBy === "destination") {
      // Dynamic grouping by destination
      const destinations = Array.from(new Set(processedTrips.map((t) => t.destination)));
      
      // Sort destinations alphabetically
      destinations.sort();

      if (destinations.length === 0) {
        return [
          {
            title: "Destinations",
            trips: [],
            emptyMessage: "No trips found matching your filters.",
          },
        ];
      }

      return destinations.map((dest) => ({
        title: dest,
        trips: processedTrips.filter((t) => t.destination === dest),
        emptyMessage: `No trips found for ${dest}.`,
      }));
    }

    return [];
  }, [processedTrips, groupBy]);

  return (
    <main className="page-main">
      <div className="page-header">
        <h1>My Trips</h1>
        <p>Manage all your past, present, and future adventures.</p>
      </div>

      <Toolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={groupByOptions}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterOptions={filterOptions}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={sortOptions}
        actionLabel="+ Plan a trip"
        actionHref="/create-trip"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {sections.map((section, idx) => (
          <TripListSection
            key={idx}
            title={section.title}
            trips={section.trips}
            emptyMessage={section.emptyMessage}
          />
        ))}
      </div>
    </main>
  );
}
