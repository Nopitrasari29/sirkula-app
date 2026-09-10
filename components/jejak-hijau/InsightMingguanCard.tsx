'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function InsightMingguanCard() {
  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-4 h-full flex flex-col justify-between">
      
      {/* Title */}
      <h3 className="text-sm font-black text-[#1C4D38] font-display">
        Insight Mingguan
      </h3>

      {/* Main Banner Box (Sesuai Presisi Figma 100%) */}
      <div className="bg-[#C6E2B3] border border-[#1C4D38]/15 rounded-[22px] p-5 flex flex-col justify-between gap-4 shadow-2xs">
        
        {/* Top: Circular Recycle Symbol Icon + Insight Text */}
        <div className="flex items-center gap-4">
          
          {/* Circular Recycle Icon Badge */}
          <div className="w-14 h-14 rounded-full bg-[#A3D9B1] border border-[#1C4D38]/20 flex items-center justify-center shrink-0 shadow-2xs p-3">
            <img
              src="/assets/icons/icon-recycle-symbol.png"
              alt="Insight Recycle Symbol"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-black text-[#1C4D38] font-display leading-snug">
              Sampah plastik adalah jenis yang paling sering kamu setorkan
            </h4>
            <p className="text-[11px] text-[#1C4D38]/80 font-semibold leading-relaxed italic">
              Coba tingkatkan setoran sampah organik minggu ini!
            </p>
          </div>

        </div>

        {/* Bottom Action Button */}
        <div className="flex justify-end pt-1">
          <Link
            href="/edukasi"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 shrink-0"
          >
            <span>Lihat Tips & Edukasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
