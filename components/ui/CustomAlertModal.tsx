'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  X,
  Phone,
  MessageCircle,
  Download,
  Mail,
  Share2,
} from 'lucide-react';

export type AlertType = 'success' | 'info' | 'warning' | 'error' | 'contact' | 'download' | 'share';

export interface CustomAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  primaryButtonText?: string;
  btnText?: string;
  onPrimaryAction?: () => void;
}

export default function CustomAlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  primaryButtonText = 'Mengerti',
  btnText,
  onPrimaryAction,
}: CustomAlertModalProps) {
  if (!isOpen) return null;

  const effectiveButtonText = btnText || primaryButtonText;

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    onClose();
  };

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#D1EBE1] text-[#1C4D38] flex items-center justify-center border-2 border-emerald-500/20 shadow-md">
            <CheckCircle2 className="w-7 h-7 text-emerald-700" />
          </div>
        );
      case 'contact':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#D1EBE1] text-[#1C4D38] flex items-center justify-center border-2 border-emerald-500/20 shadow-md">
            <MessageCircle className="w-7 h-7 text-emerald-700" />
          </div>
        );
      case 'download':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#FCE39E]/80 text-[#9B6A1B] flex items-center justify-center border-2 border-[#D9A74E]/30 shadow-md">
            <Download className="w-7 h-7 text-[#8F5E15]" />
          </div>
        );
      case 'share':
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#D1EBE1] text-[#1C4D38] flex items-center justify-center border-2 border-emerald-500/20 shadow-md">
            <Share2 className="w-7 h-7 text-emerald-700" />
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-2xl bg-[#FAF3E5] text-[#1C4D38] flex items-center justify-center border-2 border-[#1C4D38]/15 shadow-md">
            <Info className="w-7 h-7 text-[#1C4D38]" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative text-[#1C4D38] font-sans">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-200 text-[#1C4D38]/70 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Center Icon & Content */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          {renderIcon()}

          <div className="space-y-1 max-w-xs">
            <h3 className="text-base sm:text-lg font-black text-[#1C4D38] font-display">
              {title}
            </h3>
            <p className="text-xs text-[#1C4D38]/80 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="w-full py-3 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer text-center"
          >
            {effectiveButtonText}
          </button>
        </div>

      </div>

    </div>
  );
}
