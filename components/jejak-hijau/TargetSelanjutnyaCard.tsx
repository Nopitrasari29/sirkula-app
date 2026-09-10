'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BadgeDetailData } from './BadgeDetailModal';

interface TargetSelanjutnyaCardProps {
  onSelectBadge?: (badge: BadgeDetailData) => void;
}

export default function TargetSelanjutnyaCard({ onSelectBadge }: TargetSelanjutnyaCardProps) {
  const targetBadge: BadgeDetailData = {
    id: 'b-3',
    title: 'Eco Champion',
    description: 'Badge untuk pejuang lingkungan aktif',
    unlocked: false,
    targetWeightKg: 50,
    currentWeightKg: 43.6,
    progressPercent: 74,
    rewardPoints: 250,
    unlockedLevelTitle: 'Warrior',
    requirements: [
      { text: 'Scan minimal 10 kali', completed: true },
      { text: 'Menyelesaikan 5 booking', completed: true },
      { text: 'Kelola total 50 kg sampah', completed: true },
      { text: 'Selesaikan 3 kuis edukasi', completed: false, progressText: '1 / 3' },
    ],
  };

  const handleOpenModal = () => {
    if (onSelectBadge) onSelectBadge(targetBadge);
  };

  return (
    <div
      onClick={handleOpenModal}
      className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between relative overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 group"
    >
      
      {/* Header */}
      <div className="flex items-center justify-between z-10 relative">
        <h3 className="text-sm font-black text-[#1C4D38] font-display">
          Target Selanjutnya
        </h3>
        <div className="flex items-center gap-0.5 text-xs font-extrabold text-[#1C4D38] group-hover:underline">
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main Target Box */}
      <div className="flex items-center justify-between gap-4 z-10 relative pr-16 sm:pr-20">
        
        {/* Left: Circular Recycle Icon + Title & Progress Bar */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-full bg-[#D6E6C5] flex items-center justify-center shrink-0 border border-[#1C4D38]/10 shadow-xs group-hover:scale-105 transition-transform duration-200 p-2.5">
            <img
              src="/assets/icons/icon-recycle-symbol.png"
              alt="Eco Champion"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#1C4D38] font-display text-sm">
                Eco Champion
              </span>
              <span className="font-black text-[#1C4D38] text-[11px]">
                43,6 / 50 kg
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-[#1C4D38]/10 h-3 rounded-full overflow-hidden p-0.5 border border-[#1C4D38]/15">
              <div className="bg-[#66B086] h-full rounded-full w-[87%] transition-all duration-500 shadow-2xs" />
            </div>
          </div>
        </div>

      </div>

      {/* Motivational Helper Note */}
      <div className="bg-[#D6E6C5]/50 border border-[#1C4D38]/10 rounded-2xl p-3.5 z-10 relative pr-16 sm:pr-20">
        <p className="text-xs text-[#1C4D38] font-bold leading-relaxed">
          Tinggal <span className="font-black text-[#D97745]">6,4 kg</span> lagi!<br />
          Selesaikan misi dan dapatkan Badge Eco Champion +100 poin!
        </p>
      </div>

      {/* Tree Mascot Graphic Standing on Bottom Right Corner (Identik 100% Figma) */}
      <div className="absolute right-0 bottom-0 z-20 pointer-events-none w-24 h-28 sm:w-28 sm:h-32 flex items-end justify-end">
        <img
          src="/assets/illustrations/tree-icon.png"
          alt="Tree Mascot"
          className="w-full h-full object-contain object-bottom filter drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
        />
      </div>

    </div>
  );
}
