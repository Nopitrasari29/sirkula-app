'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { getBookings } from '@/lib/utils/storage';
import { BookingItem } from '@/lib/types';

export default function NextBookingCard() {
  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(null);

  const loadBooking = () => {
    const bookings = getBookings();
    if (bookings && bookings.length > 0) {
      setActiveBooking(bookings[0]);
    } else {
      setActiveBooking(null);
    }
  };

  const parseDateDisplay = (dateStr?: string) => {
    if (!dateStr) return { day: '21', monthYear: 'Ags 2026' };
    // Check if format like "Senin, 21 Juli 2026" or "21 Juli 2026"
    const cleaned = dateStr.replace(/,/g, '');
    const tokens = cleaned.split(/\s+/);
    // Find numeric day (1 or 2 digits)
    const dayToken = tokens.find((t) => /^\d{1,2}$/.test(t));
    // Find month word
    const monthToken = tokens.find((t) => /^(jan|feb|mar|apr|mei|jun|jul|ags|agu|sep|okt|nov|des)/i.test(t));
    // Find 4-digit year
    const yearToken = tokens.find((t) => /^\d{4}$/.test(t));

    if (dayToken && monthToken) {
      return {
        day: dayToken,
        monthYear: `${monthToken.slice(0, 3)} ${yearToken || '2026'}`,
      };
    }

    // ISO format fallback YYYY-MM-DD
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const mIdx = parseInt(parts[1], 10) - 1;
        return {
          day: parts[2] || '21',
          monthYear: `${months[mIdx] || 'Ags'} ${parts[0]}`,
        };
      }
    }

    return { day: '21', monthYear: 'Ags 2026' };
  };

  const dateDisplay = parseDateDisplay(activeBooking?.pickupDate);

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
          Booking Selanjutnya
        </h2>
        {activeBooking && (
          <Link
            href="/booking"
            className="text-[11px] font-bold text-[#1C4D38]/80 hover:underline flex items-center gap-1"
          >
            <span>Detail</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="flex-1 bg-[#D6E6C5]/70 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">

        {activeBooking ? (
          <>
            {/* Left Info Group */}
            <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">

              {/* Date Badge Box */}
              <div className="bg-white/85 backdrop-blur-md rounded-2xl p-3 text-center min-w-[76px] shrink-0 border border-[#1C4D38]/10 shadow-xs">
                <p className="text-[10px] font-bold text-[#1C4D38]/75 uppercase">Jadwal</p>
                <p className="text-2xl font-black text-[#1C4D38] font-display leading-none my-1">
                  {dateDisplay.day}
                </p>
                <p className="text-[10px] font-bold text-[#1C4D38]/75">
                  {dateDisplay.monthYear}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C4D38]/80">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeBooking.pickupTime || '09.30 WIB'}</span>
                </div>

                <h3 className="text-base font-black text-[#1C4D38] font-display leading-tight truncate max-w-[200px] sm:max-w-xs">
                  {activeBooking.userAddress || 'Bank Sampah Terdekat'}
                </h3>

                <p className="text-xs text-[#1C4D38]/80 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {activeBooking.wasteType ? `${activeBooking.wasteType} (${activeBooking.estimatedWeightKg || 2} kg)` : 'Sampah Anorganik'}
                  </span>
                </p>

                <div className="pt-1">
                  <span className="text-[11px] font-extrabold text-[#1C4D38]">
                    {activeBooking.status || 'Dikonfirmasi'} — <span className="text-[#1C4D38]/75 font-semibold">Petugas menuju titik temu</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Right Truck Illustration */}
            <div className="shrink-0 relative z-10 self-end sm:self-center">
              <img
                src="/assets/illustrations/sirkula-truck.png"
                alt="SIRKULA Truck"
                className="h-20 sm:h-24 w-auto object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.endsWith('.svg')) {
                    img.src = '/assets/illustrations/sirkula-truck.svg';
                  }
                }}
              />
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-black text-[#1C4D38]">Belum Ada Booking Aktif</p>
              <p className="text-xs text-[#1C4D38]/75">
                Kumpulkan sampah kosmu dan jadwalkan penjemputan oleh kurir hijau.
              </p>
            </div>
            <Link
              href="/booking"
              className="px-4 py-2 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1 shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Buat Booking</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}