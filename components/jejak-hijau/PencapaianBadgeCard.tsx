'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { BadgeDetailData } from './BadgeDetailModal';
import { getUserProfile, getScanHistory, getBookings } from '@/lib/utils/storage';

interface PencapaianBadgeCardProps {
  onSelectBadge?: (badge: BadgeDetailData) => void;
}

export default function PencapaianBadgeCard({ onSelectBadge }: PencapaianBadgeCardProps) {
  const [userKg, setUserKg] = useState<number>(18.6);
  const [scansTotal, setScansTotal] = useState<number>(3);
  const [bookingsTotal, setBookingsTotal] = useState<number>(1);

  const loadData = () => {
    const user = getUserProfile();
    const scans = getScanHistory();
    const bookings = getBookings();

    if (user && typeof user.totalRecycledKg === 'number' && user.totalRecycledKg > 0) {
      setUserKg(user.totalRecycledKg);
    }
    setScansTotal(scans.length);
    setBookingsTotal(bookings.length);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const badgesList = useMemo(() => {
    return [
      {
        id: 'b-1',
        title: 'Eco Beginner',
        description: 'Badge awal untuk pemilah sampah pemula',
        unlocked: userKg >= 10,
        targetWeightKg: 10,
        currentWeightKg: Math.min(10, userKg),
        progressPercent: Math.min(100, Math.round((userKg / 10) * 100)),
        rewardPoints: 100,
        unlockedLevelTitle: 'Beginner',
        iconPath: '/assets/icons/badge-shield-leaf.png',
        circleBg: 'bg-[#FFF9E6]',
        requirements: [
          { text: 'Scan minimal 1 kali', completed: scansTotal >= 1 },
          { text: 'Menyelesaikan 1 booking', completed: bookingsTotal >= 1 },
          { text: 'Kelola total 10 kg sampah', completed: userKg >= 10 },
          { text: 'Selesaikan 1 kuis edukasi', completed: true },
        ],
      },
      {
        id: 'b-2',
        title: 'Eco Warrior',
        description: 'Badge untuk pemilah sampah konsisten',
        unlocked: userKg >= 25,
        targetWeightKg: 25,
        currentWeightKg: Math.min(25, userKg),
        progressPercent: Math.min(100, Math.round((userKg / 25) * 100)),
        rewardPoints: 150,
        unlockedLevelTitle: 'Warrior',
        iconPath: '/assets/icons/badge-sparkle-leaf.png',
        circleBg: 'bg-[#E8E6DF]',
        requirements: [
          { text: 'Scan minimal 5 kali', completed: scansTotal >= 5, progressText: `${scansTotal} / 5` },
          { text: 'Menyelesaikan 3 booking', completed: bookingsTotal >= 3, progressText: `${bookingsTotal} / 3` },
          { text: 'Kelola total 25 kg sampah', completed: userKg >= 25, progressText: `${userKg.toFixed(1)} / 25` },
          { text: 'Selesaikan 2 kuis edukasi', completed: true },
        ],
      },
      {
        id: 'b-3',
        title: 'Eco Champion',
        description: 'Badge untuk pejuang lingkungan aktif',
        unlocked: userKg >= 50,
        targetWeightKg: 50,
        currentWeightKg: Math.min(50, userKg),
        progressPercent: Math.min(100, Math.round((userKg / 50) * 100)),
        rewardPoints: 250,
        unlockedLevelTitle: 'Champion',
        iconPath: userKg >= 50 ? '/assets/icons/badge-sparkle-leaf.png' : '/assets/icons/badge-cute-lock.png',
        circleBg: 'bg-[#FFF3C4]',
        requirements: [
          { text: 'Scan minimal 10 kali', completed: scansTotal >= 10, progressText: `${scansTotal} / 10` },
          { text: 'Menyelesaikan 5 booking', completed: bookingsTotal >= 5, progressText: `${bookingsTotal} / 5` },
          { text: 'Kelola total 50 kg sampah', completed: userKg >= 50, progressText: `${userKg.toFixed(1)} / 50` },
          { text: 'Selesaikan 3 kuis edukasi', completed: false, progressText: '1 / 3' },
        ],
      },
      {
        id: 'b-4',
        title: 'Eco Guardian',
        description: 'Badge tertinggi untuk penjaga bumi sejati',
        unlocked: userKg >= 100,
        targetWeightKg: 100,
        currentWeightKg: Math.min(100, userKg),
        progressPercent: Math.min(100, Math.round((userKg / 100) * 100)),
        rewardPoints: 500,
        unlockedLevelTitle: 'Guardian',
        iconPath: userKg >= 100 ? '/assets/icons/badge-shield-leaf.png' : '/assets/icons/badge-cute-lock.png',
        circleBg: 'bg-[#C8D1C0]',
        requirements: [
          { text: 'Scan minimal 20 kali', completed: scansTotal >= 20, progressText: `${scansTotal} / 20` },
          { text: 'Menyelesaikan 10 booking', completed: bookingsTotal >= 10, progressText: `${bookingsTotal} / 10` },
          { text: 'Kelola total 100 kg sampah', completed: userKg >= 100, progressText: `${userKg.toFixed(1)} / 100` },
          { text: 'Selesaikan 5 kuis edukasi', completed: false, progressText: '1 / 5' },
        ],
      },
    ];
  }, [userKg, scansTotal, bookingsTotal]);

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-5 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#1C4D38] font-display">
          Pencapaian Badge
        </h3>
        <button
          type="button"
          onClick={() => onSelectBadge && onSelectBadge(badgesList[2])}
          className="flex items-center gap-0.5 text-xs font-extrabold text-[#1C4D38] hover:underline cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Badges Grid (4 Circular Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {badgesList.map((badge) => (
          <div
            key={badge.id}
            onClick={() => onSelectBadge && onSelectBadge(badge)}
            className="p-3 text-center flex flex-col items-center justify-between space-y-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 group"
          >
            {/* Circular Badge Icon Box */}
            <div className="relative">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${badge.circleBg} flex items-center justify-center p-2.5 shadow-sm border border-white/80 group-hover:scale-105 transition-transform duration-200`}>
                <img
                  src={badge.iconPath}
                  alt={badge.title}
                  className="w-full h-full object-contain filter drop-shadow-2xs"
                />
              </div>

              {/* Status Badge Checkmark Indicator for Unlocked */}
              {badge.unlocked && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#1C4D38] text-white flex items-center justify-center border-2 border-white shadow-2xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Title & Weight Target */}
            <div>
              <h4 className="text-xs font-black text-[#1C4D38] font-display leading-tight">
                {badge.title}
              </h4>
              <p className="text-[10px] text-[#1C4D38]/70 font-extrabold mt-0.5">
                {badge.targetWeightKg} kg
              </p>
            </div>

            {/* Progress Bar for Locked Badges */}
            {!badge.unlocked && (
              <div className="w-full bg-white/80 border border-[#1C4D38]/15 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-[#66B086] h-full rounded-full transition-all duration-500"
                  style={{ width: `${badge.progressPercent}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
