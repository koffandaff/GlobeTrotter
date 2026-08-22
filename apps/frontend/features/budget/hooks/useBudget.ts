"use client";

import { useState, useEffect, useCallback } from "react";
import type { BudgetCategory, TripBudgetBreakdown } from "../types";
import { fetchTripBudget, updateCategoryBudget } from "../api/budgetApi";
import { listTrips } from "@/features/trips/api/tripsApi";

export function useBudget(initialTripId?: string) {
  const [tripId, setTripId] = useState<string>(initialTripId || "");
  const [availableTrips, setAvailableTrips] = useState<Array<{ id: string; name: string }>>([]);
  const [budgetData, setBudgetData] = useState<TripBudgetBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch available trips for the selector
  useEffect(() => {
    async function loadUserTrips() {
      try {
        const { trips } = await listTrips({ limit: 50 });
        const list = trips.map((t) => ({ id: t.id, name: t.name }));
        setAvailableTrips(list);
        if (!tripId && list.length > 0) {
          setTripId(list[0].id);
        }
      } catch {
        // Fallback handled
      }
    }
    loadUserTrips();
  }, [tripId]);

  // 2. Fetch budget breakdown when tripId changes
  const loadBudget = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTripBudget(tripId);
      setBudgetData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load budget breakdown.");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  const handleUpdateCategory = async (category: BudgetCategory, amount: number | null) => {
    if (!tripId) return { success: false, error: "No trip selected." };
    try {
      await updateCategoryBudget(tripId, category, amount);
      await loadBudget();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update category budget" };
    }
  };

  return {
    tripId,
    setTripId,
    availableTrips,
    budgetData,
    isLoading,
    error,
    refetch: loadBudget,
    updateCategory: handleUpdateCategory,
  };
}
