'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderBar from '@/components/dashboard/HeaderBar';
import JejakMetricsGrid from '@/components/jejak-hijau/JejakMetricsGrid';
import TrenSampahChartCard from '@/components/jejak-hijau/TrenSampahChartCard';
import KontribusiJenisSampahCard from '@/components/jejak-hijau/KontribusiJenisSampahCard';
import PencapaianBadgeCard from '@/components/jejak-hijau/PencapaianBadgeCard';
import TargetSelanjutnyaCard from '@/components/jejak-hijau/TargetSelanjutnyaCard';
import AktivitasTerbaruCard from '@/components/jejak-hijau/AktivitasTerbaruCard';
import InsightMingguanCard from '@/components/jejak-hijau/InsightMingguanCard';
import BadgeDetailModal, { BadgeDetailData } from '@/components/jejak-hijau/BadgeDetailModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function JejakHijauPage() {
  const isAuthorized = useAuthGuard();
  const [selectedBadge, setSelectedBadge] = useState<BadgeDetailData | null>(null);

  if (!isAuthorized) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        
        {/* 🍃 Top Leaf Garland Watermark */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-40 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Top Watermark"
            className="w-full h-auto max-h-[320px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <HeaderBar />

          {/* Page Sub-Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display">
              Jejak Hijau
            </h1>
            <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
              Pantau perkembangan kontribusimu untuk lingkungan
            </p>
          </div>

          {/* 1. Top 4 Metric Cards Grid */}
          <JejakMetricsGrid />

          {/* 2. Main Charts Section (Tren Sampah & Kontribusi Jenis Sampah) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Tren Sampah Terkelola (7 Cols) */}
            <div className="lg:col-span-7">
              <TrenSampahChartCard />
            </div>

            {/* Kontribusi Berdasarkan Jenis Sampah (5 Cols) */}
            <div className="lg:col-span-5">
              <KontribusiJenisSampahCard />
            </div>

          </div>

          {/* 3. Badges & Target Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Pencapaian Badge (7 Cols) */}
            <div className="lg:col-span-7">
              <PencapaianBadgeCard onSelectBadge={(badge) => setSelectedBadge(badge)} />
            </div>

            {/* Target Selanjutnya (5 Cols) */}
            <div className="lg:col-span-5">
              <TargetSelanjutnyaCard onSelectBadge={(badge) => setSelectedBadge(badge)} />
            </div>

          </div>

          {/* 4. Recent Activity & Weekly Insight Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Aktivitas Terbaru (7 Cols) */}
            <div className="lg:col-span-7">
              <AktivitasTerbaruCard />
            </div>

            {/* Insight Mingguan (5 Cols) */}
            <div className="lg:col-span-5">
              <InsightMingguanCard />
            </div>

          </div>

        </div>

      </div>

      {/* 🏅 Interactive Badge Detail Modal (Triggered by Badge Click) */}
      <BadgeDetailModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />

    </div>
  );
}
