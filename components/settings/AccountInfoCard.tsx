'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';

interface AccountInfoCardProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  boardingName: string;
  setBoardingName: (val: string) => void;
  kosAddress: string;
  setKosAddress: (val: string) => void;
}

export default function AccountInfoCard({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  boardingName,
  setBoardingName,
  kosAddress,
  setKosAddress,
}: AccountInfoCardProps) {
  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    setLang(getCurrentLanguage());
  }, []);

  const t = translations[lang] || translations.id;

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-5 h-full">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#1C4D38]/10">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-[#1C4D38]/10 shadow-2xs text-[#1C4D38]">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[#1C4D38] font-display">
            {t.settings.accountInfo}
          </h3>
          <p className="text-[11px] text-[#1C4D38]/70 font-semibold">
            {t.settings.accountInfoSub}
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4 pt-1">
        
        {/* Nama Lengkap */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.fullName}
          </label>
          <div className="sm:col-span-8">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
          </div>
        </div>

        {/* Email */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.email}
          </label>
          <div className="sm:col-span-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
          </div>
        </div>

        {/* Nomor HP */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.phone}
          </label>
          <div className="sm:col-span-8">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
          </div>
        </div>

        {/* Nama Kos & No. Kamar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.kosName}
          </label>
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Contoh: Kos Melati Asri, Kamar 14"
              value={boardingName}
              onChange={(e) => setBoardingName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
          </div>
        </div>

        {/* Alamat Lengkap Kos */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.kosAddress}
          </label>
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Contoh: Jl. Keputih Gang 2 No. 15, Sukolilo, Surabaya"
              value={kosAddress}
              onChange={(e) => setKosAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
