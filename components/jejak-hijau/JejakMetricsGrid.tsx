'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Star, Leaf, Award } from 'lucide-react';
import { getUserProfile } from '@/lib/utils/storage';

interface MetricItem {
  id: string;
  icon: React.ElementType;
  value: string;
  unit?: string;
  label: string;
  tag: string;
  iconBg: string;
  iconColor: string;
}

export default function JejakMetricsGrid() {
  const [recycledKg, setRecycledKg] = useState<string>('18,6');
  const [points, setPoints] = useState<string>('860');
  const [setoranCount, setSetoranCount] = useState<string>('12');
  const [badgeCount, setBadgeCount] = useState<string>('7');

  const updateMetrics = () => {
    const user = getUserProfile();
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

  const metrics: MetricItem[] = [
    {
      id: 'sampah',
      icon: Trash2,
      value: recycledKg,
      unit: 'kg',
      label: 'Sampah Terkumpul',
      tag: 'Sejak Bergabung',
      iconBg: 'bg-[#D6E6C5]',
      iconColor: 'text-[#1C4D38]',
    },
    {
      id: 'poin',
      icon: Star,
      value: points,
      label: 'Total Poin',
      tag: 'Sejak Bergabung',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
    },
    {
      id: 'setoran',
      icon: Leaf,
      value: setoranCount,
      label: 'Total Setoran',
      tag: 'Sejak Bergabung',
      iconBg: 'bg-amber-200/80',
      iconColor: 'text-[#1C4D38]',
    },
    {
      id: 'badge',
      icon: Award,
      value: badgeCount,
      label: 'Badge Didapat',
      tag: 'Sejak Bergabung',
      iconBg: 'bg-[#CBE0BA]',
      iconColor: 'text-[#1C4D38]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const IconComp = item.icon;
        return (
          <div
            key={item.id}
            className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[24px] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200"
          >
            {/* Top Row: Icon + Value & Label */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 border border-[#1C4D38]/10 shadow-2xs`}>
                <IconComp className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#1C4D38] font-display tracking-tight">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-xs font-extrabold text-[#1C4D38]/80">
                      {item.unit}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#1C4D38]/75 font-bold">
                  {item.label}
                </p>
              </div>
            </div>

            {/* Bottom Tag Pill */}
            <div>
              <span className="inline-block px-3 py-1 bg-white/80 border border-[#1C4D38]/10 rounded-full text-[10px] font-extrabold text-[#1C4D38]/70 shadow-2xs">
                {item.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
