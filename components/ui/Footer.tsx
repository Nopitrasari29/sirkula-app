'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Check } from 'lucide-react';

export default function Footer() {
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setIsSubmitting(true);

    // Trigger paper plane take-off animation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setSuggestion('');

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSent(false);
      }, 3500);
    }, 700);
  };

  return (
    <footer className="bg-[#1C4D38] text-[#F4F2E9] pt-16 pb-12 border-t-4 border-[#143B2B]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src="/assets/brand/logo-icon.png"
                alt="SIRKULA - Menutup Lingkaran Sampah dari Rumah ke Pengepul"
                className="h-12 w-auto object-contain brightness-0 invert opacity-95 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.endsWith('.svg')) {
                    img.src = '/assets/brand/logo-icon.svg';
                  }
                }}
              />
            </Link>
            <p className="text-[#F4F2E9]/80 text-sm leading-relaxed max-w-sm font-medium">
              SIRKULA adalah platform yang membantu kamu mengelola sampah dengan mudah, menyenangkan, dan berdampak nyata untuk lingkungan.
            </p>
          </div>

          {/* Quick Links Column 1: MENU */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[#F4F2E9] text-sm uppercase tracking-wider font-display">MENU</h4>
            <ul className="space-y-2.5 text-sm text-[#F4F2E9]/80 font-medium">
              <li><Link href="/" className="hover:text-[#D9A74E] transition">Beranda</Link></li>
              <li><Link href="/scanner" className="hover:text-[#D9A74E] transition">AI Scanner</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#D9A74E] transition">Jejak Hijau</Link></li>
              <li><Link href="/edukasi" className="hover:text-[#D9A74E] transition">Edukasi</Link></li>
            </ul>
          </div>

          {/* Quick Links Column 2: FITUR */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[#F4F2E9] text-sm uppercase tracking-wider font-display">FITUR</h4>
            <ul className="space-y-2.5 text-sm text-[#F4F2E9]/80 font-medium">
              <li><Link href="/booking" className="hover:text-[#D9A74E] transition">Jadwal Booking</Link></li>
              <li><Link href="/lokasi" className="hover:text-[#D9A74E] transition">Bank Sampah</Link></li>
              <li><Link href="/edukasi" className="hover:text-[#D9A74E] transition">Notifikasi</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#D9A74E] transition">Poin & Badge</Link></li>
            </ul>
          </div>

          {/* Suggestions Input with Paper Plane Take-Off Animation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-extrabold text-[#F4F2E9] text-sm uppercase tracking-wider font-display">PUNYA SARAN?</h4>
            <p className="text-[#F4F2E9]/80 text-sm font-medium">
              Bantu kami membuat SIRKULA menjadi lebih baik
            </p>
            <form onSubmit={handleSubmit} className="relative mt-2">
              <input
                type="text"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={isSent ? 'Saran terkirim! Terima kasih ❤️' : 'Tulis saran atau masukanmu di...'}
                disabled={isSent}
                className="w-full py-3 pl-4 pr-12 text-sm bg-[#143B2B] border border-[#235841] rounded-xl text-white placeholder-[#F4F2E9]/50 focus:outline-none focus:border-[#D9A74E] disabled:opacity-80"
              />
              <button
                type="submit"
                disabled={isSent || !suggestion.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-300 shadow flex items-center justify-center ${
                  isSent
                    ? 'bg-[#66C699] text-[#1C4D38]'
                    : 'bg-[#E07A5F] hover:bg-[#d4684d] text-white active:scale-95 disabled:opacity-50'
                }`}
                aria-label="Send Suggestion"
              >
                {isSent ? (
                  <Check className="w-4 h-4 text-[#1C4D38] animate-bounce" />
                ) : (
                  <Send className={`w-4 h-4 ${isSubmitting ? 'animate-plane-fly' : ''}`} />
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#235841] text-[#F4F2E9]/60 text-xs text-center sm:text-left font-medium">
          © 2026 SIRKULA. All rights reserved.
        </div>

      </div>
    </footer>
  );
}