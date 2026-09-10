'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { getUserProfile, getScanHistory } from '@/lib/utils/storage';

export default function WeeklyMissionCard() {
  const [currentKg, setCurrentKg] = useState<number>(2.4);
  const targetKg = 5.0;

  const loadMissionProgress = () => {
    const user = getUserProfile();
    const scans = getScanHistory();
    // Count plastic scans or recycledKg
    const baseKg = user && typeof user.totalRecycledKg === 'number' && user.totalRecycledKg > 0
      ? user.totalRecycledKg * 0.4
      : 2.4;
    const additionalKg = scans.reduce((acc, s) => {
      const cat = (s.category || s.categoryName || '').toLowerCase();
      if (cat.includes('plastik') || cat.includes('pet')) {
        return acc + (s.estimatedWeightKg || 0.4);
      }
      return acc;
    }, 0);

    const calculated = Number((baseKg + additionalKg).toFixed(1));
    setCurrentKg(calculated);
  };

  useEffect(() => {
    loadMissionProgress();
    window.addEventListener('storage', loadMissionProgress);
    return () => window.removeEventListener('storage', loadMissionProgress);
  }, []);

  const progressPercent = Math.min(100, Math.round((currentKg / targetKg) * 100));
  const isCompleted = currentKg >= targetKg;

  return (
    <div className="flex flex-col h-full space-y-3">
      <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
        Misi Mingguan
      </h2>

      <div className="flex-1 bg-[#D6E6C5]/70 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs">

        {/* Mission Title & Progress */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#1C4D38]">
              Kumpulkan 5 kg Sampah Plastik
            </span>
            <span className="font-black text-[#1C4D38]">
              {currentKg.toLocaleString('id-ID')} / {targetKg} kg
            </span>
          </div>

          {/* Progress Bar (Warna Emerald Segar Sesuai Figma) */}
          <div className="w-full bg-white/70 rounded-full h-3 p-0.5 overflow-hidden border border-[#1C4D38]/10">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-2xs ${
                isCompleted ? 'bg-emerald-600' : 'bg-[#48A178]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reward Sub-Card (Soft Sage Tint & White Circle Badge) */}
        <div className="bg-[#E3EFE0] rounded-2xl p-4 border border-[#1C4D38]/10 flex items-center gap-3.5 shadow-2xs">
          {/* White Circle Badge with Green Star Icon */}
          <div className="w-10 h-10 rounded-full bg-white text-[#1C4D38] flex items-center justify-center shrink-0 shadow-xs border border-[#1C4D38]/10">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Star className="w-5 h-5 fill-[#1C4D38] text-[#1C4D38]" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#1C4D38]/70 leading-tight">
              {isCompleted ? 'Status Misi' : 'Reward'}
            </p>
            <p className="text-lg font-black text-[#1C4D38] font-display leading-tight mt-0.5">
              {isCompleted ? (
                <span className="text-emerald-700 text-sm font-black">Tercapai! (+100 Poin) 🎉</span>
              ) : (
                <>
                  +100 <span className="text-xs font-semibold text-[#1C4D38]/80">poin</span>
                </>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}