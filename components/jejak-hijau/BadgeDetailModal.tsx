'use client';

import React from 'react';
import { Check, Star, Unlock } from 'lucide-react';

export interface BadgeDetailData {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  targetWeightKg: number;
  currentWeightKg: number;
  progressPercent: number;
  rewardPoints: number;
  unlockedLevelTitle: string;
  iconPath?: string;
  requirements: Array<{
    text: string;
    completed: boolean;
    progressText?: string;
  }>;
}

interface BadgeDetailModalProps {
  badge: BadgeDetailData | null;
  onClose: () => void;
}

export default function BadgeDetailModal({ badge, onClose }: BadgeDetailModalProps) {
  if (!badge) return null;

  const headerIcon = badge.unlocked 
    ? (badge.iconPath || '/assets/icons/badge-shield-leaf.png') 
    : '/assets/icons/icon-recycle-symbol.png';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Card Box */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[28px] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden text-[#1C4D38] font-sans">
        
        {/* Modal Title */}
        <h3 className="text-base font-black text-[#1C4D38] font-display">
          Detail Badge
        </h3>

        {/* Header: Large Badge Graphic + Info */}
        <div className="flex items-center gap-4">
          
          {/* Badge Icon Container */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#D6E6C5] flex items-center justify-center p-3 border-2 border-[#1C4D38]/20 shadow-md">
              <img
                src={headerIcon}
                alt={badge.title}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>

            {/* Lock Badge Status Tag */}
            <div className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-2xs ${
              badge.unlocked ? 'bg-emerald-600 text-white' : 'bg-[#D1D7C9] text-white p-0.5'
            }`}>
              {badge.unlocked ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <img
                  src="/assets/icons/badge-cute-lock.png"
                  alt="Lock Status"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Text Title & Status */}
          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="text-xl font-black text-[#1C4D38] font-display leading-tight">
              {badge.title}
            </h4>
            <p className="text-xs text-[#1C4D38]/80 font-medium leading-snug">
              {badge.description}
            </p>

            <div className="pt-1">
              <span className={`inline-block px-3.5 py-1 text-[11px] font-extrabold rounded-lg shadow-2xs ${
                badge.unlocked
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#1C4D38] text-white'
              }`}>
                {badge.unlocked ? 'Sudah Didapat' : 'Belum Didapat'}
              </span>
            </div>
          </div>

        </div>

        {/* Middle Section: Progress vs Syarat Badge (2 Columns Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-1">
          
          {/* Progress Column (5 Cols) */}
          <div className="sm:col-span-5 space-y-2">
            <h5 className="text-xs font-black text-[#1C4D38] font-display">
              Progress
            </h5>
            <p className="text-[11px] text-[#1C4D38]/70 font-semibold leading-tight">
              Kelola total {badge.targetWeightKg} kg sampah
            </p>

            <div className="pt-1 space-y-1">
              <p className="text-sm font-black text-[#1C4D38] font-display">
                {badge.currentWeightKg} / {badge.targetWeightKg} kg
              </p>
              
              {/* Mint Progress Bar */}
              <div className="w-full bg-[#1C4D38]/10 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-[#66B086] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, badge.progressPercent)}%` }}
                />
              </div>
              <p className="text-[10px] font-extrabold text-[#1C4D38]/60 text-right">
                {badge.progressPercent}%
              </p>
            </div>
          </div>

          {/* Syarat Badge Column (7 Cols) */}
          <div className="sm:col-span-7 space-y-2">
            <h5 className="text-xs font-black text-[#1C4D38] font-display">
              Syarat Badge
            </h5>

            <div className="space-y-1.5 text-xs">
              {badge.requirements.map((req, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      req.completed ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className={`text-[11px] font-bold leading-tight ${
                      req.completed ? 'text-[#1C4D38]' : 'text-gray-600'
                    }`}>
                      {req.text}
                    </span>
                  </div>

                  {req.progressText && (
                    <span className="text-[10px] font-bold text-gray-500 shrink-0">
                      {req.progressText}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Reward Section (2 Cards Grid) */}
        <div className="space-y-2 pt-1">
          <h5 className="text-xs font-black text-[#1C4D38] font-display">
            Reward
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Card 1: Points Reward */}
            <div className="bg-[#F5F0E6] border border-[#1C4D38]/10 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0 shadow-2xs">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h6 className="text-xs font-black text-[#1C4D38] font-display">
                  +{badge.rewardPoints} poin
                </h6>
                <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-snug mt-0.5">
                  Hadiah poin setelah badge terbuka
                </p>
              </div>
            </div>

            {/* Card 2: Level Unlock Reward */}
            <div className="bg-[#F5F0E6] border border-[#1C4D38]/10 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#1C4D38]/10 text-[#1C4D38] flex items-center justify-center shrink-0 shadow-2xs">
                <Unlock className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h6 className="text-xs font-black text-[#1C4D38] font-display">
                  Membuka Level {badge.unlockedLevelTitle}
                </h6>
                <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-snug mt-0.5">
                  Akses ke badge selanjutnya
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Tutup Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38] text-[#1C4D38] text-xs font-extrabold rounded-xl transition shadow-2xs active:scale-95 text-center cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  );
}
