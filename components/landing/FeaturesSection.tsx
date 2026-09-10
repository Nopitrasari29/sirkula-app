'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function FeaturesSection() {
  const features = [
    {
      id: 'scanner',
      title: 'AI Scanner',
      desc: 'Pindai sampah, kenali jenisnya, dan dapatkan cara pemilahan serta estimasi harga jualnya.',
      link: '/scanner',
      linkText: 'Coba Sekarang',
      bgColor: 'bg-[#D6E6C5]/90', // Soft Muted Green
      image: '/assets/illustrations/feature-scanner.png',
      imageFallback: '/assets/icons/icon-scanner.png',
    },
    {
      id: 'jejak',
      title: 'Jejak Hijau',
      desc: 'Setiap aksimu dicatat. Kumpulkan poin, raih badge, dan jadi pahlawan lingkungan.',
      link: '/dashboard',
      linkText: 'Lihat Jejak Hijau',
      bgColor: 'bg-[#F9EED3]/90', // Soft Warm Cream
      image: '/assets/illustrations/feature-jejak.png',
      imageFallback: '/assets/icons/icon-jejak.png',
    },
    {
      id: 'booking',
      title: 'Jadwal & Booking',
      desc: 'Atur jadwal penjemputan sampah daur ulang dengan mudah, cepat, dan tepat waktu.',
      link: '/booking',
      linkText: 'Buat Jadwal',
      bgColor: 'bg-[#FDF3D6]/90', // Soft Warm Yellow
      image: '/assets/illustrations/feature-booking.png',
      imageFallback: '/assets/icons/icon-booking.png',
    },
    {
      id: 'edukasi',
      title: 'Edukasi',
      desc: 'Tingkatkan pengetahuanmu tentang isu lingkungan dan dapatkan poin tambahan lewat kuis.',
      link: '/edukasi',
      linkText: 'Mulai Belajar',
      bgColor: 'bg-[#D6E6C5]/90', // Soft Muted Green
      image: '/assets/illustrations/feature-edukasi.png',
      imageFallback: '/assets/icons/icon-edukasi.png',
    },
  ];

  return (
    <section id="fitur" className="relative pt-24 pb-20 bg-transparent overflow-hidden border-b-2 border-[#1C4D38]/25">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-24">
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C4D38] tracking-tight font-display">
              Fitur SIRKULA
            </h2>
            <p className="text-sm sm:text-base text-[#1C4D38]/85 font-medium">
              Solusi lengkap untuk pengelolaan sampah yang lebih mudah dan berkelanjutan
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-20 items-stretch">
          {features.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={(index + 1) * 100}>
              <div
                className={`relative h-full rounded-[32px] pt-20 pb-7 px-6 sm:px-7 border-2 border-[#1C4D38] ${item.bgColor} backdrop-blur-md shadow-[0_8px_25px_rgba(28,77,56,0.08)] hover:shadow-[0_16px_32px_rgba(28,77,56,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group`}
              >
                {/* Gambar Ilustrasi 3D Overlapping / Menumpang di Atas Kartu */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none z-20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-28 sm:h-32 w-auto object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.12)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes(item.imageFallback)) {
                        img.src = item.imageFallback;
                      }
                    }}
                  />
                </div>

                {/* Content Text */}
                <div className="space-y-2 text-left">
                  <h3 className="text-xl font-black text-[#1C4D38] font-display leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#1C4D38]/85 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Action Link */}
                <div className="pt-6">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#1C4D38] hover:text-[#143929] transition group-hover:translate-x-1"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}