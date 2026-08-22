"use client";

import { useState, useEffect, useCallback } from "react";
import type { UpdateUserProfileInput, UserProfile } from "../types";
import {
  deleteUserAccount,
  getCurrentUserProfile,
  removeSavedDestination,
  updateUserProfile,
} from "../api/profileApi";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCurrentUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdate = async (input: UpdateUserProfileInput) => {
    try {
      const updated = await updateUserProfile(input);
      setProfile(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update profile." };
    }
  };

  const handleRemoveDestination = async (cityId: string) => {
    // Optimistic update
    if (profile) {
      setProfile({
        ...profile,
        savedDestinations: profile.savedDestinations?.filter((d) => d.id !== cityId),
      });
    }
    
    try {
      await removeSavedDestination(cityId);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to remove destination." };
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to delete account." };
    }
  };

  return {
    profile,
    isLoading,
    error,
    refetch: loadProfile,
    updateProfile: handleUpdate,
    removeSavedDestination: handleRemoveDestination,
    deleteAccount: handleDeleteAccount,
  };
}
