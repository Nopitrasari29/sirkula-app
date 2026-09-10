'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import NotificationPopover from '@/components/ui/NotificationPopover';
import UserProfilePopover from '@/components/ui/UserProfilePopover';
import SearchFilterBar from '@/components/bank-sampah/SearchFilterBar';
import InteractiveMapView from '@/components/bank-sampah/InteractiveMapView';
import BankSampahListTable, { BankSampahItem } from '@/components/bank-sampah/BankSampahListTable';
import BankSampahDetailCard from '@/components/bank-sampah/BankSampahDetailCard';
import BankSampahDetailModal from '@/components/bank-sampah/BankSampahDetailModal';
import GpsLocationDetectorBar from '@/components/map/GpsLocationDetectorBar';
import { useGeolocation, adaptLocationsToUser } from '@/hooks/useGeolocation';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const BANK_SAMPAH_DATA: BankSampahItem[] = [
  {
    id: 'bs-1',
    name: 'Bank Sampah Sukolilo',
    address: 'Jl. Teknik Kimia Gg. Melati No.12, Sukolilo, Surabaya',
    distance: '1,2 km',
    timeEstimate: '5 menit',
    days: 'Senin - Sabtu',
    hours: '08.00 - 16.00',
    rating: 4.8,
    reviews: 124,
    acceptedTypes: [
      { name: 'Plastik', color: 'bg-amber-100' },
      { name: 'Kertas', color: 'bg-purple-100' },
      { name: 'Logam', color: 'bg-emerald-100' },
      { name: 'Kaca', color: 'bg-blue-100' },
      { name: 'Organik', color: 'bg-cyan-100' },
    ],
    description:
      'Menerima berbagai jenis sampah anorganik, organik, dan B3 rumah tangga. Mari kelola sampah dan dapatkan nilai serta poin dari setiap setoranmu!',
    lat: -7.2825,
    lng: 112.7944,
  },
  {
    id: 'bs-2',
    name: 'Bank Sampah Keputih',
    address: 'Jl. Keputih Tengah No.45, Keputih, Surabaya',
    distance: '2,4 km',
    timeEstimate: '8 menit',
    days: 'Senin - Sabtu',
    hours: '08.00 - 15.00',
    rating: 4.6,
    reviews: 89,
    acceptedTypes: [
      { name: 'Plastik', color: 'bg-amber-100' },
      { name: 'Kertas', color: 'bg-purple-100' },
      { name: 'Logam', color: 'bg-emerald-100' },
    ],
    description:
      'Spesialis penampungan kardus paket mahasiswa kos dan botol plastik daur ulang.',
    lat: -7.2912,
    lng: 112.8021,
  },
  {
    id: 'bs-3',
    name: 'Bank Sampah Mulyorejo',
    address: 'Jl. Mulyorejo Utara No.88, Mulyorejo, Surabaya',
    distance: '3,1 km',
    timeEstimate: '10 menit',
    days: 'Senin - Sabtu',
    hours: '08.00 - 16.30',
    rating: 4.7,
    reviews: 73,
    acceptedTypes: [
      { name: 'Plastik', color: 'bg-amber-100' },
      { name: 'Kertas', color: 'bg-purple-100' },
      { name: 'Kaca', color: 'bg-blue-100' },
    ],
    description:
      'Mitra resmi pengepul daur ulang wilayah Mulyorejo dengan penimbangan digital cepat.',
    lat: -7.2654,
    lng: 112.7832,
  },
  {
    id: 'bs-4',
    name: 'Bank Sampah Gebang Indah',
    address: 'Jl. Gebang Wetan No.22, Gebang Putih, Surabaya',
    distance: '0,8 km',
    timeEstimate: '3 menit',
    days: 'Senin - Minggu',
    hours: '08.00 - 17.00',
    rating: 4.9,
    reviews: 156,
    acceptedTypes: [
      { name: 'Plastik', color: 'bg-amber-100' },
      { name: 'Kertas', color: 'bg-purple-100' },
      { name: 'Organik', color: 'bg-cyan-100' },
      { name: 'Logam', color: 'bg-emerald-100' },
    ],
    description:
      'Bank sampah terdekat dari pemukiman kos ITS, siap jemput sampah terpilah langsung ke depan pagar kos.',
    lat: -7.2885,
    lng: 112.7912,
  },
  {
    id: 'bs-5',
    name: 'Bank Sampah Kampus Hijau',
    address: 'Kawasan Asrama Mahasiswa Sukolilo, Surabaya',
    distance: '1,5 km',
    timeEstimate: '6 menit',
    days: 'Senin - Jumat',
    hours: '08.30 - 16.00',
    rating: 4.8,
    reviews: 210,
    acceptedTypes: [
      { name: 'Plastik', color: 'bg-amber-100' },
      { name: 'Kertas', color: 'bg-purple-100' },
      { name: 'Logam', color: 'bg-emerald-100' },
      { name: 'Kaca', color: 'bg-blue-100' },
      { name: 'Organik', color: 'bg-cyan-100' },
    ],
    description:
      'Pusat pemilahan dan daur ulang binaan gerakan zero waste kampus dengan fasilitas penukaran merchandise ramah lingkungan.',
    lat: -7.2810,
    lng: 112.7970,
  },
  {
    id: 'bs-6',
    name: 'Bank Sampah Menur Harmoni',
    address: 'Jl. Menur Pumpungan No.102, Menur, Surabaya',
    distance: '4,2 km',
    timeEstimate: '14 menit',
    days: 'Senin - Sabtu',
    hours: '09.00 - 15.30',
    rating: 4.5,
    reviews: 62,
    acceptedTypes: [
      { name: 'Plastik', color: 'bg-amber-100' },
      { name: 'Logam', color: 'bg-emerald-100' },
      { name: 'Kaca', color: 'bg-blue-100' },
    ],
    description:
      'Depo pengumpulan botol kaca dan kaleng logam skala besar dengan timbangan akurat dan pembayaran tunai langsung.',
    lat: -7.2970,
    lng: 112.7720,
  },
];

