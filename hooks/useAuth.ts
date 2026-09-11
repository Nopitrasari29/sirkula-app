'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { getUserProfile, saveUserProfile, logoutUser, addPoints } from '../lib/utils/storage';
import { apiClient } from '../lib/services/apiClient';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncProfile = useCallback(() => {
    const profile = getUserProfile();
    setUser(profile);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    syncProfile();

    const handleStorageChange = () => {
      syncProfile();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sirkula:profileChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sirkula:profileChange', handleStorageChange);
    };
  }, [syncProfile]);

  const updateUserPoints = (additionalPoints: number, additionalWasteKg: number = 0) => {
    const updated = addPoints(additionalPoints, additionalWasteKg);
    setUser(updated);
    return updated;
  };

  const login = (profileData: Partial<UserProfile>) => {
    const current = getUserProfile();
    const updated: UserProfile = {
      ...current,
      ...profileData,
      isLoggedIn: true,
    };
    saveUserProfile(updated);
    setUser(updated);
  };

  const logout = () => {
    apiClient.auth.logout();
    const loggedOut = logoutUser();
    setUser(loggedOut);
  };

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user && user.isLoggedIn),
    updateUserPoints,
    login,
    logout,
    refreshProfile: syncProfile,
  };
}
