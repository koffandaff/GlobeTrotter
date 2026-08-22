"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  AddActivityInput,
  AddStopInput,
  TripItinerary,
  UpdateStopInput,
} from "../types";
import {
  addActivityToStop,
  addTripStop,
  deleteTripActivity,
  deleteTripStop,
  fetchTripItinerary,
  reorderTripStop,
  updateTripStop,
} from "../api/itineraryApi";
import { listTrips } from "@/features/trips/api/tripsApi";

export function useItinerary(initialTripId?: string) {
  const [tripId, setTripId] = useState<string>(initialTripId || "");
  const [availableTrips, setAvailableTrips] = useState<Array<{ id: string; name: string }>>([]);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
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

  // 2. Fetch itinerary data when tripId changes
  const loadItinerary = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTripItinerary(tripId);
      setItinerary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load itinerary.");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  // Stop actions
  const handleAddStop = async (input: AddStopInput) => {
    if (!tripId) return { success: false, error: "No trip selected." };
    try {
      await addTripStop(tripId, input);
      await loadItinerary();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to add stop" };
    }
  };

  const handleUpdateStop = async (stopId: string, input: UpdateStopInput) => {
    try {
      await updateTripStop(stopId, input);
      await loadItinerary();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update stop" };
    }
  };

  const handleReorderStop = async (stopId: string, newSeq: number) => {
    try {
      await reorderTripStop(stopId, newSeq);
      await loadItinerary();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to reorder stop" };
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      await deleteTripStop(stopId);
      await loadItinerary();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to delete stop" };
    }
  };

  // Activity actions
  const handleAddActivity = async (stopId: string, input: AddActivityInput) => {
    try {
      await addActivityToStop(stopId, input);
      await loadItinerary();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to add activity" };
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteTripActivity(activityId);
      await loadItinerary();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to delete activity" };
    }
  };

  return {
    tripId,
    setTripId,
    availableTrips,
    itinerary,
    isLoading,
    error,
    refetch: loadItinerary,
    addStop: handleAddStop,
    updateStop: handleUpdateStop,
    reorderStop: handleReorderStop,
    deleteStop: handleDeleteStop,
    addActivity: handleAddActivity,
    deleteActivity: handleDeleteActivity,
  };
}
