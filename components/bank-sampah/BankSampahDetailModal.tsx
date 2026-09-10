'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  MapPin,
  Star,
  Clock,
  Navigation,
  Calendar,
  Package,
  FileText,
  Boxes,
  Wine,
  Leaf,
  PhoneCall,
} from 'lucide-react';
import { BankSampahItem } from './BankSampahListTable';
import CustomAlertModal, { AlertType } from '@/components/ui/CustomAlertModal';

interface BankSampahDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: BankSampahItem | null;
}

export default function BankSampahDetailModal({
  isOpen,
  onClose,
  bank,
}: BankSampahDetailModalProps) {
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

  if (!isOpen || !bank) return null;

  const handleContactMitra = () => {
    setAlertState({
      isOpen: true,
      title: `Hubungi ${bank.name}`,
      message: `Kontak resmi operasional:\n• Telepon/WhatsApp: +62 813-8821-4920\n• Jam Pelayanan: ${bank.hours}\n• Alamat: ${bank.address}`,
      type: 'contact',
      btnText: 'Tutup & Salin Kontak',
    });
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${bank.name} ${bank.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Card Box */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden text-[#1C4D38] font-sans max-h-[90vh] flex flex-col">
        
        {/* Header Close Row */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C4D38]/10 shrink-0">
          <h3 className="text-lg font-black text-[#1C4D38] font-display">
            Detail Bank Sampah
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-[#1C4D38]/70 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          
          {/* Bank Title & Illustration */}
          <div className="text-center space-y-3">
            <h2 className="text-xl font-black text-[#1C4D38] font-display">
              {bank.name}
            </h2>

            <div className="w-full h-44 flex items-center justify-center">
              <img
                src="/assets/illustrations/bank-sampah-icon.png"
                alt={bank.name}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
          </div>

          {/* 3 Metric Badges Box */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/90 p-2.5 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
              <p className="text-xs font-black text-[#1C4D38] flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#1C4D38]" />
                <span>{bank.distance}</span>
              </p>
              <p className="text-[10px] text-[#1C4D38]/70 font-bold mt-0.5">
                {bank.timeEstimate || '5 menit'}
              </p>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
              <p className="text-xs font-black text-[#1C4D38] flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#D9A74E] text-[#D9A74E]" />
                <span>{bank.rating}</span>
              </p>
              <p className="text-[10px] text-[#1C4D38]/70 font-bold mt-0.5">
                ({bank.reviews || '124'} ulasan)
              </p>
            </div>

            <div className="bg-white/90 p-2.5 rounded-xl border border-[#1C4D38]/10 shadow-2xs">
              <p className="text-xs font-black text-[#1C4D38] flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#1C4D38]" />
                <span>{bank.hours || '08.00 - 16.00'}</span>
              </p>
              <p className="text-[10px] text-[#1C4D38]/70 font-bold mt-0.5">
                {bank.days || 'Senin - Sabtu'}
              </p>
            </div>
          </div>

          {/* Accepted Waste Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-[#1C4D38]">
              Jenis Sampah yang Diterima
            </h4>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {bank.acceptedTypes?.map((type) => {
                const style = renderCategoryPill(type.name);
                return (
                  <div key={type.name} className="flex flex-col items-center gap-1 shrink-0">
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

          {/* Description & Address */}
          <div className="space-y-2 pt-1 border-t border-[#1C4D38]/10 text-xs">
            <p className="text-[11px] text-[#1C4D38]/85 font-medium leading-relaxed">
              {bank.description ||
                'Menerima berbagai jenis sampah anorganik, organik, dan B3 rumah tangga. Mari kelola sampah dan dapatkan nilai serta poin dari setiap setoranmu!'}
            </p>
            <p className="flex items-start gap-2 font-bold text-[#1C4D38] pt-1">
              <MapPin className="w-4 h-4 shrink-0 text-[#1C4D38] mt-0.5" />
              <span>{bank.address}</span>
            </p>
          </div>

        </div>

        {/* Footer Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-[#1C4D38]/10 shrink-0">
          <Link
            href={`/booking?bankId=${bank.id}&bankName=${encodeURIComponent(bank.name)}`}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-2xl shadow-md transition transform active:scale-95 text-center"
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
