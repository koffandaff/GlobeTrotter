"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { City, CostCategory } from "../types";
import { listCities } from "../api/citiesApi";

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [costCategory, setCostCategory] = useState<CostCategory>("ALL");
  const [sortBy, setSortBy] = useState<"POPULARITY" | "COST_ASC" | "COST_DESC" | "NAME">("POPULARITY");

  const fetchCitiesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await listCities({
        search: search.trim() || undefined,
        region: region !== "all" ? region : undefined,
        limit: 50,
      });
      setCities(res.cities);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cities.");
    } finally {
      setIsLoading(false);
    }
  }, [search, region]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCitiesData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCitiesData]);

  // Client-side cost category filter and sorting
  const processedCities = useMemo(() => {
    let result = [...cities];

    // Filter cost
    if (costCategory !== "ALL") {
      result = result.filter((c) => {
        const cost = c.costIndex ?? 3;
        if (costCategory === "BUDGET") return cost <= 2;
        if (costCategory === "MID_RANGE") return cost === 3;
        if (costCategory === "LUXURY") return cost >= 4;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "POPULARITY") return b.popularityScore - a.popularityScore;
      if (sortBy === "COST_ASC") return (a.costIndex ?? 3) - (b.costIndex ?? 3);
      if (sortBy === "COST_DESC") return (b.costIndex ?? 3) - (a.costIndex ?? 3);
      if (sortBy === "NAME") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [cities, costCategory, sortBy]);

  return {
    cities: processedCities,
    total,
    isLoading,
    error,
    search,
    setSearch,
    region,
    setRegion,
    costCategory,
    setCostCategory,
    sortBy,
    setSortBy,
    refetch: fetchCitiesData,
  };
}
