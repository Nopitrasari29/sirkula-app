'use client';

import React from 'react';
import Link from 'next/link';
import { Truck } from 'lucide-react';

export default function EmptyBookingState() {
  return (
    <div className="glass-card rounded-3xl p-12 text-center space-y-4">
      <Truck className="h-12 w-12 text-slate-500 mx-auto" />
      <h3 className="text-lg font-bold text-white">Belum Ada Permintaan Penjemputan</h3>
      <p className="text-xs text-slate-400">
        Pilih bank sampah mitra di sekitar kampus untuk membuat jadwal jemput sampah kos.
      </p>
      <Link
        href="/lokasi"
        className="inline-block px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
      >
        Buka Peta Pengepul
      </Link>
    </div>
  );
}
