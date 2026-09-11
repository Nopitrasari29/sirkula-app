'use client';

import React from 'react';
import { ArrowRight, Scan, Trash2, Calendar, Award } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      title: 'Pindai Sampah',
      desc: 'Gunakan AI Scanner untuk mengidentifikasi jenis sampah',
      icon: Scan,
      iconImg: '/assets/icons/icon-scanner.png',
    },
    {
      num: 2,
      title: 'Kelola dengan Benar',
      desc: 'Ikuti panduan untuk memilah dan mengelola sampah',
      icon: Trash2,
      iconImg: '/assets/icons/icon-jejak.png',
    },
    {
      num: 3,
      title: 'Jadwalkan Booking',
      desc: 'Atur jadwal penjemputan sampah',
      icon: Calendar,
      iconImg: '/assets/icons/icon-booking.png',
    },
    {
      num: 4,
      title: 'Dapatkan Poin',
      desc: 'Kumpulkan poin dan tukarkan dengan hadiah, serta berkontribusi untuk bumi',
      icon: Award,
      iconImg: '/assets/icons/icon-edukasi.png',
    },
  ];

  return (
    <section id="cara-kerja" className="relative py-24 bg-transparent overflow-hidden border-b-2 border-[#1C4D38]/25 scroll-mt-24">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C4D38] tracking-tight font-display">
              Cara Kerja SIRKULA
            </h2>
          </div>
        </ScrollReveal>

        {/* 4 Horizontal Process Steps Grid dengan Panah Penghubung Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-8 relative">

          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <ScrollReveal key={step.num} direction="up" delay={idx * 150}>
                <div className="flex flex-col items-center text-center space-y-4 relative group">

                  {/* Lingkaran Utama dengan Ikon + Badge Angka Kecil di Bawah */}
                  <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur border-2 border-[#1C4D38] text-[#1C4D38] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#F5F3E9] transition-all duration-300">
                      <img
                        src={step.iconImg}
                        alt={step.title}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <IconComp className="w-8 h-8 hidden fallback-icon" />
                    </div>

                    {/* Badge Angka Kecil (1, 2, 3, 4) Menempel di Bawah Lingkaran */}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#1C4D38] text-[#D9A74E] font-black text-xs flex items-center justify-center shadow border-2 border-white">
                      {step.num}
                    </span>
                  </div>

                  {/* Panah Penghubung Horizontal Ringkas & Proporsional (Tampil di Desktop antar Step 1-2, 2-3, 3-4) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-10 left-[calc(50%+4.5rem)] w-[calc(100%-9rem)] items-center justify-center pointer-events-none z-0">
                      <div className="w-full h-[2px] bg-[#1C4D38]/30 relative flex items-center justify-end">
                        <ArrowRight className="w-4 h-4 text-[#1C4D38]/60 absolute -right-1 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  )}

                  {/* Step Title & Description */}
                  <div className="space-y-1.5 max-w-xs pt-2">
                    <h3 className="text-lg font-black text-[#1C4D38] font-display">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#1C4D38]/85 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}

        </div>

      </div>
    </section>
  );
}