'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Scan, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { getScanHistory, getBookings, getCompletedEducation } from '@/lib/utils/storage';

export default function AktivitasTerbaruCard() {
  const [activities, setActivities] = useState<any[]>([]);

  const loadActivities = () => {
    const scans = getScanHistory();
    const bookings = getBookings();
    const completedEdu = getCompletedEducation();

    const merged: any[] = [];

    scans.slice(0, 2).forEach((scan, idx) => {
      merged.push({
        id: `scan-${scan.id || idx}`,
        icon: Scan,
        title: `Scan ${scan.itemName || scan.name || 'Sampah'}`,
        points: `+${scan.earnedPoints || scan.pointsEarned || 50} poin`,
        time: scan.timestamp || 'Hari Ini',
        iconBg: 'bg-[#D6E6C5] text-[#1C4D38]',
      });
    });

    bookings.slice(0, 2).forEach((book, idx) => {
      merged.push({
        id: `book-${book.id || idx}`,
        icon: Calendar,
        title: `Booking #${book.id}`,
        points: `+${book.totalPoints || 80} poin`,
        time: book.pickupTime || '09.30 WIB',
        iconBg: 'bg-amber-100 text-amber-700',
      });
    });

    if (completedEdu.length > 0) {
      merged.push({
        id: 'edu-act',
        icon: GraduationCap,
        title: 'Menyelesaikan modul edukasi',
        points: '+20 poin',
        time: 'Kemarin',
        iconBg: 'bg-[#CBE0BA] text-[#1C4D38]',
      });
    }

    if (merged.length === 0) {
      merged.push(
        {
          id: 'a-1',
          icon: Scan,
          title: 'Scan Botol Plastik 1,2 kg',
          points: '+20 poin',
          time: 'Hari Ini 10:12 WIB',
          iconBg: 'bg-[#D6E6C5] text-[#1C4D38]',
        },
        {
          id: 'a-2',
          icon: Calendar,
          title: 'Booking penjemputan berhasil',
          points: '+80 poin',
          time: 'Kemarin 08:00 WIB',
          iconBg: 'bg-amber-100 text-amber-700',
        },
        {
          id: 'a-3',
          icon: BookOpen,
          title: 'Menyelesaikan kuis "Sampah Organik"',
          points: '+20 poin',
          time: '2 Hari Lalu 20:45 WIB',
          iconBg: 'bg-[#CBE0BA] text-[#1C4D38]',
        }
      );
    }

    setActivities(merged.slice(0, 3));
  };

  useEffect(() => {
    loadActivities();
    window.addEventListener('storage', loadActivities);
    return () => window.removeEventListener('storage', loadActivities);
  }, []);

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#1C4D38] font-display">
          Aktivitas Terbaru
        </h3>
        <Link
          href="/jejak-hijau/aktivitas"
          className="flex items-center gap-0.5 text-xs font-extrabold text-[#1C4D38] hover:underline"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Activity Items List */}
      <div className="space-y-3">
        {activities.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-white/80 border border-[#1C4D38]/10 shadow-2xs flex items-center justify-between gap-3 hover:bg-white transition"
            >
              {/* Left: Icon + Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 border border-[#1C4D38]/10`}>
                  <IconComp className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-extrabold text-[#1C4D38] truncate font-display">
                  {item.title}
                </h4>
              </div>

              {/* Right: Points + Time */}
              <div className="flex items-center gap-4 shrink-0 text-right">
                {item.points && (
                  <span className="text-xs font-black text-[#1C4D38]">
                    {item.points}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-gray-500">
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
