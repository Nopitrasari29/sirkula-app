'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, Save, Bell } from 'lucide-react';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';

interface WebsitePreferencesCardProps {
  language: string;
  setLanguage: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  notifPickup: boolean;
  setNotifPickup: (val: boolean) => void;
  notifPoints: boolean;
  setNotifPoints: (val: boolean) => void;
  notifTips: boolean;
  setNotifTips: (val: boolean) => void;
  onReset: () => void;
  onSave: () => void;
}

export default function WebsitePreferencesCard({
  language,
  setLanguage,
  location,
  setLocation,
  notifPickup,
  setNotifPickup,
  notifPoints,
  setNotifPoints,
  notifTips,
  setNotifTips,
  onReset,
  onSave,
}: WebsitePreferencesCardProps) {
  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    setLang(getCurrentLanguage());
  }, [language]);

  const t = translations[lang] || translations.id;

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#1C4D38]/10">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-[#1C4D38]/10 shadow-2xs text-[#1C4D38]">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[#1C4D38] font-display">
            {t.settings.preferences}
          </h3>
          <p className="text-[11px] text-[#1C4D38]/70 font-semibold">
            {t.settings.preferencesSub}
          </p>
        </div>
      </div>

      {/* Select Controls */}
      <div className="space-y-4">
        
        {/* Bahasa */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <div className="sm:col-span-6 space-y-0.5">
            <label className="text-xs font-extrabold text-[#1C4D38] block">
              {t.settings.language}
            </label>
            <p className="text-[10px] text-[#1C4D38]/70 font-semibold">
              {t.settings.languageSub}
            </p>
          </div>
          <div className="sm:col-span-6">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-extrabold text-[#1C4D38] focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English (US)</option>
            </select>
          </div>
        </div>

        {/* Lokasi Default */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4 pt-1">
          <div className="sm:col-span-6 space-y-0.5">
            <label className="text-xs font-extrabold text-[#1C4D38] block">
              {t.settings.location}
            </label>
            <p className="text-[10px] text-[#1C4D38]/70 font-semibold leading-tight">
              {t.settings.locationSub}
            </p>
          </div>
          <div className="sm:col-span-6">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-extrabold text-[#1C4D38] focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            >
              {location && !['Sukolilo, Surabaya', 'Keputih, Surabaya', 'Mulyorejo, Surabaya', 'Gubeng, Surabaya'].includes(location) && (
                <option value={location}>📍 {location} (Lokasi Terdeteksi)</option>
              )}
              <option value="Sukolilo, Surabaya">Sukolilo, Surabaya</option>
              <option value="Keputih, Surabaya">Keputih, Surabaya</option>
              <option value="Mulyorejo, Surabaya">Mulyorejo, Surabaya</option>
              <option value="Gubeng, Surabaya">Gubeng, Surabaya</option>
            </select>
          </div>
        </div>

      </div>

      {/* Sub-Section: Preferensi Notifikasi Pintar */}
      <div className="pt-4 border-t border-[#1C4D38]/10 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1C4D38]" />
          <h4 className="text-xs font-black text-[#1C4D38] font-display">
            {t.settings.notificationsPref}
          </h4>
        </div>

        <div className="space-y-3">
          {/* Toggle 1: Pengingat Jemput Sampah */}
          <div className="flex items-center justify-between p-3 bg-white/80 rounded-2xl border border-gray-200">
            <div>
              <p className="text-xs font-bold text-[#1C4D38]">{t.settings.notifPickup}</p>
              <p className="text-[10px] text-[#1C4D38]/70">Pemberitahuan armada kurir tiba sebelum jadwal penjemputan</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifPickup(!notifPickup)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifPickup ? 'bg-[#1C4D38]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  notifPickup ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Poin & Reward */}
          <div className="flex items-center justify-between p-3 bg-white/80 rounded-2xl border border-gray-200">
            <div>
              <p className="text-xs font-bold text-[#1C4D38]">{t.settings.notifPoints}</p>
              <p className="text-[10px] text-[#1C4D38]/70">Update saldo poin dan promo penukaran e-wallet</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifPoints(!notifPoints)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifPoints ? 'bg-[#1C4D38]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  notifPoints ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Tips Mingguan */}
          <div className="flex items-center justify-between p-3 bg-white/80 rounded-2xl border border-gray-200">
            <div>
              <p className="text-xs font-bold text-[#1C4D38]">{t.settings.notifTips}</p>
              <p className="text-[10px] text-[#1C4D38]/70">Tips praktis hidup minim sampah ramah kantong mahasiswa</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifTips(!notifTips)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                notifTips ? 'bg-[#1C4D38]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  notifTips ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Right Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C4D38]/10">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold rounded-xl transition shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.settings.reset}</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{t.settings.save}</span>
        </button>
      </div>

    </div>
  );
}
