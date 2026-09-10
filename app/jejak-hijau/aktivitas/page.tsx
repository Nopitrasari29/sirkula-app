'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderBar from '@/components/dashboard/HeaderBar';
import {
  ChevronLeft,
  LayoutGrid,
  Scan,
  Truck,
  Calendar,
  BookOpen,
  Award,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getScanHistory, getBookings, getCompletedEducation } from '@/lib/utils/storage';

interface ActivityRecord {
  id: string;
  category: 'Scan' | 'Setoran' | 'Booking' | 'Kuis' | 'Badge';
  title: string;
  detail: string;
  points: string | null;
  time: string;
  icon: React.ElementType;
}

const SEED_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'seed-1',
    category: 'Scan',
    title: 'Scan Botol Plastik 1,2 kg',
    detail: 'Berhasil scan 1,2 kg sampah plastik botol PET',
    points: '+20 poin',
    time: 'Hari Ini 10.12 WIB',
    icon: Scan,
  },
  {
    id: 'seed-2',
    category: 'Booking',
    title: 'Booking penjemputan berhasil',
    detail: 'Booking #BK-260905-001 dijadwalkan oleh kurir',
    points: null,
    time: 'Kemarin 08.00 WIB',
    icon: Calendar,
  },
  {
    id: 'seed-3',
    category: 'Kuis',
    title: 'Menyelesaikan kuis "Sampah Organik"',
    detail: 'Skor 90/100 pemahaman pilah organik kos',
    points: '+20 poin',
    time: '2 Hari Lalu 20.45 WIB',
    icon: BookOpen,
  },
  {
    id: 'seed-4',
    category: 'Scan',
    title: 'Scan Kardus Bekas 2.5 kg',
    detail: 'Berhasil scan 2.5 kg kardus & kertas paket',
    points: '+40 poin',
    time: '3 Hari Lalu 14.20 WIB',
    icon: Scan,
  },
  {
    id: 'seed-5',
    category: 'Setoran',
    title: 'Setoran sampah selesai',
    detail: 'Setoran 3.5 kg ke Bank Sampah Dinoyo Malang',
    points: '+75 poin',
    time: '4 Hari Lalu 11.30 WIB',
    icon: Truck,
  },
  {
    id: 'seed-6',
    category: 'Badge',
    title: 'Mendapatkan Badge "Pejuang Hijau"',
    detail: 'Pencapaian daur ulang aktif minggu ini',
    points: '+150 poin',
    time: '5 Hari Lalu 09.00 WIB',
    icon: Award,
  },
  {
    id: 'seed-7',
    category: 'Kuis',
    title: 'Menyelesaikan kuis "Daur Ulang Plastik"',
    detail: 'Skor 100/100 klasifikasi kode resin plastik',
    points: '+25 poin',
    time: '6 Hari Lalu 16.15 WIB',
    icon: BookOpen,
  },
  {
    id: 'seed-8',
    category: 'Booking',
    title: 'Booking penjemputan selesai',
    detail: 'Armada jemput telah menyelesaikan setoran #BK-260828-004',
    points: '+50 poin',
    time: '1 Minggu Lalu',
    icon: Calendar,
  },
  {
    id: 'seed-9',
    category: 'Scan',
    title: 'Scan Kaleng Aluminium Minuman 0.8 kg',
    detail: 'Berhasil identifikasi logam aluminium daur ulang',
    points: '+30 poin',
    time: '1 Minggu Lalu',
    icon: Scan,
  },
  {
    id: 'seed-10',
    category: 'Badge',
    title: 'Mendapatkan Badge "Pionir Pemilah"',
    detail: 'Konsisten memilah 5 kategori sampah berbeda',
    points: '+100 poin',
    time: '2 Minggu Lalu',
    icon: Award,
  },
  {
    id: 'seed-11',
    category: 'Setoran',
    title: 'Setoran Kertas & Buku Bekas 5 kg',
    detail: 'Dikonversi ke saldo rupiah mitra Bank Sampah Merjosari',
    points: '+120 poin',
    time: '2 Minggu Lalu',
    icon: Truck,
  },
  {
    id: 'seed-12',
    category: 'Kuis',
    title: 'Kuis Kilat "Prinsip 3R di Kos"',
    detail: 'Skor 80/100 aksi kurangi plastik sekali pakai',
    points: '+15 poin',
    time: '3 Minggu Lalu',
    icon: BookOpen,
  },
];

const ITEMS_PER_PAGE = 5;

