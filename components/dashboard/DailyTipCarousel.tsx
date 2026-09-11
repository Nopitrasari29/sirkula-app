'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Lightbulb, Recycle, Zap, Leaf } from 'lucide-react';

import factsData from '@/lib/data/facts.json';

function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'Daur Ulang':
      return <Recycle className="w-10 h-10 text-emerald-800" />;
    case 'Bahaya B3':
      return <Zap className="w-10 h-10 text-amber-800" />;
    case 'Sampah Organik':
      return <Leaf className="w-10 h-10 text-emerald-800" />;
    case 'Mitos vs Fakta':
    default:
      return <Lightbulb className="w-10 h-10 text-[#9B6A1B]" />;
  }
}

export default function DailyTipCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const tips = factsData.map((fact) => ({
    id: fact.id,
    title: fact.title,
    desc: fact.content,
    link: '/edukasi',
    iconImg: null as string | null,
    impactTag: fact.impactTag,
    category: fact.category,
  }));

  const currentTip = tips[activeIdx];

  const handlePrev = () => setActiveIdx((prev) => (prev === 0 ? tips.length - 1 : prev - 1));
  const handleNext = () => setActiveIdx((prev) => (prev === tips.length - 1 ? 0 : prev + 1));

  return (
    <div className="flex flex-col h-full space-y-3">
      <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
        Tips Hari Ini
      </h2>

      {/* Outer Container (Soft Warm Yellow) */}
      <div className="flex-1 bg-[#FAF3E5]/70 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs">

        {/* Carousel Row */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Left Arrow (Terracotta Orange) */}
          <button
            onClick={handlePrev}
            className="p-1 text-[#E07A5F] hover:text-[#d4684d] transition shrink-0 active:scale-90 cursor-pointer"
            aria-label="Tips Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Tip Card — Soft Yellow Warm */}
          <div className="flex-1 bg-[#FCE39E]/85 rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">

            {/* Image Box */}
            <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              {currentTip.iconImg && !imgErrors[currentTip.id] ? (
                <img
                  src={currentTip.iconImg}
                  alt={currentTip.title}
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [currentTip.id]: true }))
                  }
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/70 flex items-center justify-center border border-[#1C4D38]/10 shadow-2xs">
                  {getCategoryIcon(currentTip.category)}
                </div>
              )}
            </div>

            {/* Text + CTA Outline Button */}
            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              {currentTip.impactTag && (
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold bg-[#1C4D38]/10 text-[#1C4D38] rounded-full">
                  {currentTip.impactTag}
                </span>
              )}
              <h3 className="text-xs sm:text-sm font-black text-[#1C4D38] font-display leading-tight">
                {currentTip.title}
              </h3>
              <p className="text-[11px] text-[#1C4D38]/85 font-medium leading-relaxed">
                {currentTip.desc}
              </p>

              {/* Outline Style CTA Button Sesuai Figma */}
              <div className="pt-2">
                <Link
                  href={currentTip.link}
                  className="inline-block px-4 py-1.5 bg-transparent hover:bg-white/40 text-[11px] font-bold text-[#E07A5F] rounded-xl border border-[#E07A5F]/70 transition active:scale-95"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </div>

          </div>

          {/* Right Arrow (Terracotta Orange) */}
          <button
            onClick={handleNext}
            className="p-1 text-[#E07A5F] hover:text-[#d4684d] transition shrink-0 active:scale-90 cursor-pointer"
            aria-label="Tips Selanjutnya"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

        </div>

        {/* Circular Pagination Dots */}
        <div className="flex justify-center items-center gap-2 pt-1">
          {tips.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIdx === idx
                  ? 'bg-[#E07A5F] scale-110'
                  : 'bg-[#E07A5F]/35 hover:bg-[#E07A5F]/60'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}