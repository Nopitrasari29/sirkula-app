'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  Navigation,
  Package,
  FileText,
  Boxes,
  Wine,
  Leaf,
  Heart,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import { BankSampahItem } from './BankSampahListTable';
import { getFavoriteBankSampah, toggleFavoriteBankSampah } from '@/lib/utils/storage';
import CustomAlertModal, { AlertType } from '@/components/ui/CustomAlertModal';

interface BankSampahDetailCardProps {
  selectedBank: BankSampahItem;
}

export default function BankSampahDetailCard({
  selectedBank,
}: BankSampahDetailCardProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
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

  useEffect(() => {
    setFavorites(getFavoriteBankSampah());
    const onStorage = () => setFavorites(getFavoriteBankSampah());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFavorite = favorites.includes(selectedBank.id);

  const handleToggleFavorite = () => {
    const updated = toggleFavoriteBankSampah(selectedBank.id);
    setFavorites(updated);
  };

  const handleContactMitra = () => {
    setAlertState({
      isOpen: true,
      title: `Hubungi ${selectedBank.name}`,
      message: `Kontak resmi operasional:\n• Telepon/WhatsApp: +62 813-8821-4920\n• Jam Pelayanan: ${selectedBank.hours}\n• Alamat: ${selectedBank.address}`,
      type: 'contact',
      btnText: 'Tutup & Salin Kontak',
    });
  };

  // Styling Lingkaran Pastel untuk 5 Kategori Sampah (Presisi Figma)
  const renderCategoryPill = (typeName: string) => {
    switch (typeName) {
      case 'Plastik':
        return {
          icon: <Package className="w-4 h-4 text-amber-600" />,
          bg: 'bg-amber-100/90 border-amber-200',
        };
      case 'Kertas':
        return {
          icon: <FileText className="w-4 h-4 text-pink-600" />,
          bg: 'bg-pink-100/90 border-pink-200',
        };
      case 'Logam':
        return {
          icon: <Boxes className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-100/90 border-emerald-200',
        };
      case 'Kaca':
        return {
          icon: <Wine className="w-4 h-4 text-lime-600" />,
          bg: 'bg-lime-100/90 border-lime-200',
        };
      case 'Organik':
        return {
          icon: <Leaf className="w-4 h-4 text-sky-600" />,
          bg: 'bg-sky-100/90 border-sky-200',
        };
      default:
        return {
          icon: <Package className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-100/90 border-emerald-200',
        };
    }
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${selectedBank.name} ${selectedBank.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div id="bank-sampah-detail" className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-6 space-y-5 shadow-xs sticky top-4">

      {/* Header Row: Title & Favorite Button */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-black text-[#1C4D38] font-display">
          {selectedBank.name}
        </h2>
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full border transition cursor-pointer active:scale-90 shadow-2xs ${
            isFavorite
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
          }`}
          title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          aria-label="Toggle Favorit"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Building Illustration (Raw without card background - Prominent & Large) */}
      <div className="w-full h-56 flex items-center justify-center py-2">
        <img
          src="/assets/illustrations/bank-sampah-icon.png"
          alt={selectedBank.name}
          className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 3 Metric Badges Box */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/90 p-2.5 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
          <p className="text-xs font-black text-[#1C4D38] flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#1C4D38]" />
            <span>{selectedBank.distance}</span>
          </p>
          <p className="text-[10px] text-[#1C4D38]/70 font-bold mt-0.5">
            {selectedBank.timeEstimate || '5 menit'}
          </p>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
          <p className="text-xs font-black text-[#1C4D38] flex items-center justify-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#D9A74E] text-[#D9A74E]" />
            <span>{selectedBank.rating}</span>
          </p>
          <p className="text-[10px] text-[#1C4D38]/70 font-bold mt-0.5">
            ({selectedBank.reviews || '124'} ulasan)
          </p>
        </div>

        <div className="bg-white/90 p-2.5 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
          <p className="text-xs font-black text-[#1C4D38] flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#1C4D38]" />
            <span>{selectedBank.hours || '08.00 - 16.00'}</span>
          </p>
          <p className="text-[10px] text-[#1C4D38]/70 font-bold mt-0.5">
            {selectedBank.days || 'Senin - Sabtu'}
          </p>
        </div>
      </div>

      {/* Jenis Sampah yang Diterima */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#1C4D38]">
          Jenis Sampah yang Diterima
        </h3>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {selectedBank.acceptedTypes.map((type) => {
            const style = renderCategoryPill(type.name);
            return (
              <div key={type.name} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`w-10 h-10 rounded-full ${style.bg} border flex items-center justify-center shadow-2xs`}>
                  {style.icon}
                </div>
                <span className="text-[10px] font-bold text-[#1C4D38]">
                  {type.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tentang Bank Sampah */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-xs font-extrabold text-[#1C4D38]">
          Tentang Bank Sampah
        </h3>
        <p className="text-[11px] text-[#1C4D38]/85 font-medium leading-relaxed">
          {selectedBank.description ||
            'Menerima berbagai jenis sampah anorganik, organik, dan B3 rumah tangga. Mari kelola sampah dan dapatkan nilai serta poin dari setiap setoranmu!'}
        </p>
      </div>

      {/* Location & Operating Hours Details */}
      <div className="space-y-2 pt-2 border-t border-[#1C4D38]/10 text-xs">
        <p className="flex items-start gap-2 font-bold text-[#1C4D38]">
          <MapPin className="w-4 h-4 shrink-0 text-[#1C4D38] mt-0.5" />
          <span>{selectedBank.address}</span>
        </p>
        <p className="flex items-center justify-between text-xs font-bold text-[#1C4D38] pt-1">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-[#1C4D38]" />
            <span>{selectedBank.days || 'Senin - Sabtu'}</span>
          </span>
          <span className="text-[#1C4D38]/80 font-semibold">{selectedBank.hours || '08.00 - 16.00'}</span>
        </p>
      </div>

      {/* 3 Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <Link
          href={`/booking?bankId=${selectedBank.id}&bankName=${encodeURIComponent(selectedBank.name)}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-2xl shadow-md transition transform active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>Buat Booking Penjemputan</span>
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDirections}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold rounded-2xl transition shadow-2xs active:scale-95 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 rotate-45" />
            <span>Petunjuk Arah</span>
          </button>

          <button
            type="button"
            onClick={handleContactMitra}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#FAF5ED] hover:bg-emerald-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold rounded-2xl transition shadow-2xs active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>Hubungi Mitra</span>
          </button>
        </div>
      </div>

      {/* Custom Alert Modal for Contact info */}
      <CustomAlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        btnText={alertState.btnText}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}