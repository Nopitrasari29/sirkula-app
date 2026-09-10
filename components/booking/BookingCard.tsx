'use client';

import React from 'react';
import { BookingRequest } from '../../lib/types';
import BookingStatusTimeline from './BookingStatusTimeline';
import { Clock, MapPin, Phone } from 'lucide-react';

interface BookingCardProps {
  booking: BookingRequest;
  onAdvanceStatus: (bookingId: string) => void;
}

export default function BookingCard({ booking, onAdvanceStatus }: BookingCardProps) {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-900/40">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
            ID Booking: {booking.id}
          </span>
          <h3 className="text-xl font-black text-white mt-1.5">{booking.locationName}</h3>
          <p className="text-xs text-slate-400">Dibuat pada: {booking.createdAt}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-3.5 py-1.5 rounded-xl border border-emerald-500/40">
            Status: {booking.status}
          </span>
          {booking.status !== 'Selesai' && (
            <button
              onClick={() => onAdvanceStatus(booking.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 transition-colors"
              title="Simulasi Lanjut Status"
            >
              Simulasi Lanjut ➔
            </button>
          )}
        </div>
      </div>

      {/* Timeline Status Component */}
      <BookingStatusTimeline status={booking.status} />

      {/* Detail Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-bold">
            <Clock className="h-3.5 w-3.5 text-emerald-400" /> Jadwal & Jam
          </div>
          <div className="text-white font-extrabold">{booking.pickupDate}</div>
          <div className="text-emerald-400 font-semibold">{booking.pickupTimeSlot}</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-bold">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" /> Lokasi Penjemputan
          </div>
          <div className="text-white font-semibold leading-relaxed truncate">{booking.addressDetail}</div>
          <div className="text-slate-400 text-[11px]">Estimasi: {booking.estimatedWeightKg} kg</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center gap-1 font-bold">
            <Phone className="h-3.5 w-3.5 text-emerald-400" /> Kontak Kurir Penjemput
          </div>
          <div className="text-white font-extrabold">{booking.courierName}</div>
          <div className="text-gold-400 font-bold">{booking.courierPhone}</div>
        </div>
      </div>
    </div>
  );
}
