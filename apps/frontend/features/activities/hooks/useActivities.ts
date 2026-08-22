"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Activity } from "../types";
import { searchActivities } from "../api/activitiesApi";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [costFilter, setCostFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"COST_ASC" | "COST_DESC" | "POPULARITY">("POPULARITY");

  const fetchActivitiesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const maxCost =
        costFilter === "under50" ? 50 : costFilter === "50to150" ? 150 : undefined;
      const res = await searchActivities({
        category: category !== "all" ? category : undefined,
        search: search.trim() || undefined,
        maxCost,
        limit: 50,
      });
      setActivities(res.activities);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities.");
    } finally {
      setIsLoading(false);
    }
  }, [category, search, costFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivitiesData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchActivitiesData]);

  // Client-side post-processing & sorting
  const processedActivities = useMemo(() => {
    let result = [...activities];

    if (costFilter === "50to150") {
      result = result.filter((a) => (a.estimatedCost ?? 0) >= 50 && (a.estimatedCost ?? 0) <= 150);
    } else if (costFilter === "over150") {
      result = result.filter((a) => (a.estimatedCost ?? 0) > 150);
    }

    result.sort((a, b) => {
      if (sortBy === "COST_ASC") return (a.estimatedCost ?? 0) - (b.estimatedCost ?? 0);
      if (sortBy === "COST_DESC") return (b.estimatedCost ?? 0) - (a.estimatedCost ?? 0);
      if (sortBy === "POPULARITY") return b.popularityScore - a.popularityScore;
      return 0;
    });

    return result;
  }, [activities, costFilter, sortBy]);

  return {
    activities: processedActivities,
    total,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    costFilter,
    setCostFilter,
    sortBy,
    setSortBy,
    refetch: fetchActivitiesData,
  };
}
