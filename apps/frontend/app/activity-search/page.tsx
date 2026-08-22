"use client";

import React, { useState, useMemo } from "react";
import { activities } from "@/data/data";
import { Toolbar } from "@/components/shared/Toolbar";
import { ActivityResultRow } from "@/components/ui/ActivityResultRow";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ActivitySearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [costFilter, setCostFilter] = useState("all");
  const [sortBy, setSortBy] = useState("costAsc");

  // Type options
  const filterOptions = [
    { label: "All Types", value: "all" },
    { label: "Sightseeing", value: "Sightseeing" },
    { label: "Food", value: "Food" },
    { label: "Adventure", value: "Adventure" },
    { label: "Relaxation", value: "Relaxation" },
  ];

  // Cost options (using groupBy prop for second dropdown)
  const groupByOptions = [
    { label: "Any Price", value: "all" },
    { label: "Under $50", value: "under50" },
    { label: "$50 - $150", value: "50to150" },
    { label: "Over $150", value: "over150" },
  ];

  const sortOptions = [
    { label: "Price: Low to High", value: "costAsc" },
    { label: "Price: High to Low", value: "costDesc" },
  ];

  const processedActivities = useMemo(() => {
    let result = [...activities];

    // 1. Search filter
    if (searchValue.trim()) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(lowerSearch));
    }

    // 2. Type filter
    if (typeFilter !== "all") {
      result = result.filter((a) => a.type === typeFilter);
    }

    // 3. Cost filter
    if (costFilter !== "all") {
      result = result.filter((a) => {
        if (costFilter === "under50") return a.cost < 50;
        if (costFilter === "50to150") return a.cost >= 50 && a.cost <= 150;
        if (costFilter === "over150") return a.cost > 150;
        return true;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === "costAsc") return a.cost - b.cost;
      if (sortBy === "costDesc") return b.cost - a.cost;
      return 0;
    });

    return result;
  }, [searchValue, typeFilter, costFilter, sortBy]);

  return (
    <main className="page-main">
      <div className="page-header">
        <h1>Activity Search</h1>
        <p>Find things to do and add them directly to your itinerary.</p>
      </div>

      <Toolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus={typeFilter}
        onFilterStatusChange={setTypeFilter}
        filterOptions={filterOptions}
        groupBy={costFilter}
        onGroupByChange={setCostFilter}
        groupByOptions={groupByOptions}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={sortOptions}
      />

      <div style={{ marginTop: "24px" }}>
        {processedActivities.length === 0 ? (
          <EmptyState title="No activities match your search." message="Try adjusting your filters or search terms." />
        ) : (
          <div>
            {processedActivities.map((activity) => (
              <ActivityResultRow key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
