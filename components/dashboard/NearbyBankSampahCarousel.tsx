'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useGeolocation, GPS_STORAGE_KEY } from '@/hooks/useGeolocation';

export default function NearbyBankSampahCarousel() {
  const { coords } = useGeolocation();
  const [districtName, setDistrictName] = useState('Terdekat');

  useEffect(() => {
    const updateDistrict = () => {
      try {
        const saved = localStorage.getItem(GPS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.name) {
            const clean = parsed.name
              .replace(' (GPS Real-Time)', '')
              .replace(' (Default)', '')
              .replace(' (Simulasi)', '')
              .trim();
            const district = clean.split(',')[0].trim();
            if (district) {
              setDistrictName(district);
              return;
            }
          }
        }
      } catch (e) {}

      if (coords?.name) {
        const clean = coords.name
          .replace(' (GPS Real-Time)', '')
          .replace(' (Default)', '')
          .replace(' (Simulasi)', '')
          .trim();
        const district = clean.split(',')[0].trim();
        if (district) setDistrictName(district);
      }
    };

    updateDistrict();
    window.addEventListener('storage', updateDistrict);
    window.addEventListener('sirkula:locationChange', updateDistrict);
    return () => {
      window.removeEventListener('storage', updateDistrict);
      window.removeEventListener('sirkula:locationChange', updateDistrict);
    };
  }, [coords]);

  const bankSampahList = [
    {
      id: 'bs-1',
      titleLine1: 'Bank Sampah',
      titleLine2: districtName,
      distance: coords?.accuracy ? '0,8 km' : '1,2 km',
      img: '/assets/illustrations/bank-sampah-icon.png',
    },
    {
      id: 'bs-2',
      titleLine1: 'Bank Sampah',
      titleLine2: 'Mitra Wilayah',
      distance: coords?.accuracy ? '2,4 km' : '3,5 km',
      img: '/assets/illustrations/bank-sampah-icon.png',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
          Bank Sampah Terdekat
        </h2>
      </div>

      {/* Main Container Card (Dikunci Lebarnya dengan max-w-3xl Sesuai Figma) */}
      <div className="max-w-3xl bg-[#FAF3E5]/70 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-4 sm:p-5 space-y-3 shadow-xs">

        {/* Carousel Content Row */}
        <div className="flex items-center justify-between gap-3 sm:gap-6">

          {/* 2 Locations Grid dengan Garis Sekat Vertikal */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 items-center">
            {bankSampahList.map((item, idx) => (
              <Link
                key={item.id}
                href="/lokasi"
                className={`flex items-center gap-3.5 group transition-transform ${idx === 0 ? 'sm:border-r sm:border-[#1C4D38]/15 sm:pr-6' : 'sm:pl-6'
                  }`}
              >
                {/* Illustration Image (Kompak Sesuai Figma) */}
                <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <img
                    src={item.img}
                    alt={`${item.titleLine1} ${item.titleLine2}`}
                    className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info Text (2 Baris Pas Sesuai Figma) */}
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-[#1C4D38] font-display leading-tight group-hover:text-[#143929] transition">
                    {item.titleLine1} <br />
                    <span>{item.titleLine2}</span>
                  </h3>
                  <p className="text-xs text-[#1C4D38]/80 font-bold flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1C4D38]/70 shrink-0" />
                    <span>{item.distance}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Chevron Arrow Icon */}
          <Link
            href="/lokasi"
            className="p-1 text-[#1C4D38] hover:opacity-75 transition shrink-0 hidden sm:block pr-1"
            title="Lihat Lebih Banyak Bank Sampah"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </Link>

        </div>

        {/* Carousel Pagination Dots (Mustard Gold Circles Sesuai Figma) */}
        <div className="flex justify-center items-center gap-2 pt-0.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9A74E] scale-110" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9A74E]/35" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9A74E]/35" />
        </div>

      </div>
    </div>
  );
}