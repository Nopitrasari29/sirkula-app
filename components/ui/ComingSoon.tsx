'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Sparkles, Send, Check } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  category?: string;
  description?: string;
}

export default function ComingSoon({
  title = 'Fitur Ini Segera Hadir!',
  category = 'Fitur Dalam Pengembangan',
  description = 'Tim SIRKULA sedang menyiapkan pengalaman terbaik untuk fitur ini. Kembali ke beranda untuk melihat simulasi & landing page SIRKULA.',
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F4F2E9] flex items-center justify-center px-6 py-20 relative overflow-hidden">

      {/* Watermark Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 -left-10 w-72 h-80 bg-contain bg-no-repeat bg-[url('/assets/illustrations/leaf-bg-pattern.png')]" />
        <div className="absolute bottom-10 -right-10 w-72 h-80 bg-contain bg-no-repeat bg-[url('/assets/illustrations/leaf-bg-pattern.png')]" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">

        {/* Mascot Truck Illustration */}
        <div className="relative w-48 sm:w-56 mx-auto">
          <img
            src="/assets/illustrations/sirkula-truck.png"
            alt="SIRKULA Truck"
            className="w-full h-auto object-contain filter drop-shadow-lg animate-bounce"
            style={{ animationDuration: '3s' }}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.endsWith('.svg')) {
                img.src = '/assets/illustrations/sirkula-truck.svg';
              }
            }}
          />
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C4D38]/10 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold tracking-wide uppercase">
          <Clock className="w-3.5 h-3.5" />
          <span>{category}</span>
        </div>

        {/* Main Heading & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C4D38] font-display tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm text-[#1C4D38]/80 font-medium leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Email Notification Subscription Form */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-[#1C4D38]/15 shadow-md max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#1C4D38]">
            <Sparkles className="w-4 h-4 text-[#D9A74E]" />
            <span>Dapatkan Notifikasi Saat Peluncuran</span>
          </div>

          {subscribed ? (
            <div className="p-3 rounded-xl bg-[#66C699]/20 border border-[#66C699]/40 text-[#1C4D38] text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-[#1C4D38]" />
              <span>Terima kasih! Kami akan mengabari kamu saat rilis.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email kamu..."
                className="flex-1 px-4 py-2.5 text-xs bg-[#F4F2E9] border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/50 focus:outline-none focus:border-[#1C4D38]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1C4D38] hover:bg-[#143B2B] text-[#D9A74E] text-xs font-extrabold rounded-xl transition shadow flex items-center gap-1.5 shrink-0"
              >
                <span>Ingatkan</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Return to Dashboard CTA */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1C4D38] hover:bg-[#143B2B] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
