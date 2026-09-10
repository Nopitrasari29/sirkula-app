'use client';

import React from 'react';
import { BookingRequest } from '../../lib/types';

interface BookingStatusTimelineProps {
  status: BookingRequest['status'];
}

export default function BookingStatusTimeline({ status }: BookingStatusTimelineProps) {
  const steps = [
    { label: '1. Menunggu', key: 'Menunggu' },
    { label: '2. Dalam Jalan', key: 'Dijemput' },
    { label: '3. Tiba di Kos', key: 'Tiba' },
    { label: '4. Selesai & Poin', key: 'Selesai' },
  ];

  return (
    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
      <div className="text-xs font-bold text-slate-400">Pelacak Progres Kurir:</div>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div
          className={`p-2 rounded-xl border font-bold ${
            status === 'Menunggu' || status === 'Dijemput' || status === 'Selesai'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          1. Menunggu
        </div>
        <div
          className={`p-2 rounded-xl border font-bold ${
            status === 'Dijemput' || status === 'Selesai'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          2. Dalam Jalan
        </div>
        <div
          className={`p-2 rounded-xl border font-bold ${
            status === 'Selesai'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          3. Tiba di Kos
        </div>
        <div
          className={`p-2 rounded-xl border font-bold ${
            status === 'Selesai'
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-emerald-400 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
        >
          4. Selesai & Poin
        </div>
      </div>
    </div>
  );
}
