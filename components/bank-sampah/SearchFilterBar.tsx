'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedDistance: string;
  setSelectedDistance: (val: string) => void;
  selectedHours: string;
  setSelectedHours: (val: string) => void;
  onReset: () => void;
}

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDistance,
  setSelectedDistance,
  selectedHours,
  setSelectedHours,
  onReset,
}: SearchFilterBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#1C4D38]/10 p-3.5 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">

      {/* Search Input Box */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1C4D38]/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari lokasi, kecamatan, atau nama bank sampah..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
        />
      </div>

      {/* Filter Selects & Reset Button */}
      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">

        {/* Jenis Sampah Select */}
        <div className="flex flex-col text-[10px] font-bold text-gray-500">
          <span>Jenis Sampah</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1C4D38] focus:outline-none"
          >
            <option>Semua</option>
            <option>Plastik</option>
            <option>Kertas</option>
            <option>Logam</option>
            <option>Organik</option>
          </select>
        </div>

        {/* Jarak Select */}
        <div className="flex flex-col text-[10px] font-bold text-gray-500">
          <span>Jarak</span>
          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1C4D38] focus:outline-none"
          >
            <option>Semua Jarak</option>
            <option>&lt; 2 km</option>
            <option>&lt; 5 km</option>
            <option>&lt; 10 km</option>
          </select>
        </div>

        {/* Jam Operasional Select */}
        <div className="flex flex-col text-[10px] font-bold text-gray-500">
          <span>Jam Operasional</span>
          <select
            value={selectedHours}
            onChange={(e) => setSelectedHours(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1C4D38] focus:outline-none"
          >
            <option>Semua</option>
            <option>Buka Sekarang</option>
            <option>Buka Hari Ini</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3.5 py-2 mt-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1C4D38] text-xs font-bold rounded-xl transition shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filter</span>
        </button>

      </div>

    </div>
  );
}
