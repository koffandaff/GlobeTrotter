"use client";

import { useState, useEffect, useCallback } from "react";
import type { ListTripsParams, Trip, TripStatus } from "../types";
import { deleteTrip, duplicateTrip, listTrips } from "../api/tripsApi";

export function useTrips(initialParams: ListTripsParams = {}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(initialParams.search || "");
  const [status, setStatus] = useState<TripStatus | "ALL">("ALL");

  const fetchTripsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParams: ListTripsParams = {
        search: search.trim() || undefined,
        status: status !== "ALL" ? status : undefined,
      };
      const result = await listTrips(filterParams);
      setTrips(result.trips);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trips.");
    } finally {
      setIsLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchTripsData();
  }, [fetchTripsData]);

  const handleDuplicate = async (tripId: string) => {
    try {
      const cloned = await duplicateTrip(tripId);
      setTrips((prev) => [cloned, ...prev]);
      setTotal((prev) => prev + 1);
      return { success: true, trip: cloned };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to duplicate trip.";
      return { success: false, error: msg };
    }
  };

  const handleDelete = async (tripId: string) => {
    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      setTotal((prev) => Math.max(0, prev - 1));
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete trip.";
      return { success: false, error: msg };
    }
  };

  return {
    trips,
    total,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    refetch: fetchTripsData,
    duplicateTrip: handleDuplicate,
    deleteTrip: handleDelete,
  };
}
