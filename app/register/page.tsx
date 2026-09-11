'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { registerUser } from '@/lib/utils/storage';
import AlertModal from '@/components/ui/AlertModal';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Alert Modal Dialog State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
    confirmText?: string;
    onConfirmRedirect?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setModalState({
        isOpen: true,
        type: 'warning',
        title: 'Formulir Belum Lengkap',
        message: 'Silakan isi seluruh bidang formulir pendaftaran.',
        confirmText: 'Mengerti',
      });
      return;
    }

    if (password.length < 8) {
      setModalState({
        isOpen: true,
        type: 'warning',
        title: 'Password Kurang Panjang',
        message: 'Password minimal harus 8 karakter dengan kombinasi huruf dan angka.',
        confirmText: 'Perbaiki',
      });
      return;
    }

    if (password !== confirmPassword) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Password Tidak Cocok',
        message: 'Konfirmasi password tidak cocok dengan password yang Anda buat.',
        confirmText: 'Perbaiki',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Register new user into the browser database
      const result = registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      if (!result.success) {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Pendaftaran Gagal',
          message: result.message,
          confirmText: 'Masuk Sekarang',
          onConfirmRedirect: '/login',
        });
        return;
      }

      // Success modal pop-up before redirect
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Pendaftaran Berhasil!',
        message: 'Selamat datang di SIRKULA! Akun Anda telah berhasil dibuat.',
        confirmText: 'Masuk ke Dashboard',
        onConfirmRedirect: '/dashboard',
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F4F2E9] flex flex-col lg:flex-row relative overflow-hidden">

      {/* High-Aesthetic Alert Modal Card Dialog */}
      <AlertModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() => {
          setModalState({ ...modalState, isOpen: false });
          if (modalState.onConfirmRedirect) {
            router.push(modalState.onConfirmRedirect);
          }
        }}
      />

      {/* Left Column: Narrower Forest Green Banner (36% Width) */}
      <div className="w-full lg:w-[36%] min-h-[420px] lg:min-h-screen bg-[#1C4D38] p-8 sm:p-12 text-white flex flex-col justify-between relative z-10 shrink-0">

        {/* Leaf Pattern Watermark Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-contain bg-repeat bg-[url('/assets/illustrations/leaf-bg-pattern.svg')]" />

        <div className="relative z-10 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#F4F2E9]/85 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="pt-2 space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black leading-[1.18] tracking-tight font-display">
              Bergabung <br />
              bersama <span className="text-[#E07A5F]">SIRKULA</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#F4F2E9]/85 font-medium leading-relaxed max-w-sm pt-1">
              Buat akunmu sekarang dan mulai kelola sampah, dapatkan poin, dan berkontribusi untuk lingkungan yang lebih baik
            </p>
          </div>
        </div>

        {/* Truck Mascot Illustration */}
        <div className="relative z-10 pt-6 flex justify-start items-end">
          <img
            src="/assets/illustrations/sirkula-truck.png"
            alt="SIRKULA Truck"
            className="w-full max-w-[320px] lg:max-w-[350px] h-auto object-contain filter drop-shadow-xl animate-float-slow"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.endsWith('.svg')) {
                img.src = '/assets/illustrations/sirkula-truck.svg';
              }
            }}
          />
        </div>

      </div>

      {/* Right Column: Wider White/Cream Area (64% Width) */}
      <div className="w-full lg:w-[64%] min-h-screen bg-[#FAFAF8] p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center relative z-10">

        {/* Spring Leaves Overlay di Pojok Kiri Atas (Blending Halus mix-blend-multiply dengan Background) */}
        <div className="absolute top-0 left-0 pointer-events-none z-0 opacity-30 mix-blend-multiply">
          <img
            src="/assets/illustrations/spring-leaves-bg.png"
            alt="Spring Leaves Background"
            className="w-64 sm:w-80 lg:w-[380px] h-auto object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/assets/illustrations/falling-green-leaves.png';
            }}
          />
        </div>

        {/* Form Container Card */}
        <div className="relative z-10 w-full max-w-md bg-white p-8 sm:p-10 rounded-[32px] shadow-[0_12px_40px_rgba(28,77,56,0.08)] border border-[#1C4D38]/10 space-y-5">

          {/* Top Back Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C4D38]/80 hover:text-[#1C4D38] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
          </div>

          {/* Header Text */}
          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C4D38] font-display tracking-tight">
              Buat Akun Baru
            </h2>
            <p className="text-xs sm:text-sm text-[#1C4D38]/70 font-medium">
              Isi data di bawah ini untuk membuat akun SIRKULA
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleRegister} className="space-y-3.5">

            {/* Full Name Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-extrabold text-[#1C4D38]">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C4D38]/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F4F2E9]/40 border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:border-[#1C4D38] focus:bg-white focus:ring-1 focus:ring-[#1C4D38]"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-extrabold text-[#1C4D38]">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C4D38]/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email aktif Anda"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F4F2E9]/40 border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:border-[#1C4D38] focus:bg-[#F4F2E9]/40 focus:ring-1 focus:ring-[#1C4D38]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-extrabold text-[#1C4D38]">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C4D38]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F4F2E9]/40 border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:border-[#1C4D38] focus:bg-white focus:ring-1 focus:ring-[#1C4D38]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#1C4D38]/50 hover:text-[#1C4D38]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#1C4D38]/60 font-medium">
                Minimal 8 karakter dengan huruf, angka, dan simbol
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-extrabold text-[#1C4D38]">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C4D38]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password Anda"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F4F2E9]/40 border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:border-[#1C4D38] focus:bg-white focus:ring-1 focus:ring-[#1C4D38]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#1C4D38]/50 hover:text-[#1C4D38]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#1C4D38] hover:bg-[#143929] text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 disabled:opacity-70 mt-2"
            >
              {isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
            </button>

          </form>

          {/* Login Link */}
          <div className="text-center text-xs font-medium text-[#1C4D38]/80 pt-2">
            <span>Sudah punya akun? </span>
            <Link href="/login" className="font-extrabold text-[#1C4D38] hover:underline">
              Masuk di sini
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
