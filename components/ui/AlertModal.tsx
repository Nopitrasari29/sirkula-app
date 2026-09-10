'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, X, ArrowRight } from 'lucide-react';

export interface AlertModalProps {
  isOpen: boolean;
  type?: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  onClose: () => void;
}

export default function AlertModal({
  isOpen,
  type = 'warning',
  title,
  message,
  confirmText = 'Mengerti',
  onConfirm,
  onClose,
}: AlertModalProps) {
  if (!isOpen) return null;

  const handleAction = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
      case 'success':
        return <CheckCircle2 className="w-8 h-8 text-[#1C4D38]" />;
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-[#D9A74E]" />;
      default:
        return <AlertCircle className="w-8 h-8 text-[#1C4D38]" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-[#D6E6C5]/50 border-[#1C4D38]/20';
      case 'warning':
        return 'bg-[#F9EED3] border-[#D9A74E]/30';
      default:
        return 'bg-[#F4F2E9] border-[#1C4D38]/20';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border ${getBgColor()} transition-all transform scale-100 animate-scale-up text-center space-y-5`}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#1C4D38]/50 hover:text-[#1C4D38] rounded-full hover:bg-black/5 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Badge */}
        <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-md border border-[#1C4D38]/10 flex items-center justify-center">
          {getIcon()}
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-[#1C4D38] font-display">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleAction}
            className="w-full py-3 bg-[#1C4D38] hover:bg-[#143929] text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{confirmText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
