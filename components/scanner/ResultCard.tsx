'use client';

import React, { useState } from 'react';
import { WasteScanResult } from '../../lib/types';
import {
  CheckCircle,
  Coins,
  Zap,
  Leaf,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import categoriesData from '../../lib/data/wasteCategories.json';

interface ResultCardProps {
  result: WasteScanResult;
  onSaveToDashboard: (result: WasteScanResult) => void;
}

export default function ResultCard({ result, onSaveToDashboard }: ResultCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const itemName = result.name || result.itemName || 'Sampah Plastik';
  const categoryName = result.categoryName || result.category || 'Plastik PET';
  const pricePerKg = result.estimatedPricePerKg || 3500;
  const weight = result.estimatedWeightKg || 1;
  const resaleVal = result.totalResaleValue || (pricePerKg * weight);
  const points = result.earnedPoints || result.pointsEarned || 50;
  const co2Saved = result.co2SavedKg || 0.8;
  const sortingTips = result.sortingTips || result.instructions || [];

  const handleSave = () => {
    onSaveToDashboard(result);
    setIsSaved(true);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/40">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Hasil Klasifikasi AI
          </span>
          <h3 className="text-2xl font-black text-white mt-1.5">{itemName}</h3>
          <p className="text-xs text-slate-400">Waktu pemindaian: {result.timestamp || 'Baru saja'}</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/20">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400">Tingkat Kepercayaan AI</div>
            <div className="text-base font-black text-emerald-400">{result.confidence}% Match</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
            AI
          </div>
        </div>
      </div>

      {/* Grid Summary Stats: Category, Resale Math, Points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category Tag */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Kategori Sampah
          </div>
          <div className="text-sm font-extrabold text-emerald-300 truncate">{categoryName}</div>
          <span className="inline-block text-[10px] text-slate-400">Terdaftar di Ekosistem Kampus</span>
        </div>

        {/* Resale Value Math */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-gold-400" /> Estimasi Nilai Jual Kos
          </div>
          <div className="text-lg font-black text-gold-400">
            Rp {resaleVal.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-400">
            {weight} kg × Rp {pricePerKg.toLocaleString('id-ID')}/kg
          </div>
        </div>

        {/* Reward Points */}
        <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 fill-emerald-400" /> Bonus Poin Sirkula
          </div>
          <div className="text-lg font-black text-emerald-300">+{points} Poin</div>
          <div className="text-[10px] text-emerald-400/80">
            +{co2Saved} kg CO2 Terselamatkan
          </div>
        </div>
      </div>

      {/* Step by Step Sorting Instructions */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-emerald-900/40 space-y-3">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="h-4 w-4" /> Tips Pemilahan Praktis untuk Anak Kos:
        </h4>
        <ul className="space-y-2 text-xs text-slate-300">
          {sortingTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-600/40">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button: Save to Dashboard */}
      <button
        onClick={handleSave}
        disabled={isSaved}
        className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl ${
          isSaved
            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-default'
            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-900/50'
        }`}
      >
        {isSaved ? (
          <>
            <Check className="h-5 w-5 stroke-[3]" /> Tersimpan ke Dashboard & Poin Bertambah!
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 fill-slate-950" /> Setor ke Dashboard & Klaim Poin
          </>
        )}
      </button>
    </div>
  );
}
