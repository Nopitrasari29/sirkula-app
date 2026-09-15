'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  Tag,
  Scale,
  Leaf,
  Droplet,
  Sun,
  Package,
  Trash2,
  Calendar,
  ChevronRight,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { WasteScanResult } from '@/lib/types';
import BankSampahDetailModal from '@/components/bank-sampah/BankSampahDetailModal';
import { BankSampahItem } from '@/components/bank-sampah/BankSampahListTable';
import { useGeolocation, adaptLocationsToUser } from '@/hooks/useGeolocation';

interface ScanResultViewProps {
  result: WasteScanResult;
  onScanAgain: () => void;
}

export default function ScanResultView({ result, onScanAgain }: ScanResultViewProps) {
  const [activeModalBank, setActiveModalBank] = useState<BankSampahItem | null>(null);
  const { coords, getDistanceTo } = useGeolocation();

  // Bank Sampah terdekat — diambil dari /api/lokasi, fallback ke data statis
  const FALLBACK_BANK_SAMPAH: BankSampahItem[] = [
    {
      id: 'bs-1',
      name: 'Bank Sampah Sukolilo',
      address: 'Jl. Teknik Kimia Gg. Melati No.12, Sukolilo, Surabaya',
      distance: '1,2 km',
      timeEstimate: '5 menit',
      lat: -7.2825,
      lng: 112.7944,
      days: 'Senin - Sabtu',
      hours: '08.00 - 16.00',
      rating: 4.8,
      reviews: 124,
      acceptedTypes: [
        { name: 'Plastik', color: 'bg-amber-100' },
        { name: 'Kertas', color: 'bg-pink-100' },
        { name: 'Logam', color: 'bg-emerald-100' },
        { name: 'Kaca', color: 'bg-lime-100' },
        { name: 'Organik', color: 'bg-sky-100' },
      ],
      description: 'Menerima berbagai jenis sampah anorganik, kertas, dan plastik PET.',
    },
    {
      id: 'bs-2',
      name: 'Bank Sampah Keputih',
      address: 'Jl. Keputih Tengah No.45, Keputih, Surabaya',
      distance: '2,4 km',
      timeEstimate: '8 menit',
      lat: -7.2912,
      lng: 112.8021,
      days: 'Senin - Sabtu',
      hours: '08.00 - 15.00',
      rating: 4.6,
      reviews: 89,
      acceptedTypes: [
        { name: 'Plastik', color: 'bg-amber-100' },
        { name: 'Kertas', color: 'bg-pink-100' },
        { name: 'Organik', color: 'bg-sky-100' },
      ],
      description: 'Bank Sampah ramah lingkungan melayani daur ulang sampah warga sekitar.',
    },
    {
      id: 'bs-3',
      name: 'Bank Sampah Mulyorejo',
      address: 'Jl. Mulyorejo Utara No.88, Mulyorejo, Surabaya',
      distance: '3,1 km',
      timeEstimate: '10 menit',
      lat: -7.2654,
      lng: 112.7832,
      days: 'Senin - Sabtu',
      hours: '08.00 - 16.30',
      rating: 4.7,
      reviews: 73,
      acceptedTypes: [
        { name: 'Plastik', color: 'bg-amber-100' },
        { name: 'Kertas', color: 'bg-pink-100' },
        { name: 'Logam', color: 'bg-emerald-100' },
      ],
      description: 'Pusat daur ulang sampah berkualitas tinggi di wilayah sekitar.',
    },
  ];

  const [rawBankSampahList, setRawBankSampahList] = useState<BankSampahItem[]>(FALLBACK_BANK_SAMPAH);

  // Fetch bank sampah dari /api/lokasi saat mount
  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const params = coords
          ? `?lat=${coords.lat}&lng=${coords.lng}`
          : '';
        const res = await fetch(`/api/lokasi${params}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: BankSampahItem[] = data.data.slice(0, 3).map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            distance: loc.distanceKm ? `${loc.distanceKm} km` : '-',
            timeEstimate: loc.distanceKm ? `${Math.ceil(loc.distanceKm / 0.3)} menit` : '-',
            lat: loc.latitude || loc.lat,
            lng: loc.longitude || loc.lng,
            days: loc.operatingHours?.split(':')[0] || 'Senin - Sabtu',
            hours: loc.operatingHours?.split(': ')[1] || '08.00 - 16.00',
            rating: loc.rating || 4.5,
            reviews: 50,
            acceptedTypes: (loc.acceptedCategories || ['Plastik']).map((cat: string) => ({
              name: cat.split(' ')[0],
              color: 'bg-emerald-100',
            })),
            description: `Menerima: ${(loc.acceptedCategories || []).join(', ')}`,
          }));
          setRawBankSampahList(mapped);
        }
      } catch {
        // Tetap pakai fallback statis
      }
    };
    fetchLokasi();
  }, [coords]);

  const itemName = result.name || result.itemName || 'Botol Plastik (PET)';
  const categoryName = result.categoryName || result.category || 'Plastik';
  const pricePerKg = result.estimatedPricePerKg || 2000;
  const weightKg = result.estimatedWeightKg || 0.15;
  const co2Saved = result.co2SavedKg || (weightKg * 3.0).toFixed(2);

  const bankSampahList = useMemo(() => {
    const adapted = adaptLocationsToUser(rawBankSampahList, coords);
    return adapted.map((item) => {
      const distInfo = getDistanceTo(item.lat || -7.2825, item.lng || 112.7944);
      return {
        ...item,
        distance: distInfo.formatted,
        timeEstimate: distInfo.timeEstimate,
      };
    });
  }, [coords, getDistanceTo, rawBankSampahList]);

  const sortingSteps = [
    {
      num: 1,
      title: 'Bersihkan',
      desc: 'Cuci botol hingga bersih dari sisa minuman',
      iconImg: '/assets/icons/sort-4-recyclebin.png',
    },
    {
      num: 2,
      title: 'Lepas Tutup',
      desc: 'Lepas tutup botol dan pisahkan dari badan botol',
      iconImg: '/assets/icons/sort-3-crush.png',
    },
    {
      num: 3,
      title: 'Kempiskan',
      desc: 'Kempiskan botol agar tidak memakan tempat',
      iconImg: '/assets/icons/sort-2-cap.png',
    },
    {
      num: 4,
      title: 'Masukkan',
      desc: 'Masukkan ke dalam tempat sampah daur ulang',
      iconImg: '/assets/icons/sort-1-clean.png',
    },
  ];

  const managementTips = [
    {
      title: 'Bilas hingga bersih',
      desc: 'Hilangkan sisa minuman atau kotoran',
      icon: Droplet,
    },
    {
      title: 'Keringkan',
      desc: 'Pastikan tidak ada sisa air dalam botol',
      icon: Sun,
    },
    {
      title: 'Pisahkan Tutup & Label',
      desc: 'Jenis plastik tutup beda dengan botol',
      icon: Package,
    },
    {
      title: 'Kumpulkan 1kg',
      desc: 'Gepengkan & kumpulkan hingga 1 kg',
      icon: Trash2,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner Success Notification */}
      <div className="bg-[#1C4D38] text-white rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-[#E07A5F] flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-display">
              Sampah Berhasil Teridentifikasi!
            </h2>
            <p className="text-xs text-white/80 font-medium">
              Kamu mendapatkan <span className="font-extrabold text-[#FCE39E]">+50 Poin SIRKULA</span> dari pemindaian ini.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onScanAgain}
          className="px-5 py-2.5 bg-white hover:bg-gray-100 text-[#1C4D38] text-xs font-extrabold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Scan Sampah Lain</span>
        </button>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Main Result + Informasi Sampah + Cara Memilah */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Hasil Scan Main Container */}
          <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column (5 Cols): Scanned Image Box + Scan Ulang Button */}
              <div className="sm:col-span-5 flex flex-col justify-between items-center bg-[#FCE39E]/60 border border-[#1C4D38]/10 rounded-[22px] p-4 text-center space-y-4">
                
                {/* Image Display */}
                <div className="w-full h-44 flex items-center justify-center p-2">
                  <img
                    src={result.imageUrl || '/assets/illustrations/scan-item-bottle.png'}
                    alt={itemName}
                    className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/assets/illustrations/scan-item-bottle.png';
                    }}
                  />
                </div>

                {/* Scan Ulang Button */}
                <button
                  type="button"
                  onClick={onScanAgain}
                  className="w-full py-2.5 bg-[#E07A5F] hover:bg-[#d4684d] text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Scan Ulang</span>
                </button>

              </div>

              {/* Right Column (7 Cols): Identification Info */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 bg-[#FCE39E] text-[#1C4D38] text-[10px] font-black rounded-full border border-[#1C4D38]/10">
                      Tingkat Akurasi {result.confidence || 98}%
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display">
                      {itemName}
                    </h2>
                  </div>

                  <p className="text-xs text-[#1C4D38]/80 font-medium leading-relaxed">
                    {result.recyclingImpact ||
                      'Botol berbahan plastik PET berkualitas tinggi. Sangat berharga untuk didaur ulang menjadi serat tekstil atau wadah daur ulang baru.'}
                  </p>
                </div>

                {/* Resale Value Highlight Box */}
                <div className="p-3.5 rounded-2xl bg-[#E3F0E9] border border-[#1C4D38]/15 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#1C4D38]/70">Estimasi Nilai Jual</p>
                    <p className="text-base font-black text-[#1C4D38] font-display">
                      Rp {pricePerKg.toLocaleString('id-ID')}<span className="text-xs font-normal">/kg</span>
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-[#1C4D38] text-white text-xs font-extrabold rounded-xl shadow-2xs">
                    Daur Ulang
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Card 2: Informasi Sampah Grid */}
          <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">
              Informasi Sampah
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Item 1: Jenis Sampah */}
              <div className="p-4 rounded-2xl bg-[#F9EED3]/70 border border-[#1C4D38]/10 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#FCE39E] text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/70">Jenis Sampah</p>
                  <p className="text-xs font-black text-[#1C4D38] font-display mt-0.5">{categoryName}</p>
                </div>
              </div>

              {/* Item 2: Berat Estimasi */}
              <div className="p-4 rounded-2xl bg-[#F9EED3]/70 border border-[#1C4D38]/10 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#FCE39E] text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/70">Berat Estimasi</p>
                  <p className="text-xs font-black text-[#1C4D38] font-display mt-0.5">{weightKg} kg</p>
                </div>
              </div>

              {/* Item 3: Dampak Positif */}
              <div className="p-4 rounded-2xl bg-[#F9EED3]/70 border border-[#1C4D38]/10 flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-[#CBE0BA] text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/70">Dampak Positif</p>
                  <p className="text-[11px] font-black text-[#1C4D38] font-display mt-0.5 leading-tight">
                    Dapat mengurangi emisi CO₂ hingga <span className="text-[#E07A5F]">{co2Saved} kg</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3: Cara Memilah yang Benar */}
          <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">
              Cara Memilah yang Benar
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sortingSteps.map((step) => (
                <div key={step.num} className="p-4 rounded-[22px] bg-white border border-[#1C4D38]/10 text-center flex flex-col items-center justify-between space-y-2.5 shadow-2xs relative hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 relative flex items-center justify-center p-1">
                    <img
                      src={step.iconImg}
                      alt={step.title}
                      className="w-full h-full object-contain filter drop-shadow-xs hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E07A5F] text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-2xs">
                      {step.num}
                    </div>
                  </div>

                  <div className="space-y-1 pt-0.5">
                    <h4 className="text-xs font-black text-[#1C4D38] font-display leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-[#1C4D38]/75 font-medium leading-snug">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): Cara Pengelolaan + Rekomendasi + Bank Sampah Terdekat */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Cara Pengelolaan */}
          <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-3.5 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">
              Cara Pengelolaan
            </h3>

            <div className="space-y-2.5">
              {managementTips.map((tip, idx) => {
                const IconC = tip.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-white/80 border border-[#1C4D38]/10 flex items-center gap-3 shadow-2xs">
                    <div className="w-9 h-9 rounded-xl bg-[#F9EED3] text-[#E07A5F] flex items-center justify-center shrink-0 border border-[#1C4D38]/10">
                      <IconC className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#1C4D38] font-display leading-tight">
                        {tip.title}
                      </h4>
                      <p className="text-[10px] text-[#1C4D38]/70 font-medium mt-0.5">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Rekomendasi Untukmu Banner Card */}
          <div className="bg-[#1C4D38] text-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-3 shadow-md relative overflow-hidden">
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FCE39E]">
                Rekomendasi Untukmu
              </span>
              <h3 className="text-base font-black font-display leading-tight">
                Setor ke Bank Sampah
              </h3>
              <p className="text-xs text-white/80 font-medium leading-relaxed">
                Dapatkan nilai tukar terbaik Rp {pricePerKg.toLocaleString('id-ID')}/kg dan peroleh +50 poin tambahan!
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E07A5F] hover:bg-[#d4684d] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Setor Sekarang</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Bank Sampah Terdekat */}
          <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">
              Bank Sampah Terdekat
            </h3>

            {/* Headers */}
            <div className="hidden sm:grid grid-cols-12 text-[10px] font-extrabold text-[#1C4D38]/60 px-2 pb-1 border-b border-[#1C4D38]/10">
              <div className="col-span-5">Lokasi</div>
              <div className="col-span-3 text-center">Jarak</div>
              <div className="col-span-4 text-right">Jam Operasional</div>
            </div>

            <div className="space-y-2.5">
              {bankSampahList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalBank(item)}
                  className="p-3.5 rounded-2xl bg-white/80 border border-[#1C4D38]/10 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white transition cursor-pointer active:scale-[0.99]"
                >
                  
                  {/* Left: Logo + Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                      <img
                        src="/assets/illustrations/bank-sampah-icon.png"
                        alt="Logo Bank Sampah"
                        className="w-full h-full object-contain filter drop-shadow-xs hover:scale-105 transition-transform"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/assets/icons/sort-1-clean.png';
                        }}
                      />
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-xs font-black text-[#1C4D38] font-display truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#1C4D38]/70 font-medium truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{item.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Distance & Action Button */}
                  <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                    <div className="text-left sm:text-right text-[10px] font-semibold text-[#1C4D38]">
                      <p className="font-bold">{item.distance}</p>
                      <p className="text-[9px] text-[#1C4D38]/60">{item.timeEstimate}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalBank(item);
                      }}
                      className="px-3 py-1.5 bg-[#E07A5F] hover:bg-[#d4684d] text-white text-[10px] font-extrabold rounded-lg shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                      Lihat Detail
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Action Button */}
            <div className="pt-1">
              <Link
                href="/bank-sampah"
                className="block w-full py-2 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold rounded-xl transition shadow-2xs text-center cursor-pointer"
              >
                Muat Lebih Banyak
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* 🏛️ Bank Sampah Detail Pop-up Modal */}
      <BankSampahDetailModal
        isOpen={Boolean(activeModalBank)}
        onClose={() => setActiveModalBank(null)}
        bank={activeModalBank}
      />

    </div>
  );
}
