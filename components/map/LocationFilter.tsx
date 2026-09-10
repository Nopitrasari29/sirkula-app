'use client';

import React from 'react';
import { Filter, Sparkles } from 'lucide-react';
import categoriesData from '../../lib/data/wasteCategories.json';

interface LocationFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function LocationFilter({ selectedCategory, onSelectCategory }: LocationFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-emerald-500/20">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
        <Filter className="h-4 w-4 text-emerald-400" /> Filter Sampah Diterima Pengepul:
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === ''
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Semua Mitra
        </button>

        {categoriesData.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
