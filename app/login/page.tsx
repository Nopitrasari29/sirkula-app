'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, X } from 'lucide-react';
import { getRegisteredUsers, saveUserProfile, registerUser } from '@/lib/utils/storage';
import { apiClient } from '@/lib/services/apiClient';
import AlertModal from '@/components/ui/AlertModal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

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

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setModalState({
        isOpen: true,
        type: 'warning',
        title: 'Email Diperlukan',
        message: 'Silakan masukkan alamat email yang terdaftar untuk reset password.',
        confirmText: 'Mengerti',
      });
      return;
    }

    const users = getRegisteredUsers();
    const user = users.find((u) => u.email && u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Akun Tidak Ditemukan',
        message: `Email "${cleanEmail}" belum terdaftar di SIRKULA. Silakan periksa kembali atau buat akun baru.`,
        confirmText: 'Tutup',
      });
      return;
    }

    // Demo: Reset password via API (fire-and-forget), lalu isi form login
    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, newPassword: 'Sirkula123!' }),
    }).catch(() => { }); // Ignore error — demo mode only

    setIsForgotModalOpen(false);
    setPassword('Sirkula123!');
    setEmail(cleanEmail);
    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Reset Password Berhasil!',
      message: `Untuk simulasi cepat, password sementara akun Anda telah direset menjadi: "Sirkula123!". Password telah otomatis diisikan ke formulir masuk.`,
      confirmText: 'Masuk Sekarang',
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setModalState({
        isOpen: true,
        type: 'warning',
        title: 'Formulir Belum Lengkap',
        message: 'Silakan isi email dan password Anda terlebih dahulu.',
        confirmText: 'Mengerti',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Autentikasi via backend API (bcrypt password check)
      const result = await apiClient.auth.login({ email: email.trim(), password });

      setIsLoading(false);

      if (!result.success) {
        const errMsg = result.message || 'Email atau password salah.';
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Gagal Masuk',
          message: errMsg,
          confirmText: errMsg.includes('belum terdaftar') ? 'Daftar Sekarang' : 'Coba Lagi',
          onConfirmRedirect: errMsg.includes('belum terdaftar') ? '/register' : undefined,
        });
        return;
      }

      // Simpan profil user dari respons API ke localStorage untuk UI
      const userData = (result as any).user;
      if (userData) {
        saveUserProfile({
          id: userData.id,
          name: userData.name || userData.fullName,
          email: userData.email,
          role: userData.role || 'Mahasiswa Kos',
          campus: userData.campus || '',
          kosAddress: userData.kosAddress || '',
          phone: userData.phone || '',
          points: userData.points ?? 0,
          level: userData.level ?? 1,
          totalRecycledKg: userData.totalRecycledKg ?? 0,
          co2SavedKg: userData.co2SavedKg ?? 0,
          badges: userData.badges ?? [],
          isLoggedIn: true,
        });
      }

      // Token sudah disimpan otomatis oleh apiClient.auth.login()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }

      // Login berhasil → redirect ke Dashboard
      router.push('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Gagal Terhubung ke Server',
        message: 'Tidak dapat terhubung ke server SIRKULA. Periksa koneksi internet Anda.',
        confirmText: 'Coba Lagi',
      });
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Login dengan Google gagal.');
      }

      // Simpan JWT SIRKULA
      apiClient.setToken(result.token);

      // Simpan profil user ke localStorage untuk UI
      const userData = result.user;

      if (userData) {
        saveUserProfile({
          id: userData.id,
          name: userData.fullName || userData.name,
          email: userData.email,
          role: userData.role || 'Mahasiswa Kos',
          campus: userData.campus || 'ITS Sukolilo',
          kosAddress: userData.kosAddress || '',
          phone: userData.phone || '',
          points: userData.points ?? 0,
          level: userData.level ?? 1,
          totalRecycledKg: userData.totalRecycledKg ?? 0,
          co2SavedKg: userData.co2SavedKg ?? 0,
          badges: userData.badges ?? [],
          isLoggedIn: true,
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);

      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Login Google Gagal',
        message:
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat login dengan Google.',
        confirmText: 'Coba Lagi',
      });
    } finally {
      setIsLoading(false);
    }
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
              Kelola Sampah <br />
              Lebih Mudah <br />
              <span className="text-[#E07A5F]">dari Rumah ke Pengepul</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#F4F2E9]/85 font-medium leading-relaxed max-w-sm pt-1">
              SIRKULA membantu memilah sampah, menjadwalkan penjemputan, dan berkontribusi untuk lingkungan yang lebih baik
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
        <div className="relative z-10 w-full max-w-md bg-white p-8 sm:p-10 rounded-[32px] shadow-[0_12px_40px_rgba(28,77,56,0.08)] border border-[#1C4D38]/10 space-y-6">

          {/* Header Text */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C4D38] font-display tracking-tight">
              Selamat datang kembali!
            </h2>
            <p className="text-xs sm:text-sm text-[#1C4D38]/70 font-medium">
              Masuk ke akun SIRKULA-mu untuk melanjutkan
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
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
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-[#F4F2E9]/40 border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:border-[#1C4D38] focus:bg-white focus:ring-1 focus:ring-[#1C4D38]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
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
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-3 text-xs bg-[#F4F2E9]/40 border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:border-[#1C4D38] focus:bg-white focus:ring-1 focus:ring-[#1C4D38]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#1C4D38]/50 hover:text-[#1C4D38]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email || '');
                    setIsForgotModalOpen(true);
                  }}
                  className="text-[11px] font-bold text-[#1C4D38] hover:underline cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#1C4D38] hover:bg-[#143929] text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 disabled:opacity-70 mt-2 cursor-pointer"
            >
              {isLoading ? 'Memproses Validasi...' : 'Masuk'}
            </button>

          </form>

          {/* Or Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#1C4D38]/15" />
            <span className="flex-shrink mx-4 text-xs font-semibold text-[#1C4D38]/50">or</span>
            <div className="flex-grow border-t border-[#1C4D38]/15" />
          </div>

          {/* Google Social Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleLogin(credentialResponse.credential);
                }
              }}
              onError={() => {
                setModalState({
                  isOpen: true,
                  type: 'error',
                  title: 'Login Google Gagal',
                  message: 'Tidak dapat melakukan login dengan Google.',
                  confirmText: 'Coba Lagi',
                });
              }}
              useOneTap={false}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="400"
            />
          </div>

          {/* Quick Demo Mode for Competition Evaluator */}
          <button
            type="button"
            onClick={async () => {
              setIsLoading(true);
              try {
                const demoResult = await apiClient.auth.login({ email: 'fika@sirkula.id', password: 'Sirkula123!' });
                const demoUser = (demoResult as any).user;
                if (demoUser) {
                  saveUserProfile({
                    id: demoUser.id || 'demo-fika',
                    name: demoUser.name || 'Rafika Az Zahra',
                    email: demoUser.email || 'fika@sirkula.id',
                    role: demoUser.role || 'Mahasiswa Kos',
                    campus: demoUser.campus || 'ITS Sukolilo',
                    kosAddress: demoUser.kosAddress || '',
                    phone: demoUser.phone || '',
                    points: demoUser.points ?? 126,
                    level: demoUser.level ?? 3,
                    totalRecycledKg: demoUser.totalRecycledKg ?? 14.5,
                    co2SavedKg: demoUser.co2SavedKg ?? 28.2,
                    badges: demoUser.badges ?? [],
                    isLoggedIn: true,
                  });
                }
                if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
              } catch {
                // Fallback jika backend offline — set profil demo lokal
                saveUserProfile({
                  id: 'demo-fika-local',
                  name: 'Rafika Az Zahra',
                  email: 'fika@sirkula.id',
                  role: 'Mahasiswa Kos',
                  campus: 'ITS Sukolilo',
                  kosAddress: 'Jl. Gebang Wetan No. 12',
                  phone: '081234567890',
                  points: 126,
                  level: 3,
                  totalRecycledKg: 14.5,
                  co2SavedKg: 28.2,
                  badges: [],
                  isLoggedIn: true,
                });
                if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));
              } finally {
                setIsLoading(false);
              }
              router.push('/dashboard');
            }}
            className="w-full py-2.5 bg-[#D6E6C5]/60 hover:bg-[#D6E6C5] border border-[#1C4D38]/20 text-[#1C4D38] font-black text-xs rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>⚡ Masuk Cepat Demo (Juri / Penilai)</span>
          </button>

          {/* Register Link */}
          <div className="text-center text-xs font-medium text-[#1C4D38]/80 pt-2">
            <span>Belum punya akun? </span>
            <Link href="/register" className="font-extrabold text-[#1C4D38] hover:underline">
              Daftar sekarang
            </Link>
          </div>

        </div>

      </div>

      {/* Modal Lupa Password */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF5ED] rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#1C4D38]/15 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#1C4D38]/60 hover:text-[#1C4D38] hover:bg-[#1C4D38]/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D6E6C5] text-[#1C4D38] flex items-center justify-center shrink-0 shadow-xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1C4D38] font-display">
                  Reset Password
                </h3>
                <p className="text-xs text-[#1C4D38]/70 font-medium">
                  Masukkan email akun SIRKULA Anda
                </p>
              </div>
            </div>

            <p className="text-xs text-[#1C4D38]/80 leading-relaxed font-medium">
              Kami akan memverifikasi email Anda dan mengonfirmasi pengaturan ulang kata sandi akun SIRKULA Anda.
            </p>

            {/* Form */}
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-extrabold text-[#1C4D38]">Email Terdaftar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1C4D38]/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-[#1C4D38]/20 rounded-xl text-[#1C4D38] placeholder-[#1C4D38]/40 focus:outline-none focus:ring-2 focus:ring-[#1C4D38]/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-3 bg-white hover:bg-gray-100 text-[#1C4D38] font-extrabold text-xs rounded-xl border border-[#1C4D38]/20 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1C4D38] hover:bg-[#143929] text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Alert Modal */}
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

    </div>
  );
}
