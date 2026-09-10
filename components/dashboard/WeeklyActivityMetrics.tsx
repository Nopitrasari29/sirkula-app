'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Star, Leaf, Award } from 'lucide-react';
import { getUserProfile, getBookings, getScanHistory } from '@/lib/utils/storage';

export default function WeeklyActivityMetrics() {
  const [recycledKg, setRecycledKg] = useState<string>('18,6');
  const [points, setPoints] = useState<string>('860');
  const [setoranCount, setSetoranCount] = useState<string>('12');
  const [badgeCount, setBadgeCount] = useState<string>('7');

  const updateMetrics = () => {
    const user = getUserProfile();
    const scans = getScanHistory();
    const bookings = getBookings();

    const calculatedSetoran = 8 + scans.length + bookings.length;
    setSetoranCount(calculatedSetoran.toString());

    if (user) {
      if (typeof user.totalRecycledKg === 'number' && user.totalRecycledKg > 0) {
        setRecycledKg(user.totalRecycledKg.toLocaleString('id-ID'));
      }
      if (typeof user.points === 'number' && user.points > 0) {
        setPoints(user.points.toLocaleString('id-ID'));
      }
      if (user.badges && user.badges.length > 0) {
        setBadgeCount(user.badges.length.toString());
      }
    }
  };

  useEffect(() => {
    updateMetrics();
    window.addEventListener('storage', updateMetrics);
    return () => window.removeEventListener('storage', updateMetrics);
  }, []);

  const metrics = [
    {
      id: 'sampah',
      title: 'Sampah Terkumpul',
      value: recycledKg,
      unit: 'kg',
      change: '+2,4 kg dari minggu lalu',
      icon: Trash2,
      bgColor: 'bg-[#D6E6C5]/70 backdrop-blur-md', // Soft Sage Green
      iconBg: 'bg-[#1C4D38]/15 text-[#1C4D38]',
    },
    {
      id: 'poin',
      title: 'Total Poin',
      value: points,
      unit: '',
      change: '+120 poin dari minggu lalu',
      icon: Star,
      bgColor: 'bg-[#F9EED3]/70 backdrop-blur-md', // Soft Warm Cream
      iconBg: 'bg-[#D9A74E]/25 text-[#D9A74E]',
    },
    {
      id: 'setoran',
      title: 'Total Setoran',
      value: setoranCount,
      unit: '',
      change: '+5 setoran dari minggu lalu',
      icon: Leaf,
      bgColor: 'bg-[#FDF3D6]/70 backdrop-blur-md', // Soft Yellow Cream
      iconBg: 'bg-[#1C4D38]/15 text-[#1C4D38]',
    },
    {
      id: 'badge',
      title: 'Badge Didapat',
      value: badgeCount,
      unit: '',
      change: '+1 badge dari minggu lalu',
      icon: Award,
      bgColor: 'bg-[#D6E6C5]/70 backdrop-blur-md', // Soft Sage Green
      iconBg: 'bg-[#1C4D38]/15 text-[#1C4D38]',
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
        Aktivitas Minggu Ini
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {metrics.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-[24px] border border-[#1C4D38]/10 ${item.bgColor} shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-4 min-h-[135px]`}
            >
              {/* Header Card: Icon Circle (Rounded Full) + Value & Title */}
              <div className="flex items-center gap-3.5">
                {/* Circle Icon Container (Lingkaran Sempurna Sesuai Figma) */}
                <div className={`w-12 h-12 rounded-full ${item.iconBg} flex items-center justify-center font-extrabold shrink-0 shadow-xs`}>
                  <IconComp className="w-5 h-5 fill-current" />
                </div>

                {/* Value & Title */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-[26px] font-black text-[#1C4D38] leading-none font-display">
                      {item.value}
                    </span>
                    {item.unit && (
                      <span className="text-xs font-bold text-[#1C4D38] opacity-80">
                        {item.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-[#1C4D38]/70 mt-1 leading-tight">
                    {item.title}
                  </p>
                </div>
              </div>

              {/* Change Badge Pill */}
              <div>
                <span className="inline-block px-3 py-1 bg-white/70 backdrop-blur rounded-full text-[10px] font-extrabold text-[#1C4D38]/90 border border-[#1C4D38]/10 shadow-2xs">
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}