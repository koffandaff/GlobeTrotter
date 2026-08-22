"use client";

import React, { useState, useMemo } from "react";
import { popularCities } from "@/data/data";
import { Toolbar } from "@/components/shared/Toolbar";
import { CityResultCard } from "@/components/ui/CityResultCard";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CitySearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [costFilter, setCostFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const filterOptions = [
    { label: "All Regions", value: "all" },
    { label: "Asia", value: "Asia" },
    { label: "Europe", value: "Europe" },
    { label: "Americas", value: "Americas" },
  ];

  const groupByOptions = [
    { label: "All Budgets", value: "all" },
    { label: "Budget", value: "Budget" },
    { label: "Mid-range", value: "Mid-range" },
    { label: "Luxury", value: "Luxury" },
  ];

  const sortOptions = [
    { label: "Popularity", value: "popularity" },
    { label: "Cost", value: "cost" },
  ];

  const processedCities = useMemo(() => {
    let result = [...popularCities];

    // 1. Search Filter (City name or country)
    if (searchValue.trim()) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerSearch) ||
          c.country.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Region Filter
    if (regionFilter !== "all") {
      result = result.filter((c) => c.region === regionFilter);
    }

    // 3. Cost Filter (mapped using groupBy prop from Toolbar for the second filter)
    if (costFilter !== "all") {
      result = result.filter((c) => c.costIndex === costFilter);
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === "popularity") {
        return b.popularity - a.popularity;
      } else {
        // Sort by Cost: Budget -> Mid-range -> Luxury
        const costWeights: Record<string, number> = {
          "Budget": 1,
          "Mid-range": 2,
          "Luxury": 3,
        };
        return costWeights[a.costIndex] - costWeights[b.costIndex];
      }
    });

    return result;
  }, [searchValue, regionFilter, costFilter, sortBy]);

  return (
    <main className="page-main">
      <div className="page-header">
        <h1>City Search</h1>
        <p>Discover new destinations and add them directly to your trips.</p>
      </div>

      <Toolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterStatus={regionFilter}
        onFilterStatusChange={setRegionFilter}
        filterOptions={filterOptions}
        groupBy={costFilter}
        onGroupByChange={setCostFilter}
        groupByOptions={groupByOptions}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={sortOptions}
      />

      <div style={{ marginTop: "24px" }}>
        {processedCities.length === 0 ? (
          <EmptyState title="No cities found" message="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-3">
            {processedCities.map((city) => (
              <CityResultCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
