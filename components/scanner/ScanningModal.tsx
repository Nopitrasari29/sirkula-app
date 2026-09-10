'use client';

import React, { useEffect, useState } from 'react';
import {
  Check,
  Loader2,
  Lightbulb,
  Image as ImageIcon,
  Package,
  Leaf,
  DollarSign,
  Clock,
} from 'lucide-react';

interface ScanningModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function ScanningModal({ isOpen, onComplete }: ScanningModalProps) {
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }

        const next = prev + 25;
        if (next >= 75) setCurrentStepIndex(3);
        else if (next >= 50) setCurrentStepIndex(2);
        else if (next >= 25) setCurrentStepIndex(1);

        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const steps = [
    { label: 'Memproses gambar', icon: ImageIcon, done: progress >= 25 },
    { label: 'Mengenali objek', icon: Package, done: progress >= 50 },
    { label: 'Mengidentifikasi kategori', icon: Leaf, done: progress >= 75 },
    { label: 'Menghitung estimasi harga', icon: DollarSign, done: progress >= 100 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Box (Identik 100% dengan Figma Screenshot) */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden text-[#1C4D38] font-sans">
        
        {/* Top Mascot Truck Illustration with Magnifying Glass */}
        <div className="flex justify-center pt-1">
          <div className="relative">
            <img
              src="/assets/illustrations/scanner-truck-magnifier.png"
              alt="SIRKULA Truck Scanning"
              className="h-32 sm:h-36 w-auto object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/assets/illustrations/sirkula-truck.png';
              }}
            />
          </div>
        </div>

        {/* Text Title & Subtitle */}
        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-[#1C4D38] font-display tracking-tight">
            AI sedang menganalisis sampahmu...
          </h3>
          <p className="text-xs text-[#1C4D38]/75 font-medium">
            Mohon tunggu sebentar, ya!
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#1C4D38]/10 h-3 rounded-full overflow-hidden p-0.5 border border-[#1C4D38]/10">
            <div
              className="bg-[#1C4D38] h-full rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-[11px] font-black text-[#1C4D38]">
            {progress}%
          </div>
        </div>

        {/* Checklist Step Container (Presisi Figma 100% dengan Ikon Spesifik Per Baris) */}
        <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-2xl px-4 py-1 divide-y divide-[#1C4D38]/10 shadow-2xs">
          {steps.map((step, idx) => {
            const IconC = step.icon;
            return (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-bold text-[#1C4D38]">
                {/* Left Side: Specific Row Icon + Step Label */}
                <div className="flex items-center gap-3">
                  <IconC className="w-4.5 h-4.5 text-[#1C4D38]/80 stroke-[2] shrink-0" />
                  <span className={step.done ? 'text-[#1C4D38]' : 'text-[#1C4D38]/70'}>
                    {step.label}
                  </span>
                </div>

                {/* Right Side: Status Indicator (Checkmark / Spinner / Clock) */}
                {step.done ? (
                  <Check className="w-4.5 h-4.5 text-[#1C4D38] stroke-[3] shrink-0" />
                ) : idx === currentStepIndex ? (
                  <Loader2 className="w-4 h-4 text-[#E07A5F] animate-spin shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-[#1C4D38]/30 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Mint Tip Pill (Presisi Warna Mint Figma) */}
        <div className="bg-[#CBE5D8] border border-[#1C4D38]/15 rounded-xl p-3 text-xs font-bold text-[#1C4D38] flex items-center gap-2 justify-center shadow-2xs">
          <Lightbulb className="w-4 h-4 shrink-0 text-[#1C4D38]" />
          <span>Proses ini biasanya hanya memerlukan beberapa detik</span>
        </div>

      </div>

    </div>
  );
}
