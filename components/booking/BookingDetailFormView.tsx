'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Package,
  FileText,
  Boxes,
  Wine,
  Leaf,
  CheckCircle2,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Info,
  ShieldCheck,
  Truck,
  Lightbulb,
} from 'lucide-react';
import { RouteData } from './RouteSelectionView';

interface WasteItemRow {
  category: 'Plastik' | 'Kertas' | 'Logam' | 'Kaca' | 'Organik';
  pricePerKg: number;
  weight: number;
}

const CATEGORY_CONFIG = {
  Plastik: { price: 3000, icon: Package, color: 'border-amber-400 bg-amber-50' },
  Kertas: { price: 1000, icon: FileText, color: 'border-pink-400 bg-pink-50' },
  Logam: { price: 2000, icon: Boxes, color: 'border-emerald-400 bg-emerald-50' },
  Kaca: { price: 800, icon: Wine, color: 'border-lime-400 bg-lime-50' },
  Organik: { price: 200, icon: Leaf, color: 'border-sky-400 bg-sky-50' },
};

interface BookingDetailFormViewProps {
  route: RouteData;
  halteId: string;
  onBack: () => void;
  onConfirmBooking: (bookingSummary: any) => void;
}

export default function BookingDetailFormView({
  route,
  halteId,
  onBack,
  onConfirmBooking,
}: BookingDetailFormViewProps) {
  const currentHalte = route.haltes.find((h) => h.id === halteId) || route.haltes[0];

  const [wasteItems, setWasteItems] = useState<WasteItemRow[]>([
    { category: 'Plastik', pricePerKg: 3000, weight: 1.0 },
    { category: 'Kertas', pricePerKg: 1000, weight: 1.0 },
    { category: 'Organik', pricePerKg: 200, weight: 0.5 },
  ]);

  const [agreedHalte, setAgreedHalte] = useState(true);
  const [agreedSchedule, setAgreedSchedule] = useState(true);
  const [agreedSorted, setAgreedSorted] = useState(true);

  const handleUpdateWeight = (index: number, delta: number) => {
    setWasteItems((prev) => {
      const updated = [...prev];
      const newWeight = Math.max(0.1, Number((updated[index].weight + delta).toFixed(1)));
      updated[index].weight = newWeight;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (wasteItems.length <= 1) return;
    setWasteItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = (cat: 'Plastik' | 'Kertas' | 'Logam' | 'Kaca' | 'Organik') => {
    if (wasteItems.some((w) => w.category === cat)) return;
    setWasteItems((prev) => [
      ...prev,
      { category: cat, pricePerKg: CATEGORY_CONFIG[cat].price, weight: 1.0 },
    ]);
  };

  const totalWeight = Number(wasteItems.reduce((sum, item) => sum + item.weight, 0).toFixed(1));
  const totalValue = wasteItems.reduce((sum, item) => sum + item.weight * item.pricePerKg, 0);
  const earnedPoints = Math.round(totalValue * 0.02);

  const canSubmit = agreedHalte && agreedSchedule && agreedSorted && totalWeight > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirmBooking({
      bookingId: `BK-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}-03`,
      halte: currentHalte,
      route,
      wasteItems,
      totalWeight,
      totalValue,
      earnedPoints,
      pickupDate: 'Senin, 21 Juli 2026',
      pickupTime: currentHalte.time,
      estTime: '09.50 WIB (Tiba di halte ± 5 menit)',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 🧭 Step Progress Breadcrumb */}
      <div className="flex items-center justify-between max-w-xl mx-auto py-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1C4D38] text-white flex items-center justify-center text-xs font-black">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-xs font-bold text-[#1C4D38]">1. Pilih Rute & Halte</span>
        </div>

        <div className="w-12 sm:w-20 h-0.5 bg-[#1C4D38]" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1C4D38] text-white flex items-center justify-center text-xs font-black ring-4 ring-[#1C4D38]/15">
            2
          </div>
          <span className="text-xs font-black text-[#1C4D38]">2. Detail & Konfirmasi</span>
        </div>

        <div className="w-12 sm:w-20 h-0.5 bg-gray-300" />

        <div className="flex items-center gap-2 opacity-50">
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
            3
          </div>
          <span className="text-xs font-bold text-gray-500 hidden sm:inline">3. Pembayaran</span>
        </div>

        <div className="w-12 sm:w-20 h-0.5 bg-gray-300" />

        <div className="flex items-center gap-2 opacity-50">
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
            4
          </div>
          <span className="text-xs font-bold text-gray-500 hidden sm:inline">4. Selesai</span>
        </div>
      </div>

      {/* 📦 Main 2-Column Booking Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Ringkasan Booking + Detail Sampah + Konfirmasi */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Ringkasan Booking Header Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-3">
              <h3 className="text-sm font-black text-[#1C4D38] font-display flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1C4D38]" />
                <span>Ringkasan Booking</span>
              </h3>
              <button
                type="button"
                onClick={onBack}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 px-3 py-1 bg-[#D1EBE1] rounded-lg cursor-pointer"
              >
                Ubah
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">TITIK PENYETORAN</p>
                <p className="font-black text-[#1C4D38] mt-0.5">{currentHalte.name}</p>
                <p className="text-[10px] text-[#1C4D38]/70 truncate">{currentHalte.address}</p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">RUTE</p>
                <span className="inline-block px-2.5 py-0.5 bg-[#D1EBE1] text-[#1C4D38] font-black rounded-md text-[10px] mt-0.5">
                  {route.name}
                </span>
                <p className="text-[10px] text-[#1C4D38]/70 truncate mt-0.5">
                  {route.stopsSummary ? route.stopsSummary.replace('\n', ' • ') : 'Wilayah Sekitar'}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">JADWAL PICKUP</p>
                <p className="font-black text-[#1C4D38] mt-0.5">Kamis, 21 Juli 2026</p>
                <p className="text-[10px] text-emerald-700 font-bold">{currentHalte.time}</p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">ESTIMASI TIBA</p>
                <p className="font-black text-[#1C4D38] mt-0.5">09.50 WIB</p>
                <span className="text-[9px] font-extrabold text-[#9B6A1B] bg-[#FCE39E] px-2 py-0.5 rounded">
                  Tiba di halte ± 5 menit
                </span>
              </div>
            </div>
          </div>

          {/* 2. Detail Sampah Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#1C4D38] font-display flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-[#1C4D38]" />
                <span>Detail Sampah</span>
              </h3>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium mt-0.5">
                Pilih jenis sampah dan masukkan perkiraan berat tiap item yang ingin disetorkan
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {(Object.keys(CATEGORY_CONFIG) as (keyof typeof CATEGORY_CONFIG)[]).map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const IconComponent = cfg.icon;
                const isAdded = wasteItems.some((w) => w.category === cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleAddCategory(cat)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition cursor-pointer ${
                      isAdded
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/10 shadow-xs'
                        : 'border-[#1C4D38]/15 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-4 h-4 text-[#1C4D38]" />
                      {isAdded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#1C4D38]">{cat}</p>
                      <p className="text-[10px] text-[#1C4D38]/60 font-bold">Rp {cfg.price.toLocaleString('id-ID')} / kg</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Waste Weight Rows Table */}
            <div className="space-y-2.5 pt-2">
              <div className="hidden sm:grid grid-cols-12 text-[10px] font-extrabold text-[#1C4D38]/60 px-3 pb-1">
                <div className="col-span-5">JENIS SAMPAH</div>
                <div className="col-span-4 text-center">PERKIRAAN BERAT</div>
                <div className="col-span-3 text-right">PERKIRAAN NILAI</div>
              </div>

              {wasteItems.map((item, idx) => {
                const subtotal = item.weight * item.pricePerKg;
                return (
                  <div
                    key={item.category}
                    className="p-3.5 rounded-2xl bg-[#FAF5ED]/70 border border-[#1C4D38]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    {/* Left: Category Name */}
                    <div className="flex items-center gap-3 sm:col-span-5">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1C4D38] shadow-2xs border border-[#1C4D38]/10">
                        {item.category === 'Plastik' && <Package className="w-4 h-4 text-amber-600" />}
                        {item.category === 'Kertas' && <FileText className="w-4 h-4 text-pink-600" />}
                        {item.category === 'Logam' && <Boxes className="w-4 h-4 text-emerald-600" />}
                        {item.category === 'Kaca' && <Wine className="w-4 h-4 text-lime-600" />}
                        {item.category === 'Organik' && <Leaf className="w-4 h-4 text-sky-600" />}
                      </div>
                      <span className="text-xs font-black text-[#1C4D38]">{item.category}</span>
                    </div>

                    {/* Center: Weight Counter Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateWeight(idx, -0.5)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 border border-[#1C4D38]/20 flex items-center justify-center text-[#1C4D38] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-black text-[#1C4D38] min-w-[50px] text-center">
                        {item.weight} <span className="text-[10px] font-bold text-[#1C4D38]/70">kg</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleUpdateWeight(idx, 0.5)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 border border-[#1C4D38]/20 flex items-center justify-center text-[#1C4D38] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Right: Subtotal & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-xs font-black text-[#1C4D38]">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Estimasi & Poin Summary Card */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/15 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E07A5F]" />
              <span>Estimasi & Poin</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#1C4D38]/10 text-center space-y-0.5 shadow-2xs">
                <p className="text-[10px] font-bold text-[#1C4D38]/60 uppercase">TOTAL BERAT</p>
                <p className="text-lg font-black text-[#1C4D38] font-display">{totalWeight} kg</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#1C4D38]/10 text-center space-y-0.5 shadow-2xs">
                <p className="text-[10px] font-bold text-[#1C4D38]/60 uppercase">ESTIMASI NILAI</p>
                <p className="text-lg font-black text-emerald-800 font-display">Rp {totalValue.toLocaleString('id-ID')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#1C4D38]/10 text-center space-y-0.5 shadow-2xs">
                <p className="text-[10px] font-bold text-[#1C4D38]/60 uppercase">POIN YANG DIDAPAT</p>
                <p className="text-lg font-black text-[#E07A5F] font-display">+{earnedPoints} poin</p>
              </div>
            </div>

            <div className="p-3 bg-[#D1EBE1] rounded-2xl border border-emerald-500/20 text-xs text-[#1C4D38] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-bold">
                Semakin banyak & rutin kamu menyetor sampah, semakin besar poin bonus yang akan kamu kumpulkan!
              </span>
            </div>
          </div>

          {/* 4. Konfirmasi Checkbox Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <h3 className="text-sm font-black text-[#1C4D38] font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1C4D38]" />
                <span>Konfirmasi Persetujuan</span>
              </h3>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                Pastikan informasi sudah benar sebelum booking dikonfirmasi:
              </p>

              <div className="space-y-2 text-xs text-[#1C4D38]/90 font-medium">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedHalte}
                    onChange={(e) => setAgreedHalte(e.target.checked)}
                    className="mt-0.5 rounded text-[#1C4D38] focus:ring-[#1C4D38] cursor-pointer"
                  />
                  <span>Saya akan datang ke halte sampah sesuai jadwal yang dipilih.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedSchedule}
                    onChange={(e) => setAgreedSchedule(e.target.checked)}
                    className="mt-0.5 rounded text-[#1C4D38] focus:ring-[#1C4D38] cursor-pointer"
                  />
                  <span>Saya memahami bahwa jadwal dapat berubah jika ada kendala di lapangan.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedSorted}
                    onChange={(e) => setAgreedSorted(e.target.checked)}
                    className="mt-0.5 rounded text-[#1C4D38] focus:ring-[#1C4D38] cursor-pointer"
                  />
                  <span>Sampah yang saya setorkan sudah dipilah sesuai jenisnya.</span>
                </label>
              </div>
            </div>

            {/* Green Halte Mini Illustration */}
            <div className="w-32 h-28 bg-[#FAF5ED] rounded-2xl flex items-center justify-center p-2 border border-[#1C4D38]/10 shrink-0">
              <img
                src="/assets/illustrations/bank-sampah-icon.png"
                alt="Halte Bank Sampah"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-8 py-3 bg-[#1C4D38] hover:bg-[#143929] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Konfirmasi Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column (4 Cols): Ringkasan Booking Card & Tips SIRKULA */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ringkasan Booking with Mascot Truck Image */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-black text-[#1C4D38] font-display border-b border-[#1C4D38]/10 pb-3">
              Ringkasan Booking
            </h4>

            {/* Truck Image */}
            <div className="w-full h-36 bg-[#FAF5ED] rounded-2xl flex items-center justify-center p-3 border border-[#1C4D38]/10">
              <img
                src="/assets/illustrations/sirkula-truck.png"
                alt="Truk SIRKULA"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1C4D38] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#1C4D38]/60 font-bold">Titik Penyetoran</p>
                  <p className="font-black text-[#1C4D38]">{currentHalte.name}</p>
                  <p className="text-[10px] text-[#1C4D38]/70">{currentHalte.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-[#1C4D38] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#1C4D38]/60 font-bold">Rute</p>
                  <p className="font-black text-[#1C4D38]">{route.name}</p>
                  <p className="text-[10px] text-[#1C4D38]/70">
                    {route.stopsSummary ? route.stopsSummary.replace('\n', ' • ') : 'Wilayah Sekitar'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#1C4D38] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-[#1C4D38]/60 font-bold">Jadwal & Estimasi</p>
                  <p className="font-black text-[#1C4D38]">Kamis, 21 Juli 2026 · {currentHalte.time}</p>
                  <p className="text-[10px] text-emerald-700 font-bold">Estimasi tiba: 09.50 WIB</p>
                </div>
              </div>
            </div>

            {/* Summary Price Lines */}
            <div className="pt-3 border-t border-[#1C4D38]/10 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-[#1C4D38]/80">
                <span>Total Berat:</span>
                <span>{totalWeight} kg</span>
              </div>
              <div className="flex justify-between font-bold text-[#1C4D38]/80">
                <span>Estimasi Nilai:</span>
                <span className="font-black text-emerald-800">Rp {totalValue.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-extrabold text-[#E07A5F] pt-1 border-t border-[#1C4D38]/5">
                <span>Poin yang Didapat:</span>
                <span>+{earnedPoints} poin</span>
              </div>
            </div>
          </div>

          {/* Tips SIRKULA Box */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[28px] p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#9B6A1B]" />
              <span>Tips SIRKULA</span>
            </h4>

            <div className="space-y-2 text-[11px] text-[#1C4D38]/85 font-medium leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Datang 10 menit sebelum jadwal agar proses timbang lebih lancar.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Pastikan sampah sudah dipilah untuk memudahkan petugas.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                <span>Kumpulkan poin dan tukarkan dengan berbagai hadiah menarik!</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
