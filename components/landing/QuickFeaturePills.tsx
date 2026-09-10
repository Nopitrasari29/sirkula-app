'use client';

import React from 'react';
import Link from 'next/link';
import { Scan, Award, Calendar, GraduationCap } from 'lucide-react';

export default function QuickFeaturePills() {
  const pills = [
    {
      id: 'scanner',
      icon: Scan,
      iconImg: '/assets/icons/icon-scanner.png',
      title: 'AI Scanner',
      description: 'Kenali jenis sampah dengan mudah',
      href: '/scanner',
    },
    {
      id: 'jejak',
      icon: Award,
      iconImg: '/assets/icons/icon-jejak.png',
      title: 'Jejak Hijau',
      description: 'Kumpulkan poin dan capai badge-mu',
      href: '/jejak-hijau',
    },
    {
      id: 'booking',
      icon: Calendar,
      iconImg: '/assets/icons/icon-booking.png',
      title: 'Jadwal & Booking',
      description: 'Jadwalkan penjemputan sampah',
      href: '/booking',
    },
    {
      id: 'edukasi',
      icon: GraduationCap,
      iconImg: '/assets/icons/icon-edukasi.png',
      title: 'Edukasi',
      description: 'Belajar dan uji pengetahuanmu',
      href: '/edukasi',
    },
  ];

  return (
    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {pills.map((pill) => {
        const IconComponent = pill.icon;
        return (
          <Link
            key={pill.id}
            href={pill.href}
            className="flex items-center gap-3.5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#1C4D38] shadow-[0_6px_20px_rgba(28,77,56,0.08)] hover:shadow-[0_12px_28px_rgba(28,77,56,0.18)] hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Icon Container (Light Square dengan Border) */}
            <div className="w-11 h-11 rounded-xl border border-[#1C4D38]/30 bg-[#F5F3E9] flex items-center justify-center shrink-0 text-[#1C4D38] group-hover:scale-110 transition-transform duration-300">
              <img
                src={pill.iconImg}
                alt={pill.title}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <IconComponent className="w-6 h-6 hidden fallback-icon" />
            </div>

            {/* Text Title & Description */}
            <div>
              <h4 className="font-extrabold text-[#1C4D38] text-sm leading-tight font-display">
                {pill.title}
              </h4>
              <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-snug mt-0.5">
                {pill.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}