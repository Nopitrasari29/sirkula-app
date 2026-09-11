'use client';

import React from 'react';
import { Star } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';

export default function TestimonialsSection() {
  // Row 1 Testimonials (Scrolls Left)
  const row1 = [
    {
      id: 't1',
      name: 'Rani Anggraini',
      role: 'Mahasiswi Kos UI Depok',
      campus: 'Universitas Indonesia',
      avatarColor: 'bg-[#E07A5F]',
      rating: 5,
      comment: '"SIRKULA sangat membantu aku yang tinggal di kosan Kukusan! Penjemputan sampah botol plastik & kardus paket jadi gampang banget dan dapat poin!"',
    },
    {
      id: 't2',
      name: 'Dimas Kurniawan',
      role: 'Mahasiswa ITB Bandung',
      campus: 'Institut Teknologi Bandung',
      avatarColor: 'bg-[#1C4D38]',
      rating: 5,
      comment: '"Fitur AI Scanner-nya super akurat! Sampah plastik dan kaleng bekas minuman dingin langsung terdeteksi jenisnya dan otomatis terhitung harga jualnya."',
    },
    {
      id: 't3',
      name: 'Salsa Maharani',
      role: 'Mahasiswi UGM Jogja',
      campus: 'Universitas Gadjah Mada',
      avatarColor: 'bg-[#D9A74E]',
      rating: 5,
      comment: '"Fitur edukasi dan kuisnya seru banget! Aku jadi lebih paham cara memilah sampah kosan dan rajin ngumpulin poin setiap minggu."',
    },
    {
      id: 't4',
      name: 'Fikri Ardiansyah',
      role: 'Mahasiswa IPB Bogor',
      campus: 'IPB University',
      avatarColor: 'bg-[#264653]',
      rating: 5,
      comment: '"Aplikasi terkeren untuk anak kos! Pengepul SIRKULA datang tepat waktu jemput kardus bekas paket ke depan pagar kosan."',
    },
  ];

  // Row 2 Testimonials (Scrolls Right)
  const row2 = [
    {
      id: 't5',
      name: 'Nabila Putri',
      role: 'Mahasiswi Unpad Jatinangor',
      campus: 'Universitas Padjadjaran',
      avatarColor: 'bg-[#E76F51]',
      rating: 5,
      comment: '"Suka banget sama tampilan SIRKULA yang aesthetic dan ramah pengguna. Booking penjemputan sampah kosan jadi praktis banget!"',
    },
    {
      id: 't6',
      name: 'Rizky Ramadhan',
      role: 'Mahasiswa ITS Surabaya',
      campus: 'ITS Surabaya',
      avatarColor: 'bg-[#2A9D8F]',
      rating: 5,
      comment: '"Akhirnya ada solusi daur ulang sampah yang transparan untuk mahasiswa! Dapatkan poin langsung yang bisa ditukarkan berbagai e-wallet."',
    },
    {
      id: 't7',
      name: 'Anisa Rahmawati',
      role: 'Mahasiswi Undip Semarang',
      campus: 'Universitas Diponegoro',
      avatarColor: 'bg-[#E9C46A]',
      rating: 5,
      comment: '"Tampilan dashboard Jejak Hijau bikin semangat mengumpulkan sampah daur ulang. Impact lingkungan kita kelihatan jelas!"',
    },
    {
      id: 't8',
      name: 'Bagus Setiawan',
      role: 'Mahasiswa Unair Surabaya',
      campus: 'Universitas Airlangga',
      avatarColor: 'bg-[#457B9D]',
      rating: 5,
      comment: '"Integrasi Peta Bank Sampah & Pengepul sangat presisi. Jadi gampang cari lokasi drop point sampah terdekat dari tempat kos."',
    },
  ];

  return (
    <section id="testimoni" className="relative py-24 bg-transparent border-b-2 border-[#1C4D38]/25 overflow-hidden scroll-mt-24">
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mb-14 text-center space-y-3">
        <ScrollReveal direction="up" delay={0}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C4D38] tracking-tight font-display">
            Apa Kata Mereka?
          </h2>
          <p className="text-sm sm:text-base text-[#1C4D38]/80 font-medium max-w-xl mx-auto">
            Pengalaman nyata ribuan mahasiswa kos dalam memilah sampah dan menjaga bumi bersama SIRKULA
          </p>
        </ScrollReveal>
      </div>

      {/* Infinite Marquee Grid Box Container */}
      <div className="relative w-full overflow-hidden space-y-6 marquee-container py-2">
        
        {/* Left & Right Edge Gradient Fade Overlay */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#F4F2E9] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#F4F2E9] to-transparent z-20 pointer-events-none" />

        {/* Row 1: Infinite Left Marquee Track */}
        <div className="animate-marquee-left flex gap-6">
          {[...row1, ...row1].map((item, idx) => (
            <div
              key={`row1-${item.id}-${idx}`}
              className="w-[320px] sm:w-[380px] shrink-0 bg-[#FAF3E5]/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-[#1C4D38] shadow-[0_8px_30px_rgba(28,77,56,0.08)] hover:shadow-[0_16px_40px_rgba(28,77,56,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.avatarColor} text-white font-extrabold text-sm flex items-center justify-center shadow-sm`}>
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1C4D38] leading-tight font-display">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-bold text-[#1C4D38]/70 mt-0.5">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#F4B41A]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#1C4D38]/90 font-medium leading-relaxed italic">
                  {item.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1C4D38]/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#1C4D38]/60 uppercase tracking-wider">
                  {item.campus}
                </span>
                <span className="text-[10px] font-bold text-[#1C4D38] bg-[#1C4D38]/10 px-2 py-0.5 rounded-full">
                  Terverifikasi
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Infinite Right Marquee Track */}
        <div className="animate-marquee-right flex gap-6">
          {[...row2, ...row2].map((item, idx) => (
            <div
              key={`row2-${item.id}-${idx}`}
              className="w-[320px] sm:w-[380px] shrink-0 bg-[#EAF2ED]/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border-2 border-[#1C4D38] shadow-[0_8px_30px_rgba(28,77,56,0.08)] hover:shadow-[0_16px_40px_rgba(28,77,56,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${item.avatarColor} text-white font-extrabold text-sm flex items-center justify-center shadow-sm`}>
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1C4D38] leading-tight font-display">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-bold text-[#1C4D38]/70 mt-0.5">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#F4B41A]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-[#1C4D38]/90 font-medium leading-relaxed italic">
                  {item.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1C4D38]/10 mt-4 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#1C4D38]/60 uppercase tracking-wider">
                  {item.campus}
                </span>
                <span className="text-[10px] font-bold text-[#1C4D38] bg-[#1C4D38]/10 px-2 py-0.5 rounded-full">
                  Terverifikasi
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}