export default function BankSampahPage() {
  const isAuthorized = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedDistance, setSelectedDistance] = useState('Semua Jarak');
  const [selectedHours, setSelectedHours] = useState('Semua');
  const [selectedBank, setSelectedBank] = useState<BankSampahItem>(BANK_SAMPAH_DATA[0]);
  const [detailModalBank, setDetailModalBank] = useState<BankSampahItem | null>(null);

  // 📍 Live Geolocation / GPS Hook
  const {
    coords,
    isDetecting,
    isRealGps,
    errorMsg: gpsError,
    requestGpsLocation,
    setSimulatedLocation,
    resetToDefault,
    getDistanceTo,
  } = useGeolocation();

  // 📐 Recalculate dynamic distance & timeEstimate based on user coords, sort closest first
  const enrichedBankData = useMemo(() => {
    const localizedData = adaptLocationsToUser(BANK_SAMPAH_DATA, coords);
    return localizedData.map((item) => {
      const distInfo = getDistanceTo(item.lat || -7.2825, item.lng || 112.7944);
      return {
        ...item,
        distance: distInfo.formatted,
        timeEstimate: distInfo.timeEstimate,
        _numericDistance: distInfo.km,
      };
    }).sort((a, b) => a._numericDistance - b._numericDistance);
  }, [coords, getDistanceTo]);

  // 🔍 Real Dynamic Filter Logic via useMemo
  const filteredData = useMemo(() => {
    return enrichedBankData.filter((item) => {
      // 1. Search Query (Nama, Alamat, atau Deskripsi)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 2. Kategori Sampah yang Diterima
      if (selectedCategory !== 'Semua') {
        const hasCategory = item.acceptedTypes.some(
          (t) => t.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!hasCategory) return false;
      }

      // 3. Jarak Tempuh
      if (selectedDistance !== 'Semua Jarak') {
        const numericDist = item._numericDistance;
        if (selectedDistance.includes('2') && numericDist > 2.0) return false;
        if (selectedDistance.includes('5') && numericDist > 5.0) return false;
        if (selectedDistance.includes('10') && numericDist > 10.0) return false;
      }

      // 4. Jam Operasional
      if (selectedHours !== 'Semua') {
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();

        const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const currentDayName = DAY_NAMES[now.getDay()];

        const isDayOpen = (() => {
          if (item.days.includes('Minggu') && item.days.includes('Senin')) return true;
          if (item.days.includes('Senin - Sabtu')) return now.getDay() >= 1 && now.getDay() <= 6;
          if (item.days.includes('Senin - Jumat')) return now.getDay() >= 1 && now.getDay() <= 5;
          return item.days.toLowerCase().includes(currentDayName.toLowerCase());
        })();

        if (selectedHours === 'Buka Hari Ini') {
          return isDayOpen;
        }

        if (selectedHours === 'Buka Sekarang') {
          if (!isDayOpen) return false;
          const hourMatch = item.hours.match(/(\d{2})\.(\d{2})\s*-\s*(\d{2})\.(\d{2})/);
          if (!hourMatch) return true;
          const openMin = Number(hourMatch[1]) * 60 + Number(hourMatch[2]);
          const closeMin = Number(hourMatch[3]) * 60 + Number(hourMatch[4]);
          return nowMin >= openMin && nowMin < closeMin;
        }
      }

      return true;
    });
  }, [enrichedBankData, searchQuery, selectedCategory, selectedDistance, selectedHours]);

  // Keep selectedBank valid if filtered list changes
  useEffect(() => {
    if (filteredData.length > 0) {
      const exists = filteredData.some((b) => b.id === selectedBank.id);
      if (!exists) {
        setSelectedBank(filteredData[0]);
      }
    }
  }, [filteredData, selectedBank.id]);

  if (!isAuthorized) return null;

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedDistance('Semua Jarak');
    setSelectedHours('Semua');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        
        {/* 🍃 Top Leaf Garland Watermark */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-40 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Top Watermark"
            className="w-full h-auto max-h-[320px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display">
                Bank Sampah & Pengepul
              </h1>
              <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
                Temukan mitra bank sampah terdekat dan kelola setoran sampahmu dengan mudah ({filteredData.length} mitra ditemukan)
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <NotificationPopover />
              <UserProfilePopover />
            </div>
          </div>

          {/* 📍 Live GPS Location Detector Bar */}
          <GpsLocationDetectorBar
            currentCoords={coords}
            isRealGps={isRealGps}
            isDetecting={isDetecting}
            errorMsg={gpsError}
            onRequestGps={requestGpsLocation}
            onSelectSimulated={setSimulatedLocation}
            onReset={resetToDefault}
          />

          {/* 🔍 Search & Filter Bar Component */}
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDistance={selectedDistance}
            setSelectedDistance={setSelectedDistance}
            selectedHours={selectedHours}
            setSelectedHours={setSelectedHours}
            onReset={handleReset}
          />

          {/* 🗺️ Main 2-Column Layout (Map & Table Left, Selected Detail Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (7 Cols): Interactive Map + Bank Sampah List Table */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Interactive Map Box Component */}
              <InteractiveMapView
                bankSampahList={filteredData.length > 0 ? filteredData : enrichedBankData}
                selectedBank={selectedBank}
                onSelectBank={setSelectedBank}
                userCoords={coords}
              />

              {/* Bank Sampah List Table Component */}
              <BankSampahListTable
                bankSampahData={filteredData}
                selectedBank={selectedBank}
                onSelectBank={setSelectedBank}
                onOpenDetailModal={(item) => setDetailModalBank(item)}
              />

            </div>

            {/* Right Column (5 Cols): Selected Bank Sampah Detail Card Component */}
            <div className="lg:col-span-5">
              {filteredData.length > 0 ? (
                <BankSampahDetailCard selectedBank={selectedBank} />
              ) : (
                <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-8 text-center space-y-3">
                  <p className="text-base font-black text-[#1C4D38]">Tidak Ada Mitra Ditemukan</p>
                  <p className="text-xs text-[#1C4D38]/70">
                    Coba sesuaikan kata kunci pencarian atau ubah filter jarak & jenis sampah.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-[#1C4D38] text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 🏛️ Bank Sampah Detail Modal Pop-up */}
      <BankSampahDetailModal
        isOpen={Boolean(detailModalBank)}
        onClose={() => setDetailModalBank(null)}
        bank={detailModalBank}
      />

    </div>
  );
}
