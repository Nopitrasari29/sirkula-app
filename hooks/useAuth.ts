'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '../lib/types';
import { deriveUserLevel } from '../lib/logic/calculatePoints';

const DEFAULT_USER: UserProfile = {
  id: 'usr-mahasiswa-1',
  name: 'Budi Pratama',
  email: 'budi.kos@mahasiswa.ac.id',
  role: 'Mahasiswa Kos',
  university: 'Institut Teknologi Bandung',
  boardingName: 'Kos Wisma Ganesha 3',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  points: 380,
  level: 'Pejuang Pemilah Kos',
  levelProgress: 60,
  streakDays: 8,
  totalWasteKg: 14.5,
  totalRecycledKg: 14.5,
  co2SavedKg: 23.2,
  totalCo2SavedKg: 23.2,
  totalTreesSaved: 1.5,
  totalEarnedMoney: 62500,
  badges: [],
  isLoggedIn: true,
};

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load from localStorage or fallback
    const saved = localStorage.getItem('sirkula_user_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(DEFAULT_USER);
      }
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem('sirkula_user_session', JSON.stringify(DEFAULT_USER));
    }
    setIsLoading(false);
  }, []);

  const updateUserPoints = (additionalPoints: number, additionalWasteKg: number = 0, additionalMoney: number = 0) => {
    setUser((prev) => {
      if (!prev) return null;
      const newPoints = prev.points + additionalPoints;
      const currentWaste = prev.totalWasteKg || prev.totalRecycledKg || 0;
      const newWasteKg = Number((currentWaste + additionalWasteKg).toFixed(2));
      const { level, progress } = deriveUserLevel(newPoints);
      const currentMoney = prev.totalEarnedMoney || 0;

      const updated: UserProfile = {
        ...prev,
        points: newPoints,
        level,
        levelProgress: progress,
        totalWasteKg: newWasteKg,
        totalRecycledKg: newWasteKg,
        co2SavedKg: Number((newWasteKg * 1.6).toFixed(1)),
        totalCo2SavedKg: Number((newWasteKg * 1.6).toFixed(1)),
        totalTreesSaved: Number((newWasteKg / 10).toFixed(1)),
        totalEarnedMoney: currentMoney + additionalMoney,
      };

      localStorage.setItem('sirkula_user_session', JSON.stringify(updated));
      return updated;
    });
  };

  const login = (email: string, name?: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      name: name || email.split('@')[0],
      isLoggedIn: true,
    };
    setUser(newUser);
    localStorage.setItem('sirkula_user_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sirkula_user_session');
  };

  return {
    user,
    isLoading,
    updateUserPoints,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
