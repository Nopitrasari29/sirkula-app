'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Trash2,
  Recycle,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Truck,
  Users,
  Calendar,
  Sparkles,
  Lightbulb,
  Map,
} from 'lucide-react';

export interface RouteData {
  id: string;
  name: string;
  stopsSummary: string;
  days: string;
  isAvailableToday: boolean;
  estTime: string;
  distance: string;
  truckType: string;
  availableSlots: number;
  haltes: {
    id: string;
    name: string;
    address: string;
    time: string;
    slots: string;
  }[];
}

export const ROUTES_DATA: RouteData[] = [
  {
    id: 'r-03',
    name: 'Route 03',
    stopsSummary: 'Keputih → Sukolilo\nMulyorejo → Sukolilo',
    days: 'Senin, Rabu, Jumat',
    isAvailableToday: true,
    estTime: '~2.5 jam perjalanan',
    distance: '~12 km',
    truckType: 'Truk Kompak',
    availableSlots: 4,
    haltes: [
      {
        id: 'h-1',
        name: 'Bank Sampah Mitra Terdekat',
        address: 'Jl. Utama Kampus No. 10, Halte Penyetoran',
        time: '08:30 WIB',
        slots: '8/20 Slot',
      },
      {
        id: 'h-2',
        name: 'Bank Sampah Mulyorejo (Halte 1)',
        address: 'Jl. Mulyorejo No. 25, Surabaya',
        time: '09:15 WIB',
        slots: '12/20 Slot',
      },
      {
        id: 'h-3',
        name: 'Bank Sampah Mulyorejo (Halte 2)',
        address: 'Jl. Mulyorejo No. 44, Surabaya',
        time: '10:15 WIB',
        slots: '5/20 Slot',
      },
      {
        id: 'h-4',
        name: 'Bank Sampah Mulyorejo (Halte 3)',
        address: 'Jl. Mulyorejo No. 56, Surabaya',
        time: '11:30 WIB',
        slots: '4 slot',
      },
    ],
  },
  {
    id: 'r-01',
    name: 'Route 01',
    stopsSummary: 'Sukolilo → Rungkut\nGunung Anyar',
    days: 'Senin - Sabtu',
    isAvailableToday: false,
    estTime: '~3.0 jam perjalanan',
    distance: '~15 km',
    truckType: 'Truk Standar',
    availableSlots: 8,
    haltes: [
      {
        id: 'h-10',
        name: 'Bank Sampah Rungkut Asri',
        address: 'Jl. Rungkut Asri Timur No. 12',
        time: '08:00 WIB',
        slots: '10/20 Slot',
      },
      {
        id: 'h-11',
        name: 'Bank Sampah Gunung Anyar',
        address: 'Jl. Gunung Anyar Sawah No. 5',
        time: '09:30 WIB',
        slots: '6/20 Slot',
      },
    ],
  },
  {
    id: 'r-02',
    name: 'Route 02',
    stopsSummary: 'Mulyorejo → Tambak\nBayan → Kenjeran',
    days: 'Selasa, Rabu, Sabtu',
    isAvailableToday: false,
    estTime: '~2.0 jam perjalanan',
    distance: '~10 km',
    truckType: 'Truk Kompak',
    availableSlots: 6,
    haltes: [
      {
        id: 'h-20',
        name: 'Bank Sampah Tambak Bayan',
        address: 'Jl. Tambak Bayan No. 8',
        time: '08:45 WIB',
        slots: '7/20 Slot',
      },
    ],
  },
  {
    id: 'r-04',
    name: 'Route 04',
    stopsSummary: 'Simokerto → Semampir\nKenjeran → Bulak',
    days: 'Senin, Rabu, Minggu',
    isAvailableToday: false,
    estTime: '~3.5 jam perjalanan',
    distance: '~18 km',
    truckType: 'Truk Besar',
    availableSlots: 10,
    haltes: [
      {
        id: 'h-30',
        name: 'Bank Sampah Kenjeran Indah',
        address: 'Jl. Pantai Kenjeran No. 20',
        time: '10:00 WIB',
        slots: '15/20 Slot',
      },
    ],
  },
];

interface RouteSelectionViewProps {
  selectedRoute: RouteData;
  selectedHalteId: string;
  onSelectRoute: (route: RouteData) => void;
  onSelectHalteId: (halteId: string) => void;
  onContinue: () => void;
}

