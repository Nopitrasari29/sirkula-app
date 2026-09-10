'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { getUserProfile } from '@/lib/utils/storage';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';
import { GPS_STORAGE_KEY } from '@/hooks/useGeolocation';
import NotificationPopover from '@/components/ui/NotificationPopover';
import UserProfilePopover from '@/components/ui/UserProfilePopover';

export default function HeaderBar() {
  const [userName, setUserName] = useState('Fika Azzahra');
  const [userLocation, setUserLocation] = useState('Sukolilo, Surabaya');
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [mounted, setMounted] = useState(false);

  const updateHeader = () => {
    setMounted(true);

    const user = getUserProfile();
    if (user && user.name) {
      setUserName(user.name);
    }

    // Prioritize active GPS location if available
    try {
      const gpsRaw = localStorage.getItem(GPS_STORAGE_KEY);
      if (gpsRaw) {
        const parsed = JSON.parse(gpsRaw);
        if (parsed?.name) {
          const cleanName = parsed.name.replace(' (GPS Real-Time)', '').replace(' (Default)', '').trim();
          setUserLocation(cleanName);
        } else if (user?.defaultLocation) {
          setUserLocation(user.defaultLocation);
        }
      } else if (user?.defaultLocation) {
        setUserLocation(user.defaultLocation);
      }
    } catch (e) {
      if (user?.defaultLocation) setUserLocation(user.defaultLocation);
    }

    setLang(getCurrentLanguage());
  };

  useEffect(() => {
    updateHeader();
    window.addEventListener('storage', updateHeader);
    window.addEventListener('sirkula:locationChange', updateHeader);
    return () => {
      window.removeEventListener('storage', updateHeader);
      window.removeEventListener('sirkula:locationChange', updateHeader);
    };
  }, []);

  const t = translations[lang] || translations.id;
  const displayFirstName = mounted && userName ? userName.split(' ')[0] : '...';

  const handleOpenLocationPrompt = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sirkula:openLocationModal'));
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 relative z-30">
      
      {/* Left Greeting Text */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display">
          {t.header.greeting} {displayFirstName}!
        </h1>
        <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
          {t.header.subgreeting}
        </p>
      </div>

      {/* Right Widgets */}
      <div className="flex items-center gap-2.5 relative">

        {/* Location Selector Pill */}
        <button
          type="button"
          onClick={handleOpenLocationPrompt}
          className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white rounded-full border border-[#1C4D38]/10 shadow-sm text-xs font-bold text-[#1C4D38] cursor-pointer hover:shadow-md hover:border-emerald-600 transition-all duration-200"
          title="Klik untuk menyalakan GPS atau memilih lokasi domisili kamu"
        >
          <span className="relative flex h-2 w-2 mr-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="max-w-[150px] truncate">{userLocation}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#1C4D38]/50 ml-0.5" />
        </button>

        {/* 🔔 Reusable Global Notification Popover Component */}
        <NotificationPopover />

        {/* 👤 Reusable Global User Profile Popover Component */}
        <UserProfilePopover />

      </div>
    </header>
  );
}
