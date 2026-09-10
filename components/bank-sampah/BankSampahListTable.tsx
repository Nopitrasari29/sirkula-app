'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

export interface BankSampahItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  timeEstimate: string;
  days: string;
  hours: string;
  rating: number;
  reviews: number;
  acceptedTypes: Array<{ name: string; color: string }>;
  description: string;
  lat?: number;
  lng?: number;
}

interface BankSampahListTableProps {
  bankSampahData: BankSampahItem[];
  selectedBank: BankSampahItem;
  onSelectBank: (item: BankSampahItem) => void;
  onOpenDetailModal?: (item: BankSampahItem) => void;
}

export default function BankSampahListTable({
  bankSampahData,
  selectedBank,
  onSelectBank,
  onOpenDetailModal,
}: BankSampahListTableProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    if (visibleCount >= bankSampahData.length) {
      setVisibleCount(3); // Reset if all items are already visible
    } else {
      setVisibleCount((prev) => Math.min(prev + 3, bankSampahData.length));
    }
  };

  const handleSelect = (item: BankSampahItem) => {
    onSelectBank(item);
    if (onOpenDetailModal) {
      onOpenDetailModal(item);
    }
    const detailEl = document.getElementById('bank-sampah-detail');
    if (detailEl && window.innerWidth < 1024) {
      detailEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const visibleData = bankSampahData.slice(0, visibleCount);
  const isAllLoaded = visibleCount >= bankSampahData.length;

  return (
    <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
          Daftar Bank Sampah Terdekat
        </h2>
        <span className="text-[11px] font-bold text-[#1C4D38]/60">
          Menampilkan {visibleData.length} dari {bankSampahData.length} lokasi
        </span>
      </div>

      {/* Column Headers (Hide on mobile, show on sm+) */}
      <div className="hidden sm:grid grid-cols-12 text-[11px] font-extrabold text-[#1C4D38]/60 px-3 pb-2 border-b border-[#1C4D38]/10">
        <div className="col-span-5">Lokasi</div>
        <div className="col-span-2 text-center">Jarak</div>
        <div className="col-span-3 text-center">Jam Operasional</div>
        <div className="col-span-2 text-right">Rating</div>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {visibleData.map((item) => {
          const isSelected = selectedBank.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer grid grid-cols-1 sm:grid-cols-12 items-center gap-3 sm:gap-2 ${isSelected
                  ? 'bg-white border-2 border-[#1C4D38] shadow-md ring-2 ring-[#1C4D38]/10'
                  : 'bg-white/80 hover:bg-white border border-[#1C4D38]/10 shadow-2xs'
                }`}
            >
              {/* Left: Building Icon + Name */}
              <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                  <img
                    src="/assets/illustrations/bank-sampah-icon.png"
                    alt="Bank Sampah"
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-[#1C4D38] truncate font-display">
                    {item.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-[#1C4D38]/70 truncate font-semibold">
                    {item.address}
                  </p>
                </div>
              </div>

              {/* Distance */}
              <div className="sm:col-span-2 text-left sm:text-center flex sm:flex-col justify-between sm:justify-center items-center sm:items-center">
                <span className="text-[11px] text-[#1C4D38]/60 font-bold sm:hidden">Jarak:</span>
                <div>
                  <p className="text-xs font-black text-[#1C4D38]">{item.distance}</p>
                  <p className="text-[9px] text-[#1C4D38]/65 font-bold">{item.timeEstimate}</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="sm:col-span-3 text-left sm:text-center flex sm:flex-col justify-between sm:justify-center items-center sm:items-center">
                <span className="text-[11px] text-[#1C4D38]/60 font-bold sm:hidden">Jam Operasional:</span>
                <div>
                  <p className="text-[11px] font-bold text-[#1C4D38]">{item.days}</p>
                  <p className="text-[10px] text-[#1C4D38]/75 font-semibold">{item.hours}</p>
                </div>
              </div>

              {/* Rating & CTA Button (Terracotta Orange #E07A5F) */}
              <div className="sm:col-span-2 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2">
                <div className="flex items-center gap-1 text-xs font-black text-[#1C4D38]">
                  <Star className="w-3.5 h-3.5 fill-[#D9A74E] text-[#D9A74E]" />
                  <span>{item.rating}</span>
                  <span className="text-[9px] text-[#1C4D38]/60 font-bold">({item.reviews})</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                  className="px-3.5 py-1.5 bg-[#E07A5F] hover:bg-[#c8664b] text-white text-[10px] font-extrabold rounded-xl transition shadow-xs active:scale-95 shrink-0 cursor-pointer"
                >
                  Lihat Detail
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Centered "Muat Lebih Banyak" Button (Interaktif Load More) */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleLoadMore}
          className="px-6 py-2 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold rounded-full transition shadow-2xs active:scale-95 cursor-pointer"
        >
          {isAllLoaded ? 'Sembunyikan Sebagian' : 'Muat Lebih Banyak'}
        </button>
      </div>

    </div>
  );
}