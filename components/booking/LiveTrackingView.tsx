'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  RefreshCw,
  Phone,
  MessageSquare,
  AlertCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import CustomAlertModal, { AlertType } from '@/components/ui/CustomAlertModal';

interface LiveTrackingViewProps {
  bookingData: any;
  onBackToBooking: () => void;
}

export default function LiveTrackingView({
  bookingData,
  onBackToBooking,
}: LiveTrackingViewProps) {
  const [truckDistance, setTruckDistance] = useState(2.4);
  const [truckTimeMinutes, setTruckTimeMinutes] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    btnText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const bookingCode = bookingData?.bookingId || 'BK-210726-03';
  const halteName = bookingData?.halte?.name || bookingData?.userAddress?.split(',')[0] || 'Bank Sampah Terdekat';
  const halteAddress = bookingData?.halte?.address || bookingData?.userAddress || 'Area Halte Terdekat Anda';

  const trackingSteps = [
    {
      id: 'step-1',
      title: 'Booking Dikonfirmasi',
      desc: 'Booking berhasil dikonfirmasi oleh sistem SIRKULA.',
      time: '21 Jul 2026 - 08.00 WIB',
      done: true,
    },
    {
      id: 'step-2',
      title: 'Truk Berangkat',
      desc: 'Truk pengangkut memulai perjalanan dari depot pusat.',
      time: '21 Jul 2026 - 08.45 WIB',
      done: true,
    },
    {
      id: 'step-3',
      title: 'Dalam Perjalanan',
      desc: `Truk sedang menuju ke titik ${halteName} rute Anda.`,
      time: '21 Jul 2026 - 09.10 WIB',
      active: true,
      done: true,
      etaBadge: 'Estimasi tiba 09.30 WIB · Tiba di halte ± 5 menit',
    },
    {
      id: 'step-4',
      title: 'Tiba di Halte (Bank Sampah)',
      desc: `Truk tiba di ${halteName} untuk memproses serah terima.`,
      time: 'Menunggu',
      done: false,
    },
    {
      id: 'step-5',
      title: 'Sampah Diserahkan & Verifikasi',
      desc: 'Sampah ditimbang, diverifikasi, dan poin ditambahkan ke akunmu.',
      time: 'Menunggu',
      done: false,
    },
    {
      id: 'step-6',
      title: 'Selesai',
      desc: 'Transaksi setoran selesai dan tercatat di portofolio Jejak Hijau.',
      time: 'Menunggu',
      done: false,
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTruckDistance((prev) => Math.max(0.8, Number((prev - 0.3).toFixed(1))));
      setTruckTimeMinutes((prev) => Math.max(2, prev - 1));
      setIsRefreshing(false);
      setAlertState({
        isOpen: true,
        title: 'Posisi Truk Diperbarui!',
        message: 'GPS armada terhubung real-time. Truk sedang bergerak mendekati halte penjemputanmu.',
        type: 'info',
        btnText: 'Tutup',
      });
    }, 600);
  };

  const handleViewInvoice = () => {
    setAlertState({
      isOpen: true,
      title: 'Invoice Penjemputan Digital',
      message: `Salinan resmi invoice untuk Booking ${bookingCode} telah dikirim ke email terdaftar Anda. Anda juga dapat melihatnya di menu Riwayat.`,
      type: 'success',
      btnText: 'Mengerti',
    });
  };

  const handleContactDriver = () => {
    setAlertState({
      isOpen: true,
      title: 'Kontak Driver Penjemput',
      message: 'Driver armada: Pak Budi (Truk SIRKULA #03). Hubungi via telepon atau WhatsApp: +62 857-9876-5432.',
      type: 'contact',
      btnText: 'Hubungi Driver',
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 🌿 Top Header Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1C4D38]/10">
        <button
          type="button"
          onClick={onBackToBooking}
          className="flex items-center gap-2 text-xs font-black text-[#1C4D38] hover:text-[#2A664C] transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-base sm:text-lg font-display">Lihat Tracking</span>
        </button>

        <p className="text-xs text-[#1C4D38]/70 font-medium hidden sm:block">
          Pantau perjalanan truk menuju titik penyetoranmu secara real-time.
        </p>
      </div>

      {/* 🚚 Big Banner Status Perjalanan */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Status Info */}
        <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
          <span className="px-3.5 py-1 bg-[#D1EBE1] text-[#1C4D38] text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-500/20 inline-block">
            DALAM PERJALANAN
          </span>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1C4D38] font-display leading-tight">
            Truk sedang menuju {halteName}
          </h2>

          <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
            Mohon menunggu di lokasi titik penyetoran rute kamu, ya!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs">
            <div className="bg-white px-3.5 py-2 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
              <p className="text-[10px] text-[#1C4D38]/60 font-bold">ESTIMASI TIBA</p>
              <p className="font-black text-[#1C4D38] text-sm">09.30 WIB</p>
            </div>

            <div className="bg-white px-3.5 py-2 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
              <p className="text-[10px] text-[#1C4D38]/60 font-bold">JALUR RUTE</p>
              <p className="font-black text-emerald-800 text-sm">{bookingData?.route?.name || 'Route 03'} (Terdekat)</p>
            </div>
          </div>
        </div>

        {/* Right Illustration: Truck in Green Nature */}
        <div className="w-56 sm:w-64 h-36 sm:h-40 bg-white/90 rounded-2xl flex items-center justify-center p-3 border border-[#1C4D38]/10 shadow-2xs shrink-0 z-10">
          <img
            src="/assets/illustrations/sirkula-truck.png"
            alt="Truk Perjalanan"
            className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

      </div>

      {/* 2-Column Tracking Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Progress Status Penjemputan Timeline */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-[#1C4D38]/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-base font-black text-[#1C4D38] font-display border-b border-[#1C4D38]/10 pb-3">
              Progress Status Penjemputan
            </h3>

            {/* Stepper Vertical List */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-600/30">
              {trackingSteps.map((step) => {
                return (
                  <div key={step.id} className="relative space-y-1">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-2xs ${
                        step.active
                          ? 'bg-[#1C4D38] text-white ring-4 ring-[#1C4D38]/20 animate-pulse'
                          : step.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-400 border-gray-300'
                      }`}
                    >
                      {step.done ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-xs sm:text-sm font-black font-display ${
                        step.active ? 'text-[#1C4D38]' : step.done ? 'text-[#1C4D38]' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#1C4D38]/60">
                        {step.time}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-relaxed font-medium ${
                      step.active ? 'text-[#1C4D38]/90' : step.done ? 'text-[#1C4D38]/70' : 'text-gray-400'
                    }`}>
                      {step.desc}
                    </p>

                    {step.etaBadge && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D1EBE1] text-[#1C4D38] text-[10px] font-black rounded-lg border border-emerald-500/20">
                          <Clock className="w-3 h-3 text-emerald-700" />
                          <span>{step.etaBadge}</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Informasi Penting Sebelum Truk Tiba Card */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-2xl p-5 space-y-2 shadow-2xs">
            <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-2">
              <Info className="w-4 h-4 text-[#9B6A1B]" />
              <span>Informasi Penting Sebelum Truk Tiba</span>
            </h4>
            <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-relaxed">
              Petugas pengangkut SIRKULA akan segera tiba. Pastikan sampah daur ulang kamu sudah dipilah berdasarkan jenisnya (plastik, kertas, logam, dll) dan mudah diakses untuk mempercepat proses penyerahan.
            </p>
          </div>

        </div>

        {/* Right Column (5 Cols): Detail Booking & Live Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detail Booking Info Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">Detail Booking</h4>
              <span className="text-[11px] font-mono font-black text-[#1C4D38] bg-[#FAF5ED] px-2.5 py-0.5 rounded-lg border border-[#1C4D38]/10">
                {bookingCode}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">BANK SAMPAH TUJUAN</p>
                <p className="font-black text-[#1C4D38] mt-0.5">{halteName}</p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">ALAMAT PENYETORAN</p>
                <p className="font-semibold text-[#1C4D38]/80 mt-0.5">{halteAddress}</p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">JALUR PENJEMPUTAN</p>
                <p className="font-semibold text-[#1C4D38]/80 mt-0.5">
                  {bookingData?.route?.name || 'Route 03'} ({bookingData?.route?.stopsSummary ? bookingData.route.stopsSummary.replace('\n', ' • ') : 'Wilayah Sekitar'})
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">JADWAL PENJEMPUTAN</p>
                <p className="font-bold text-emerald-800 mt-0.5">Senin, 21 Juli 2026, 09.30 WIB</p>
              </div>

              <div>
                <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">METODE PENGAMBILAN</p>
                <p className="font-semibold text-[#1C4D38]/80 mt-0.5">Datang langsung ke titik bank sampah</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1C4D38]/10">
              <button
                type="button"
                onClick={handleViewInvoice}
                className="text-[11px] font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Invoice Detail</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 🗺️ Live Map Tracking Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Lokasi Truk Saat Ini</span>
              </h4>

              <button
                type="button"
                onClick={handleRefresh}
                className="text-[10px] font-bold text-[#1C4D38] bg-[#FAF5ED] hover:bg-[#F2EBDC] px-2.5 py-1 rounded-lg border border-[#1C4D38]/10 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Perbarui</span>
              </button>
            </div>

            {/* Map Visual Representation with Truck Animation */}
            <div className="w-full h-48 bg-[#EAF2ED] rounded-2xl border border-[#1C4D38]/15 relative overflow-hidden flex items-center justify-center shadow-inner">
              <svg className="w-full h-full object-cover opacity-60" viewBox="0 0 400 200">
                <path d="M 20 100 Q 100 40 180 120 T 320 80 T 380 140" fill="none" stroke="#D1EBE1" strokeWidth="24" strokeLinecap="round" />
                <path d="M 20 100 Q 100 40 180 120 T 320 80 T 380 140" fill="none" stroke="#66C699" strokeWidth="8" strokeLinecap="round" strokeDasharray="6 4" />
                <circle cx="340" cy="90" r="12" fill="#E07A5F" fillOpacity="0.3" />
                <circle cx="340" cy="90" r="6" fill="#E07A5F" />
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce duration-1000">
                <div className="w-9 h-9 rounded-full bg-[#1C4D38] text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-black bg-[#1C4D38] text-white px-2 py-0.5 rounded-full mt-1 shadow-xs">
                  Truk SIRKULA
                </span>
              </div>

              <div className="absolute top-14 right-12 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#E07A5F] text-white flex items-center justify-center shadow-md border-2 border-white">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-black bg-[#E07A5F] text-white px-1.5 py-0.5 rounded-full mt-0.5">
                  Halte Tujuan
                </span>
              </div>
            </div>

            {/* Live Distance & ETA */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
              <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#1C4D38]/10">
                <p className="text-[10px] text-[#1C4D38]/60 font-bold">JARAK KE TUJUAN</p>
                <p className="text-sm font-black text-[#1C4D38] mt-0.5">{truckDistance} km</p>
              </div>

              <div className="p-3 bg-[#FAF5ED] rounded-xl border border-[#1C4D38]/10">
                <p className="text-[10px] text-[#1C4D38]/60 font-bold">PERKIRAAN WAKTU</p>
                <p className="text-sm font-black text-emerald-800 mt-0.5">{truckTimeMinutes} menit lagi</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 📞 Bottom Contact Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1C4D38]/10">
        <p className="text-xs text-[#1C4D38]/70 font-medium text-center sm:text-left">
          Butuh bantuan? Silakan hubungi pusat layanan operasional kami.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToBooking}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-xs transition cursor-pointer"
          >
            Kembali ke Booking Saya
          </button>

          <button
            type="button"
            onClick={handleContactDriver}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Hubungi Driver</span>
          </button>
        </div>
      </div>

      {/* 🌟 Custom SIRKULA Alert Modal */}
      <CustomAlertModal
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        primaryButtonText={alertState.btnText || 'Mengerti'}
      />

    </div>
  );
}