export default function RouteSelectionView({
  selectedRoute,
  selectedHalteId,
  onSelectRoute,
  onSelectHalteId,
  onContinue,
}: RouteSelectionViewProps) {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* 🚌 Top Suroboyo Bus System Banner */}
      <div className="bg-[#1C4D38] text-white rounded-[28px] p-6 sm:p-7 shadow-md relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left: Mascot Truck Illustration */}
        <div className="w-44 sm:w-56 h-28 sm:h-32 bg-white/10 rounded-2xl p-3 flex items-center justify-center shrink-0 border border-white/15">
          <img
            src="/assets/illustrations/sirkula-truck.png"
            alt="Truk Pengangkut SIRKULA"
            className="w-full h-full object-contain filter drop-shadow-md"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/assets/illustrations/sirkula-truck.png';
            }}
          />
        </div>

        {/* Center: System Explanation */}
        <div className="space-y-2 flex-1 text-center lg:text-left">
          <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
            Sistem Penjemputan seperti Suroboyo Bus
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-2xl">
            Truk pengangkut akan menjemput sampah dari bank sampah terdekat sesuai jadwal yang tersedia. Pastikan sampah sudah dipilah sebelum penjemputan.
          </p>
        </div>

        {/* Right: 3 Step Micro-Icons */}
        <div className="flex items-center gap-4 shrink-0 bg-[#2A664C]/70 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
          
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-[#1C4D38] flex items-center justify-center text-[#66C699] border border-white/15">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white/90 leading-tight">
              Pilih jalur<br />penjemputan
            </span>
          </div>

          <div className="w-px h-8 bg-white/20" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-[#1C4D38] flex items-center justify-center text-[#66C699] border border-white/15">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white/90 leading-tight">
              Datang ke<br />bank sampah
            </span>
          </div>

          <div className="w-px h-8 bg-white/20" />

          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-[#1C4D38] flex items-center justify-center text-[#66C699] border border-white/15">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-white/90 leading-tight">
              Serahkan<br />sampah terpilah
            </span>
          </div>

        </div>

      </div>

      {/* 1️⃣ Step 1: Pilih Rute Penjemputan */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#1C4D38] text-white font-black text-xs flex items-center justify-center shadow-xs">
            1
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#1C4D38] font-display">
              Pilih Rute Penjemputan
            </h3>
            <p className="text-[11px] text-[#1C4D38]/70 font-medium">
              Pilih rute yang mencakup bank sampah dan jadwal penjemputan terdekatmu
            </p>
          </div>
        </div>

        {/* Route Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {ROUTES_DATA.map((route) => {
            const isSelected = selectedRoute.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className={`p-4 rounded-[22px] border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  isSelected
                    ? 'bg-white border-2 border-[#1C4D38] shadow-md ring-2 ring-[#1C4D38]/10'
                    : 'bg-white/80 hover:bg-white border-[#1C4D38]/15 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Top Row: Route Title & Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#1C4D38] font-display">
                    {route.name}
                  </span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#1C4D38] text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#1C4D38]/40" />
                  )}
                </div>

                {/* Stops Summary */}
                <p className="text-[11px] text-[#1C4D38]/80 font-medium whitespace-pre-line leading-relaxed">
                  {route.stopsSummary}
                </p>

                {/* Days & Today Badge */}
                <div className="space-y-1.5 pt-1 border-t border-[#1C4D38]/10">
                  <p className="text-[10px] text-[#1C4D38]/70 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#1C4D38]/60" />
                    <span>{route.days}</span>
                  </p>

                  {route.isAvailableToday && (
                    <span className="inline-block px-2.5 py-0.5 bg-[#D1EBE1] text-[#1C4D38] text-[9px] font-black rounded-full border border-[#1C4D38]/10">
                      Tersedia hari ini
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* 🗺️ Map Button Card */}
          <div
            onClick={() => setShowMapModal(true)}
            className="p-4 rounded-[22px] bg-[#FAF3E5] hover:bg-[#F2EBDC] border border-[#1C4D38]/15 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#1C4D38] shadow-xs group-hover:scale-110 transition-transform">
              <Map className="w-5 h-5 text-[#1C4D38]" />
            </div>
            <p className="text-xs font-black text-[#1C4D38] font-display">
              Lihat semua rute<br />di peta
            </p>
          </div>
        </div>
      </div>

      {/* 2️⃣ Step 2: Pilih Titik Penyetoran (Halte) & Jadwal */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#1C4D38] text-white font-black text-xs flex items-center justify-center shadow-xs">
            2
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#1C4D38] font-display">
              Pilih Titik Penyetoran (Halte) & Jadwal – {selectedRoute.name}
            </h3>
          </div>
        </div>

        {/* 2 Columns: Halte Selection Grid (Left) + Route Info Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 Cols): Halte Strip & Halte Cards */}
          <div className="lg:col-span-8 space-y-3.5">
            
            {/* Dark Green Strip Header */}
            <div className="bg-[#1C4D38] text-white px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-black shadow-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#66C699]" />
                <span>{selectedRoute.name} • {selectedRoute.stopsSummary ? selectedRoute.stopsSummary.replace('\n', ' • ') : 'Rute Penjemputan'}</span>
              </div>
              <span className="text-[11px] text-white/80 font-bold">
                {selectedRoute.haltes.length} Halte Tersedia
              </span>
            </div>

            {/* Halte Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {selectedRoute.haltes.map((halte) => {
                const isSelected = selectedHalteId === halte.id;
                return (
                  <div
                    key={halte.id}
                    onClick={() => onSelectHalteId(halte.id)}
                    className={`p-4 rounded-[22px] border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/15'
                        : 'bg-white/80 hover:bg-white border-[#1C4D38]/10 shadow-2xs'
                    }`}
                  >
                    {/* Halte Icon & Name */}
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#1C4D38] border border-[#1C4D38]/10">
                        <Trash2 className="w-5 h-5 text-[#1C4D38]" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-[#1C4D38] font-display">
                          {halte.name}
                        </h4>
                        <p className="text-[10px] text-[#1C4D38]/70 font-semibold truncate mt-0.5">
                          {halte.address}
                        </p>
                      </div>
                    </div>

                    {/* Time & Slots Info */}
                    <div className="pt-2 border-t border-[#1C4D38]/10 flex items-center justify-between text-[11px]">
                      <span className="font-black text-[#1C4D38] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{halte.time}</span>
                      </span>
                      <span className="text-[10px] font-bold text-[#1C4D38]/70 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{halte.slots}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column (4 Cols): Informasi Rute Card */}
          <div className="lg:col-span-4 bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-black text-[#1C4D38] font-display border-b border-[#1C4D38]/10 pb-3">
              Informasi {selectedRoute.name}
            </h4>

            <div className="space-y-3 text-xs">
              
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3E5] flex items-center justify-center text-[#1C4D38] shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/60">Estimasi total waktu</p>
                  <p className="font-black text-[#1C4D38]">{selectedRoute.estTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3E5] flex items-center justify-center text-[#1C4D38] shrink-0 mt-0.5">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/60">Jarak total rute</p>
                  <p className="font-black text-[#1C4D38]">{selectedRoute.distance}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3E5] flex items-center justify-center text-[#1C4D38] shrink-0 mt-0.5">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/60">Tipe kendaraan</p>
                  <p className="font-black text-[#1C4D38]">{selectedRoute.truckType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3E5] flex items-center justify-center text-[#1C4D38] shrink-0 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/60">Hari operasional</p>
                  <p className="font-black text-[#1C4D38]">{selectedRoute.days}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FAF3E5] flex items-center justify-center text-[#1C4D38] shrink-0 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#1C4D38]/60">Kapasitas tersedia</p>
                  <p className="font-black text-emerald-700">{selectedRoute.availableSlots} slot tersisa</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 💡 Bottom Tips Banner & Continue Button Row */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 text-xs text-[#1C4D38]/85 font-medium">
          <div className="w-9 h-9 rounded-xl bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <p>
            <strong>Tips:</strong> Sampah yang sudah dipilah akan lebih cepat diproses dan poin yang kamu dapatkan lebih banyak.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-3 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer shrink-0 text-center"
        >
          Lanjutkan Booking
        </button>
      </div>

      {/* 🗺️ Interactive Map Route Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-[#1C4D38]/20">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-[#1C4D38]">Peta Seluruh Jalur Rute SIRKULA</h3>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div className="w-full h-72 bg-[#FAF5ED] rounded-2xl flex items-center justify-center border border-[#1C4D38]/10 relative overflow-hidden">
              <img
                src="/assets/illustrations/spring-leaves-bg.png"
                alt="Map Background"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <MapPin className="w-10 h-10 text-[#1C4D38] animate-bounce" />
                <p className="text-xs font-black text-[#1C4D38]">
                  Jalur Rute Penjemputan Terdekat Aktif
                </p>
                <p className="text-[11px] text-[#1C4D38]/70">
                  Armada penjemputan melayani titik halte bank sampah terintegrasi di wilayah sekitar Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
