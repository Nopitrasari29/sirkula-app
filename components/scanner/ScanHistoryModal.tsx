'use client';

import React from 'react';
import { X, Calendar, RotateCcw, ChevronRight } from 'lucide-react';
import { getScanHistory } from '@/lib/utils/storage';
import { WasteScanResult } from '@/lib/types';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScan?: (scan: WasteScanResult) => void;
}

export default function ScanHistoryModal({ isOpen, onClose, onSelectScan }: ScanHistoryModalProps) {
  if (!isOpen) return null;

  const history = getScanHistory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden text-[#1C4D38] font-sans max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C4D38]/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1C4D38] text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1C4D38] font-display">
                Riwayat Pemindaian
              </h3>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                Daftar sampah yang telah kamu pindai
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-[#1C4D38]/70 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-[#1C4D38]/60 space-y-2">
              <p>Belum ada riwayat pemindaian sampah.</p>
              <p className="text-[11px]">Coba pindai sampah pertamamu sekarang!</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onSelectScan) onSelectScan(item);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-white/80 border border-[#1C4D38]/10 shadow-2xs flex items-center justify-between gap-4 hover:bg-white transition cursor-pointer group"
              >
                {/* Left: Thumbnail / Icon + Name */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-[#FCE39E]/80 border border-[#1C4D38]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h4 className="text-xs font-black text-[#1C4D38] font-display truncate">
                      {item.name || item.itemName || 'Sampah Anorganik'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2.5 py-0.5 bg-[#FCE39E] text-[10px] font-extrabold text-[#1C4D38] rounded-full border border-[#1C4D38]/10">
                        {item.category || item.categoryName || 'Plastik'}
                      </span>
                      <span className="text-[10px] font-semibold text-[#1C4D38]/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.timestamp || 'Baru saja'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Value & Arrow */}
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <p className="text-xs font-black text-[#1C4D38]">
                      Rp {(item.estimatedPricePerKg || 2000).toLocaleString('id-ID')}/kg
                    </p>
                    <p className="text-[10px] font-extrabold text-[#E07A5F]">
                      +{item.earnedPoints || 50} poin
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#1C4D38]/50 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Button */}
        <div className="pt-2 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-[#1C4D38] text-[#1C4D38] text-xs font-extrabold rounded-xl transition shadow-2xs hover:bg-gray-50 active:scale-95 text-center cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  );
}
