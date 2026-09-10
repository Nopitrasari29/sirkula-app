'use client';

import Link from 'next/link';
import { ArrowRight, Scan, Award, Calendar, GraduationCap } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function HeroSection() {
  return (
    <section id="beranda" className="relative pt-6 pb-16 bg-transparent overflow-hidden border-b-2 border-[#1C4D38]/25">

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Main Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">

          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal direction="up" delay={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#1C4D38] leading-[1.15] tracking-tight font-display">
                Menutup Lingkaran Sampah <br />
                dari Rumah ke Pengepul
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <p className="text-sm sm:text-base text-[#1C4D38]/85 max-w-xl font-medium leading-relaxed">
                SIRKULA membantu kamu memilah, mengelola, dan mendaur ulang sampah dengan cara yang mudah, menyenangkan, dan berdampak nyata.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="pt-2">
                <Link
                  href="/scanner"
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#1C4D38] hover:bg-[#143B2B] text-white font-extrabold text-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group"
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Truck Mascot Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ScrollReveal direction="zoom" delay={150}>
              <div className="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
                <img
                  src="/assets/illustrations/sirkula-truck.png"
                  alt="SIRKULA Waste Collection Truck"
                  className="w-full h-auto object-contain max-h-80 sm:max-h-96 filter drop-shadow-md hover:scale-[1.02] transition-transform duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (!img.src.endsWith('.svg')) {
                      img.src = '/assets/illustrations/sirkula-truck.svg';
                    }
                  }}
                />
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* 4 Quick Feature Pills Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Pill 1: AI Scanner */}
          <ScrollReveal direction="up" delay={100}>
            <Link
              href="/scanner"
              className="flex items-center gap-3.5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#1C4D38] shadow-[0_6px_20px_rgba(28,77,56,0.08)] hover:shadow-[0_12px_28px_rgba(28,77,56,0.18)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl border border-[#1C4D38]/30 bg-[#F5F3E9] flex items-center justify-center shrink-0 text-[#1C4D38] group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/icons/icon-scanner.png"
                  alt="AI Scanner"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Scan className="w-6 h-6 hidden fallback-icon" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C4D38] text-sm leading-tight font-display">AI Scanner</h4>
                <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-snug mt-0.5">
                  Kenali jenis sampah dengan mudah
                </p>
              </div>
            </Link>
          </ScrollReveal>

          {/* Pill 2: Jejak Hijau */}
          <ScrollReveal direction="up" delay={200}>
            <Link
              href="/dashboard"
              className="flex items-center gap-3.5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#1C4D38] shadow-[0_6px_20px_rgba(28,77,56,0.08)] hover:shadow-[0_12px_28px_rgba(28,77,56,0.18)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl border border-[#1C4D38]/30 bg-[#F5F3E9] flex items-center justify-center shrink-0 text-[#1C4D38] group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/icons/icon-jejak.png"
                  alt="Jejak Hijau"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Award className="w-6 h-6 hidden fallback-icon" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C4D38] text-sm leading-tight font-display">Jejak Hijau</h4>
                <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-snug mt-0.5">
                  Kumpulkan poin dan capai badge-mu
                </p>
              </div>
            </Link>
          </ScrollReveal>

          {/* Pill 3: Jadwal & Booking */}
          <ScrollReveal direction="up" delay={300}>
            <Link
              href="/lokasi"
              className="flex items-center gap-3.5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#1C4D38] shadow-[0_6px_20px_rgba(28,77,56,0.08)] hover:shadow-[0_12px_28px_rgba(28,77,56,0.18)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl border border-[#1C4D38]/30 bg-[#F5F3E9] flex items-center justify-center shrink-0 text-[#1C4D38] group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/icons/icon-booking.png"
                  alt="Jadwal & Booking"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Calendar className="w-6 h-6 hidden fallback-icon" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C4D38] text-sm leading-tight font-display">Jadwal & Booking</h4>
                <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-snug mt-0.5">
                  Jadwalkan penjemputan sampah
                </p>
              </div>
            </Link>
          </ScrollReveal>

          {/* Pill 4: Edukasi */}
          <ScrollReveal direction="up" delay={400}>
            <Link
              href="/edukasi"
              className="flex items-center gap-3.5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#1C4D38] shadow-[0_6px_20px_rgba(28,77,56,0.08)] hover:shadow-[0_12px_28px_rgba(28,77,56,0.18)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl border border-[#1C4D38]/30 bg-[#F5F3E9] flex items-center justify-center shrink-0 text-[#1C4D38] group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/assets/icons/icon-edukasi.png"
                  alt="Edukasi"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <GraduationCap className="w-6 h-6 hidden fallback-icon" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#1C4D38] text-sm leading-tight font-display">Edukasi</h4>
                <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-snug mt-0.5">
                  Belajar dan uji pengetahuanmu
                </p>
              </div>
            </Link>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}