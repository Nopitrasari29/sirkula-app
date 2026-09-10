'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderBar from '@/components/dashboard/HeaderBar';
import WeeklyActivityMetrics from '@/components/dashboard/WeeklyActivityMetrics';
import NextBookingCard from '@/components/dashboard/NextBookingCard';
import WeeklyMissionCard from '@/components/dashboard/WeeklyMissionCard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import DailyTipCarousel from '@/components/dashboard/DailyTipCarousel';
import NearbyBankSampahCarousel from '@/components/dashboard/NearbyBankSampahCarousel';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function DashboardPage() {
  const isAuthorized = useAuthGuard();

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Right Main Dashboard Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        
        {/* 🍃 Dedaunan Hanya Menggunakan leaf-garland-top.png */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-40 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Top Watermark"
            className="w-full h-auto max-h-[450px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        {/* Content Sections Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          
          {/* Header Greeting & Right Action Bar */}
          <HeaderBar />

          {/* Aktivitas Minggu Ini (4 Cards Grid) */}
          <WeeklyActivityMetrics />

          {/* Booking Selanjutnya & Misi Mingguan (2 Columns Equal Height) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <NextBookingCard />
            <WeeklyMissionCard />
          </div>

          {/* Aktivitas Terbaru & Tips Hari Ini (2 Columns Equal Height) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <RecentActivityList />
            <DailyTipCarousel />
          </div>

          {/* Bank Sampah Terdekat */}
          <NearbyBankSampahCarousel />

        </div>
      </div>

    </div>
  );
}
