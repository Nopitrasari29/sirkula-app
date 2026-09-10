'use client';

import React, { useState } from 'react';
import { Bell, Check, Sparkles, Send, ShieldAlert, Clock } from 'lucide-react';

export default function NotifBanner() {
  const [scheduledNotif, setScheduledNotif] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState('Setiap Sabtu Sore (Jam 16.00)');

  const handleToggleSchedule = () => {
    setScheduledNotif(!scheduledNotif);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/40">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
            Sistem Notifikasi Pintar Kos
          </span>
          <h3 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-400" /> Reminder Harian & Pengingat Penjemputan
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <Clock className="h-4 w-4" /> Otomatisasi Simulasi
        </div>
      </div>

      <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-white">Pengingat Jadwal Jemput Kos</h4>
            <p className="text-xs text-slate-400 mt-1">
              Kirimkan pengingat notifikasi otomatis ke HP sebelum penjemputan bank sampah tiba.
            </p>
          </div>

          <button
            onClick={handleToggleSchedule}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              scheduledNotif
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
            }`}
          >
            {scheduledNotif ? <Check className="h-4 w-4 stroke-[3]" /> : <Bell className="h-4 w-4" />}
            {scheduledNotif ? 'Aktif (Pengingat Set)' : 'Aktifkan Reminder'}
          </button>
        </div>

        {scheduledNotif && (
          <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 font-medium">Pilih Waktu Pengingat:</span>
            <select
              value={selectedFreq}
              onChange={(e) => setSelectedFreq(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
            >
              <option value="Setiap Sabtu Sore (Jam 16.00)">Setiap Sabtu Sore (Jam 16.00 - Bebas Kuliah)</option>
              <option value="Setiap Rabu Pagi (Jam 08.00)">Setiap Rabu Pagi (Jam 08.00 - Sebelum Kelas)</option>
              <option value="Setiap Akhir Bulan">Setiap Akhir Bulan (Bersih-Bersih Kos Total)</option>
            </select>
          </div>
        )}
      </div>

      {/* Simulated Live Toast Preview */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/40 flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-emerald-400">Pratinjau Banner Notifikasi:</span>
          <h5 className="text-xs font-bold text-white">&quot;Halo Budi! Kardus kosmu sudah menumpuk?&quot;</h5>
          <p className="text-[11px] text-slate-300">
            Pengepul Pak Budi berada 0.8 km dari Wisma Ganesha 3. Booking jemputan sekarang & dapatkan +50 Poin!
          </p>
        </div>
      </div>
    </div>
  );
}
