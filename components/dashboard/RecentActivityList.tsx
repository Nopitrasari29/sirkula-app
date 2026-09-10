'use client';

import React, { useState, useEffect } from 'react';
import { Scan, Calendar, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getScanHistory, getBookings, getCompletedEducation } from '@/lib/utils/storage';

export default function RecentActivityList() {
  const [activities, setActivities] = useState<any[]>([]);

  const loadActivities = () => {
    const scans = getScanHistory();
    const bookings = getBookings();
    const completedEdu = getCompletedEducation();

    const merged: any[] = [];

    // Recent Scans
    scans.slice(0, 2).forEach((scan, i) => {
      merged.push({
        id: `scan-${scan.id || i}`,
        title: `Scan ${scan.itemName || scan.name || 'Sampah'}`,
        points: `+${scan.earnedPoints || scan.pointsEarned || 50} poin`,
        day: 'Hari Ini',
        time: scan.timestamp || '10.12 WIB',
        icon: Scan,
      });
    });

    // Recent Bookings
    bookings.slice(0, 2).forEach((book, i) => {
      merged.push({
        id: `book-${book.id || i}`,
        title: `Booking #${book.id}`,
        points: `+${book.totalPoints || 80} poin`,
        day: book.pickupDate ? 'Terjadwal' : 'Kemarin',
        time: book.pickupTime || '09.30 WIB',
        icon: Calendar,
      });
    });

    // Completed Education
    if (completedEdu.length > 0) {
      merged.push({
        id: 'edu-recent',
        title: 'Materi edukasi diselesaikan',
        points: '+20 poin',
        day: 'Kemarin',
        time: '20.45 WIB',
        icon: GraduationCap,
      });
    }

    // Default fallback if brand new
    if (merged.length === 0) {
      merged.push(
        {
          id: 'act-1',
          title: 'Scan Botol Plastik 1,2 kg',
          points: '+20 poin',
          day: 'Hari Ini',
          time: '10.12 WIB',
          icon: Scan,
        },
        {
          id: 'act-2',
          title: 'Booking penjemputan berhasil',
          points: '+80 poin',
          day: 'Kemarin',
          time: '08.00 WIB',
          icon: Calendar,
        },
        {
          id: 'act-3',
          title: 'Menyelesaikan kuis "Sampah Organik"',
          points: '+20 poin',
          day: '2 Hari Lalu',
          time: '20.45 WIB',
          icon: GraduationCap,
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
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
          Aktivitas Terbaru
        </h2>
        <Link
          href="/jejak-hijau/aktivitas"
          className="text-[11px] font-bold text-[#1C4D38]/80 hover:underline flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Satu Wadah Kartu Krem Utama (Sesuai Figma 100%) */}
      <div className="flex-1 bg-[#F9EED3]/65 backdrop-blur-md border border-[#1C4D38]/12 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between shadow-xs">
        <div className="divide-y divide-[#1C4D38]/12">
          {activities.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4 text-xs"
              >
                {/* Left: Icon + Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#1C4D38]/10 text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10">
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-extrabold text-[#1C4D38] truncate">
                    {item.title}
                  </span>
                </div>

                {/* Right: Points + Time */}
                <div className="flex items-center gap-6 shrink-0 text-right">
                  {item.points ? (
                    <span className="font-black text-[#1C4D38] text-xs">
                      {item.points}
                    </span>
                  ) : (
                    <span className="w-12" /> // Empty placeholder for alignment
                  )}

                  <div className="text-[10px] text-[#1C4D38]/70 font-semibold leading-tight text-right min-w-[65px]">
                    <p>{item.day}</p>
                    <p>{item.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}