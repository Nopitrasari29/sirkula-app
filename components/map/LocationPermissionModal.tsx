'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, Sparkles, Target, Compass, Map } from 'lucide-react';
import { useGeolocation, GPS_PERMISSION_KEY, GPS_STORAGE_KEY } from '@/hooks/useGeolocation';

export default function LocationPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [successLocation, setSuccessLocation] = useState<string | null>(null);
  const { isDetecting, errorMsg, requestGpsLocation, setSimulatedLocation } = useGeolocation();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if coordinates already saved or actively detected
    const existingCoords = localStorage.getItem(GPS_STORAGE_KEY);

    // If no real GPS has been recorded yet, prompt the user immediately
    if (!existingCoords) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to custom event if other components want to re-open the permission modal
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('sirkula:openLocationModal', handleOpen);
    return () => window.removeEventListener('sirkula:openLocationModal', handleOpen);
  }, []);

  const handleApproveGps = async () => {
    const result = await requestGpsLocation();
    if (result) {
      setSuccessLocation(result.name || `${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`);
      setTimeout(() => {
        setIsOpen(false);
        setSuccessLocation(null);
      }, 1200);
    }
  };

  const handleSelectPreset = (coords: { lat: number; lng: number; name: string }) => {
    setSimulatedLocation(coords);
    setSuccessLocation(coords.name);
    setTimeout(() => {
      setIsOpen(false);
      setSuccessLocation(null);
    }, 900);
  };

  const handleUseDefault = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GPS_PERMISSION_KEY, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#FAF5ED] rounded-[32px] border-2 border-[#1C4D38]/15 shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Soft Background Leaf Watermark */}
        <div className="absolute -top-12 -right-12 w-44 h-44 opacity-10 pointer-events-none">
          <img
            src="/assets/illustrations/falling-green-leaves.png"
            alt="Leaf Watermark"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleUseDefault}
          className="absolute top-5 right-5 p-2 text-[#1C4D38]/50 hover:text-[#1C4D38] hover:bg-black/5 rounded-full transition cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6 relative z-10">
          
          {/* Header Icon + Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            
            {/* Pulsing Radar Icon */}
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="absolute w-16 h-16 rounded-full bg-emerald-500/30 animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-[#1C4D38] text-[#FCE39E] flex items-center justify-center shadow-lg border border-[#FCE39E]/40">
                {isDetecting ? (
                  <RefreshCw className="w-7 h-7 animate-spin text-[#FCE39E]" />
                ) : successLocation ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                ) : (
                  <Navigation className="w-7 h-7 text-[#FCE39E]" />
                )}
              </div>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              <span>Deteksi Lokasi Otomatis</span>
            </span>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display tracking-tight">
                Aktifkan Akses Lokasi Kamu 📍
              </h2>
              <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium max-w-md mx-auto leading-relaxed">
                SIRKULA memerlukan izin lokasi perangkatmu agar seluruh titik bank sampah, drop-box 24 jam, dan jadwal jemput sampah akurat sesuai lokasimu saat ini.
              </p>
            </div>

          </div>

          {/* Value Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/80 border border-[#1C4D38]/10 rounded-2xl p-3 text-center space-y-1.5">
              <Target className="w-5 h-5 mx-auto text-emerald-700" />
              <div className="text-[11px] font-black text-[#1C4D38]">Titik Terdekat</div>
              <p className="text-[10px] text-[#1C4D38]/70 leading-tight">Mendeteksi drop point sekitar kosmu</p>
            </div>
            <div className="bg-white/80 border border-[#1C4D38]/10 rounded-2xl p-3 text-center space-y-1.5">
              <Compass className="w-5 h-5 mx-auto text-emerald-700" />
              <div className="text-[11px] font-black text-[#1C4D38]">Jarak Nyata</div>
              <p className="text-[10px] text-[#1C4D38]/70 leading-tight">Hitung km & menit tempuh riil</p>
            </div>
            <div className="bg-white/80 border border-[#1C4D38]/10 rounded-2xl p-3 text-center space-y-1.5">
              <Map className="w-5 h-5 mx-auto text-emerald-700" />
              <div className="text-[11px] font-black text-[#1C4D38]">Peta Otomatis</div>
              <p className="text-[10px] text-[#1C4D38]/70 leading-tight">Peta berpusat tepat di posisimu</p>
            </div>
          </div>

          {/* Success Feedback Alert */}
          {successLocation && (
            <div className="p-3.5 bg-emerald-100/90 border-2 border-emerald-500 text-emerald-950 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div className="text-xs">
                <strong className="block font-black">Lokasi Berhasil Terdeteksi!</strong>
                <span>{successLocation}</span>
              </div>
            </div>
          )}

          {/* Error Message if Denied */}
          {errorMsg && !isDetecting && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Perlu Izin Peramban:</strong>
                <p className="text-[11px] text-amber-900 mt-0.5">{errorMsg}</p>
                <p className="text-[10px] text-amber-800 mt-1">
                  Tips: Klik ikon perizinan di sebelah alamat URL peramban untuk mengizinkan akses lokasi.
                </p>
              </div>
            </div>
          )}

          {/* Actions Button Group */}
          <div className="space-y-2 pt-2">
            
            {/* Primary Action: Setujui & Nyalakan GPS */}
            <button
              type="button"
              onClick={handleApproveGps}
              disabled={isDetecting || !!successLocation}
              className="w-full py-3.5 px-6 bg-[#1C4D38] hover:bg-[#143929] disabled:opacity-75 text-white text-sm font-black rounded-2xl shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDetecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FCE39E]" />
                  <span>Menghubungkan ke GPS Satelit...</span>
                </>
              ) : successLocation ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Lokasi Terhubung!</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-[#FCE39E]" />
                  <span>Setujui & Nyalakan Lokasi Saya</span>
                </>
              )}
            </button>

            {/* Quick Presets for user convenience */}
            <div className="pt-2 border-t border-[#1C4D38]/10">
              <p className="text-[11px] font-bold text-[#1C4D38]/70 text-center mb-1.5">
                Atau pilih langsung area domisili kamu:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { name: 'Keputih, Surabaya', lat: -7.2910, lng: 112.7990 },
                  { name: 'Mulyorejo, Surabaya', lat: -7.2680, lng: 112.7850 },
                  { name: 'Beji, Depok (UI)', lat: -6.3686, lng: 106.8272 },
                  { name: 'Coblong, Bandung (ITB)', lat: -6.8915, lng: 107.6107 },
                  { name: 'Sleman, Yogyakarta (UGM)', lat: -7.7705, lng: 110.3777 },
                  { name: 'Lowokwaru, Malang (UB)', lat: -7.9525, lng: 112.6144 },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-emerald-50 text-[#1C4D38] border border-[#1C4D38]/15 rounded-lg transition shadow-2xs cursor-pointer"
                  >
                    📍 {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Action: Gunakan Default */}
            <button
              type="button"
              onClick={handleUseDefault}
              disabled={isDetecting}
              className="w-full py-2 px-4 bg-transparent hover:bg-black/5 text-[#1C4D38]/70 hover:text-[#1C4D38] text-xs font-bold rounded-xl transition cursor-pointer text-center"
            >
              Lanjutkan dengan Lokasi Default (Surabaya)
            </button>

          </div>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#1C4D38]/50 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Privasi terjaga. Koordinat GPS hanya diproses di perangkat lokalmu.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
