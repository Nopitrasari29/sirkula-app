'use client';

import React, { useState } from 'react';
import { FunFact } from '../../lib/types';
import { ChevronLeft, ChevronRight, HelpCircle, Package, Zap, Flame, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

interface FactCardProps {
  facts: FunFact[];
}

export default function FactCard({ facts }: FactCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!facts || facts.length === 0) return null;

  const currentFact = facts[currentIndex] || facts[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? facts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === facts.length - 1 ? 0 : prev + 1));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return Package;
      case 'Zap':
        return Zap;
      case 'Flame':
        return Flame;
      default:
        return HelpCircle;
    }
  };

  const IconComp = getIcon(currentFact?.icon || 'BookOpen');

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> Fun Fact & Infografis Kos #{currentIndex + 1}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          {currentIndex + 1} / {facts.length} Slide
        </div>
      </div>

      {/* Main Slide Card Content */}
      <div className="bg-gradient-to-br from-slate-950 to-emerald-950/40 p-6 sm:p-8 rounded-2xl border border-emerald-500/20 space-y-4 min-h-[220px] flex flex-col justify-between">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shadow-lg">
            <IconComp className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gold-400 uppercase">{currentFact.category}</span>
            <h3 className="text-xl font-black text-white mt-1 leading-snug">{currentFact.title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-medium">{currentFact.content || currentFact.summary}</p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-800 text-xs">
          <span className="font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30 inline-flex items-center gap-1.5 w-fit">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentFact.impactTag || 'Tips Pemilahan Sampah'}</span>
          </span>
          <span className="text-slate-400 text-[11px]">Sumber: {currentFact.source || 'Tim Riset SIRKULA'}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
        >
          <ChevronLeft className="h-4 w-4" /> Sebelumnya
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-1.5">
          {facts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
        >
          Selanjutnya <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
