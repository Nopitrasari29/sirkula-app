'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  MapPin,
  Calendar,
  Clock,
  Truck,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  QrCode,
  Share2,
  Check,
} from 'lucide-react';
import CustomAlertModal, { AlertType } from '@/components/ui/CustomAlertModal';

interface BookingSuccessViewProps {
  bookingData: any;
  onViewTracking: () => void;
  onNewBooking: () => void;
}

export default function BookingSuccessView({
  bookingData,
  onViewTracking,
  onNewBooking,
}: BookingSuccessViewProps) {
  const bookingCode = bookingData?.id || bookingData?.bookingId || 'BK-210726-03';
  const halteName = bookingData?.halte?.name || bookingData?.userAddress?.split(',')[0] || 'Bank Sampah Terdekat';
  const halteAddress = bookingData?.halte?.address || bookingData?.userAddress || 'Area Penjemputan Terdekat';
  const pickupDate = bookingData?.pickupDate || 'Senin, 21 Juli 2026';
  const pickupTime = bookingData?.pickupTime || '09.30 WIB - 09.50 WIB';

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

  const handleDownloadCode = () => {
    setAlertState({
      isOpen: true,
      title: 'Kode Booking Berhasil Diunduh!',
      message: `Kode ${bookingCode} dan QR Code telah disimpan ke perangkat Anda. Tunjukkan kode ini saat penjemputan sampah.`,
      type: 'download',
      btnText: 'Tutup & Simpan',
    });
  };

  const handleContactCS = () => {
    setAlertState({
      isOpen: true,
      title: 'Customer Service SIRKULA',
      message: 'Layanan bantuan resmi SIRKULA siap melayanimu via WhatsApp di +62 812-3456-7890 (Jam Operasional: 08.00 - 17.00 WIB).',
      type: 'contact',
      btnText: 'Buka WhatsApp',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 🎉 Top Success Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#D1EBE1] text-[#1C4D38] text-xs font-black rounded-full border border-emerald-500/20 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Pesanan Berhasil</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1C4D38] font-display">
          Booking Berhasil!
        </h2>
        <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium max-w-lg mx-auto">
          Sampahmu akan membantu menciptakan lingkungan yang lebih bersih dan berkelanjutan.
        </p>
      </div>

      {/* 2-Column Success Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): QR Code Big Card + Detail Booking */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* QR Code Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[32px] p-6 sm:p-8 text-center space-y-5 shadow-xs">
            <div>
              <p className="text-[10px] font-black text-[#1C4D38]/60 uppercase tracking-widest">
                KODE BOOKING
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1C4D38] font-display tracking-tight mt-0.5">
                {bookingCode}
              </h3>
              <p className="text-xs text-[#1C4D38]/70 font-medium mt-1">
                Tunjukkan kode booking ini kepada petugas saat penjemputan.
              </p>
            </div>

            {/* QR Code Canvas Representation */}
            <div className="w-48 h-48 mx-auto bg-[#FAF5ED] p-4 rounded-3xl border border-[#1C4D38]/10 flex flex-col items-center justify-center space-y-2 shadow-inner">
              <div className="w-36 h-36 bg-white p-2 rounded-2xl flex items-center justify-center border border-[#1C4D38]/15 shadow-2xs">
                {/* SVG QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#1C4D38] fill-current">
                  <rect x="10" y="10" width="25" height="25" rx="3" fill="#1C4D38" />
                  <rect x="15" y="15" width="15" height="15" rx="2" fill="white" />
                  <rect x="18" y="18" width="9" height="9" rx="1" fill="#1C4D38" />
                  
                  <rect x="65" y="10" width="25" height="25" rx="3" fill="#1C4D38" />
                  <rect x="70" y="15" width="15" height="15" rx="2" fill="white" />
                  <rect x="73" y="18" width="9" height="9" rx="1" fill="#1C4D38" />
                  
                  <rect x="10" y="65" width="25" height="25" rx="3" fill="#1C4D38" />
                  <rect x="15" y="70" width="15" height="15" rx="2" fill="white" />
                  <rect x="18" y="73" width="9" height="9" rx="1" fill="#1C4D38" />
                  
                  <rect x="42" y="15" width="14" height="6" rx="1" fill="#1C4D38" />
                  <rect x="42" y="28" width="8" height="12" rx="1" fill="#1C4D38" />
                  <rect x="55" y="25" width="6" height="18" rx="1" fill="#1C4D38" />
                  <rect x="40" y="45" width="20" height="20" rx="2" fill="#1C4D38" />
                  <rect x="45" y="50" width="10" height="10" rx="1" fill="white" />
                  <rect x="68" y="45" width="18" height="8" rx="1" fill="#1C4D38" />
                  <rect x="75" y="58" width="12" height="18" rx="1" fill="#1C4D38" />
                  <rect x="40" y="72" width="10" height="15" rx="1" fill="#1C4D38" />
                  <rect x="55" y="70" width="15" height="8" rx="1" fill="#1C4D38" />
                  <rect x="55" y="82" width="8" height="8" rx="1" fill="#1C4D38" />
                </svg>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadCode}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Kode Booking</span>
              </button>

              <button
                type="button"
                onClick={onViewTracking}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#E07A5F] hover:bg-[#d4684d] text-white text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Truck className="w-4 h-4" />
                <span>Lihat Live Tracking Truk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detail Booking Info Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-black text-[#1C4D38] font-display border-b border-[#1C4D38]/10 pb-3">
              Detail Booking
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] flex items-center justify-center text-[#1C4D38] shrink-0 border border-[#1C4D38]/10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">TITIK PENYETORAN</p>
                  <p className="font-black text-[#1C4D38] mt-0.5">{halteName}</p>
                  <p className="text-[10px] text-[#1C4D38]/70">{halteAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] flex items-center justify-center text-[#1C4D38] shrink-0 border border-[#1C4D38]/10">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">RUTE PENJEMPUTAN</p>
                  <span className="inline-block px-2.5 py-0.5 bg-[#D1EBE1] text-[#1C4D38] font-black rounded text-[10px] mt-0.5">
                    {bookingData?.route?.name || 'Route Terdekat'}
                  </span>
                  <p className="text-[10px] text-[#1C4D38]/70 mt-0.5">
                    {bookingData?.route?.stopsSummary ? bookingData.route.stopsSummary.replace('\n', ' • ') : 'Wilayah Sekitar'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] flex items-center justify-center text-[#1C4D38] shrink-0 border border-[#1C4D38]/10">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">JADWAL PICKUP & ESTIMASI TIBA</p>
                  <p className="font-black text-[#1C4D38] mt-0.5">{pickupDate}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold text-[#1C4D38]">{pickupTime}</span>
                    <span className="text-[9px] font-black text-[#9B6A1B] bg-[#FCE39E] px-2 py-0.5 rounded">
                      Tiba di halte ± 5 menit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols): Next Steps & Help */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Metode Pengambilan Box */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-2 shadow-xs">
            <p className="text-[10px] font-bold text-[#1C4D38]/60 uppercase">METODE PENGAMBILAN</p>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-2xl bg-[#D1EBE1] flex items-center justify-center text-[#1C4D38] shrink-0">
                <MapPin className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <p className="text-xs font-black text-[#1C4D38]">Datang ke bank sampah</p>
                <p className="text-[10px] text-[#1C4D38]/70 font-medium">Bawa sampah terpilahmu secara mandiri</p>
              </div>
            </div>
          </div>

          {/* Terima Kasih Banner */}
          <div className="bg-[#D1EBE1] border border-emerald-500/20 rounded-[28px] p-5 space-y-1 shadow-xs">
            <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Terima kasih sudah berkontribusi!</span>
            </h4>
            <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-relaxed">
              Setiap langkah kecilmu berdampak besar bagi kebersihan dan kelestarian bumi kita.
            </p>
          </div>

          {/* Apa Selanjutnya Stepper */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h4 className="text-xs font-black text-[#1C4D38] font-display">
              Apa selanjutnya?
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <p className="font-black text-[#1C4D38]">Booking Dikonfirmasi</p>
                  <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-tight mt-0.5">
                    Pesananmu telah berhasil diterima oleh sistem.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FAF5ED] border border-[#1C4D38]/20 text-[#1C4D38] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                  2
                </div>
                <div>
                  <p className="font-black text-[#1C4D38]">Menunggu Penjemputan</p>
                  <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-tight mt-0.5">
                    Bawa sampah ke halte terdekat sesuai jadwal rute pickup.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FAF5ED] border border-[#1C4D38]/20 text-[#1C4D38] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                  3
                </div>
                <div>
                  <p className="font-black text-[#1C4D38]">Sampah Diserahkan</p>
                  <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-tight mt-0.5">
                    Petugas akan menimbang dan mencatat sampah terpilahmu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FAF5ED] border border-[#1C4D38]/20 text-[#1C4D38] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                  4
                </div>
                <div>
                  <p className="font-black text-[#1C4D38]">Selesai & Dapat Poin</p>
                  <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-tight mt-0.5">
                    Poin akan otomatis ditambahkan ke portofolio jejak hijaumu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Butuh Bantuan Card */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[28px] p-5 space-y-3 shadow-xs">
            <div>
              <h4 className="text-xs font-black text-[#1C4D38]">Butuh Bantuan?</h4>
              <p className="text-[10px] text-[#1C4D38]/70 font-medium mt-0.5">
                Hubungi CS SIRKULA jika kamu memiliki pertanyaan seputar jadwal rute atau mengalami kendala teknis.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContactCS}
              className="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi CS Sirkula</span>
            </button>
          </div>

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