export default function SemuaAktivitasPage() {
  const isAuthorized = useAuthGuard();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Semua Waktu');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [liveActivities, setLiveActivities] = useState<ActivityRecord[]>([]);

  const loadActivities = () => {
    const scans = getScanHistory();
    const bookings = getBookings();
    const completedEdu = getCompletedEducation();

    const merged: ActivityRecord[] = [];

    // Add live scans
    scans.forEach((scan, idx) => {
      merged.push({
        id: `live-scan-${scan.id || idx}`,
        category: 'Scan',
        title: `Scan ${scan.itemName || scan.name || 'Sampah'}`,
        detail: `Hasil scan ${scan.estimatedWeightKg || 0.5} kg — Kategori: ${scan.category || 'Daur Ulang'}`,
        points: `+${scan.earnedPoints || scan.pointsEarned || 50} poin`,
        time: scan.timestamp || 'Hari Ini',
        icon: Scan,
      });
    });

    // Add live bookings
    bookings.forEach((book, idx) => {
      merged.push({
        id: `live-book-${book.id || idx}`,
        category: 'Booking',
        title: `Booking Penjemputan #${book.id}`,
        detail: `Status: ${book.status || 'Dibuat'} — Lokasi: ${book.userAddress || book.address || 'Alamat Kos'}`,
        points: `+${book.totalPoints || 80} poin`,
        time: book.pickupDate || book.createdAt || 'Hari Ini',
        icon: Calendar,
      });
    });

    // Add completed educations
    if (completedEdu.length > 0) {
      merged.push({
        id: 'live-edu',
        category: 'Kuis',
        title: 'Menyelesaikan modul edukasi',
        detail: `Berhasil menuntaskan ${completedEdu.length} materi belajar hijau`,
        points: '+20 poin',
        time: 'Hari Ini',
        icon: BookOpen,
      });
    }

    // Merge with seeds (avoiding duplicates)
    const combined = [...merged, ...SEED_ACTIVITIES];
    setLiveActivities(combined);
  };

  useEffect(() => {
    loadActivities();
    const handleStorage = () => loadActivities();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedTimeframe]);

  const categories = [
    { name: 'Semua', icon: LayoutGrid },
    { name: 'Scan', icon: Scan },
    { name: 'Setoran', icon: Truck },
    { name: 'Booking', icon: Calendar },
    { name: 'Kuis', icon: BookOpen },
    { name: 'Badge', icon: Award },
  ];

  const filteredActivities = useMemo(() => {
    return liveActivities.filter((item) => {
      const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
      let matchTime = true;
      if (selectedTimeframe === 'Hari Ini') {
        matchTime = item.time.toLowerCase().includes('hari ini');
      } else if (selectedTimeframe === 'Minggu Ini') {
        matchTime = !item.time.toLowerCase().includes('minggu lalu');
      } else if (selectedTimeframe === 'Bulan Ini') {
        matchTime = true;
      }
      return matchCategory && matchTime;
    });
  }, [liveActivities, activeCategory, selectedTimeframe]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredActivities.length);
  const currentDisplayList = filteredActivities.slice(startIndex, endIndex);

  if (!isAuthorized) return null;

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
          <HeaderBar />

          {/* Page Sub-Header Back Link */}
          <div>
            <Link
              href="/jejak-hijau"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1C4D38] hover:opacity-75 transition"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Semua Aktivitas</span>
            </Link>
          </div>

          {/* Main Card Container */}
          <div className="bg-[#FAF5ED]/90 border border-[#1C4D38]/10 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xs backdrop-blur-md">
            
            {/* Control Bar: Filter Pills Left, Timeframe Select Right */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => {
                  const IconC = cat.icon;
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? 'bg-[#1C4D38] text-white border-[#1C4D38] shadow-xs'
                          : 'bg-white text-[#1C4D38] border-[#1C4D38]/20 hover:bg-gray-50'
                      }`}
                    >
                      <IconC className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Timeframe Dropdown (Right) */}
              <div className="relative shrink-0">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2 bg-white border border-[#1C4D38]/20 rounded-xl text-xs font-extrabold text-[#1C4D38] focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20 cursor-pointer shadow-2xs"
                >
                  <option value="Semua Waktu">Semua Waktu</option>
                  <option value="Hari Ini">Hari Ini</option>
                  <option value="Minggu Ini">Minggu Ini</option>
                  <option value="Bulan Ini">Bulan Ini</option>
                </select>
                <Calendar className="w-3.5 h-3.5 text-[#1C4D38] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-[#1C4D38]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

            </div>

            {/* Activity Table Headers */}
            <div className="hidden sm:grid grid-cols-12 text-[11px] font-extrabold text-[#1C4D38]/60 px-3 pb-2 border-b border-[#1C4D38]/10">
              <div className="col-span-5">Aktivitas</div>
              <div className="col-span-4">Detail</div>
              <div className="col-span-1 text-center">Poin</div>
              <div className="col-span-2 text-right">Waktu</div>
            </div>

            {/* Activity Table Rows */}
            <div className="space-y-3">
              {currentDisplayList.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-[#1C4D38]/60">
                  Tidak ada aktivitas ditemukan untuk kategori atau rentang waktu ini.
                </div>
              ) : (
                currentDisplayList.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white/80 border border-[#1C4D38]/10 shadow-2xs grid grid-cols-1 sm:grid-cols-12 items-center gap-3 hover:bg-white transition"
                    >
                      {/* Aktivitas Title + Icon */}
                      <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#E3F0E9] text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10 shadow-2xs">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-black text-[#1C4D38] truncate font-display">
                          {item.title}
                        </h4>
                      </div>

                      {/* Detail */}
                      <div className="sm:col-span-4 text-xs font-medium text-gray-600 truncate">
                        {item.detail}
                      </div>

                      {/* Poin */}
                      <div className="sm:col-span-1 text-left sm:text-center text-xs font-black text-[#1C4D38]">
                        {item.points || '-'}
                      </div>

                      {/* Waktu */}
                      <div className="sm:col-span-2 text-left sm:text-right text-[11px] font-semibold text-gray-500">
                        {item.time}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1C4D38]/10">
              
              {/* Page Number Buttons */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C4D38]">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                  className="w-8 h-8 rounded-lg border border-[#1C4D38]/20 flex items-center justify-center bg-white hover:bg-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition cursor-pointer ${
                      safeCurrentPage === pageNum
                        ? 'bg-[#1C4D38] text-white shadow-xs'
                        : 'bg-white text-[#1C4D38] border border-[#1C4D38]/20 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                  className="w-8 h-8 rounded-lg border border-[#1C4D38]/20 flex items-center justify-center bg-white hover:bg-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Item Counter */}
              <div className="text-xs font-semibold text-[#1C4D38]/70">
                Menampilkan {filteredActivities.length > 0 ? startIndex + 1 : 0}-{endIndex} dari {filteredActivities.length} aktivitas
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
