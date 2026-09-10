'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';
import { getUserProfile, updateUserPassword } from '@/lib/utils/storage';
import CustomAlertModal from '@/components/ui/CustomAlertModal';

export default function AccountSecurityCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Alert Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    setLang(getCurrentLanguage());
  }, []);

  const t = translations[lang] || translations.id;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setModalConfig({
        isOpen: true,
        title: 'Formulir Belum Lengkap',
        message: 'Silakan masukkan password baru dan konfirmasi password.',
        type: 'info',
      });
      return;
    }

    if (newPassword.length < 6) {
      setModalConfig({
        isOpen: true,
        title: 'Password Terlalu Pendek',
        message: 'Password baru minimal harus terdiri dari 6 karakter.',
        type: 'info',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalConfig({
        isOpen: true,
        title: 'Konfirmasi Password Tidak Cocok',
        message: 'Password baru dan konfirmasi password tidak sama. Silakan periksa kembali.',
        type: 'info',
      });
      return;
    }

    setIsSubmitting(true);
    const profile = getUserProfile();
    const email = profile?.email || 'user@sirkula.id';

    setTimeout(() => {
      const result = updateUserPassword(email, newPassword);
      setIsSubmitting(false);

      if (result.success) {
        setModalConfig({
          isOpen: true,
          title: 'Password Berhasil Diperbarui!',
          message: 'Kata sandi akun SIRKULA Anda telah berhasil diubah. Gunakan kata sandi baru ini saat masuk berikutnya.',
          type: 'success',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setModalConfig({
          isOpen: true,
          title: 'Gagal Memperbarui Password',
          message: result.message,
          type: 'info',
        });
      }
    }, 400);
  };

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-5">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#1C4D38]/10">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-[#1C4D38]/10 shadow-2xs text-[#1C4D38]">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-[#1C4D38] font-display">
            {t.settings.security}
          </h3>
          <p className="text-[11px] text-[#1C4D38]/70 font-semibold">
            {t.settings.securitySub}
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
        
        {/* Password Saat Ini */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.currentPass}
          </label>
          <div className="sm:col-span-8 relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Masukkan kata sandi saat ini"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Baru */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.newPass}
          </label>
          <div className="sm:col-span-8 relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password Baru */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
          <label className="sm:col-span-4 text-xs font-extrabold text-[#1C4D38]">
            {t.settings.confirmPass}
          </label>
          <div className="sm:col-span-8 relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Helper Note & Action Button */}
        <div className="sm:pl-[33.33%] space-y-3 pt-1">
          <p className="text-[10px] font-semibold text-[#1C4D38]/70">
            {t.settings.passNote}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-extrabold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Perbarui Kata Sandi'}</span>
          </button>
        </div>

      </form>

      {/* Alert Modal Feedback */}
      <CustomAlertModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />

    </div>
  );
}
