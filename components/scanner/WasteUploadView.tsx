'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Camera,
  ShieldCheck,
  Brain,
  Search,
  Leaf,
  Sun,
  Package,
  ChevronRight,
  CupSoda,
  ShoppingBag,
  Container,
  Wine,
  Sparkles,
  X,
  SwitchCamera,
  ZapOff,
} from 'lucide-react';
import presetsData from '@/lib/data/presets.json';

import { useRouter } from 'next/navigation';

interface WasteUploadViewProps {
  onStartScan: (presetId?: string, file?: File) => void;
  onOpenHistory?: () => void;
}

export default function WasteUploadView({ onStartScan, onOpenHistory }: WasteUploadViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Webcam states
  const [showWebcam, setShowWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCapturing, setIsCapturing] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Cleanup stream when webcam closes
  useEffect(() => {
    if (!showWebcam && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [showWebcam, stream]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleConfirmScan = () => {
    if (selectedFile) {
      onStartScan(undefined, selectedFile);
    }
  };

  const handleCancelPreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // --- WEBCAM LOGIC ---
  const startWebcam = useCallback(async (facing: 'environment' | 'user' = 'environment') => {
    setWebcamError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setShowWebcam(true);
      // Attach to video element after state update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        setWebcamError('Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.');
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
        setWebcamError('Kamera tidak ditemukan. Pastikan kamera terhubung dan tidak dipakai aplikasi lain.');
      } else {
        setWebcamError('Tidak dapat mengakses kamera: ' + msg);
      }
      setShowWebcam(false);
    }
  }, [stream]);

  const handleOpenCamera = () => {
    if (isMobile) {
      // On mobile, use native camera input (simpler & more reliable)
      cameraInputRef.current?.click();
    } else {
      // On desktop, use webcam via getUserMedia
      startWebcam(facingMode);
    }
  };

  const handleFlipCamera = () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    startWebcam(newFacing);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `webcam-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setSelectedFile(file);
        setPreviewUrl(url);
        // Close webcam
        setShowWebcam(false);
        stream?.getTracks().forEach(t => t.stop());
        setStream(null);
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.92);
  };

  const handleCloseWebcam = () => {
    setShowWebcam(false);
    setWebcamError(null);
  };

  // --- DATA ---
  const steps = [
    { num: 1, title: 'Upload Foto', desc: 'Upload atau ambil foto sampah yang ingin diidentifikasi', icon: Upload },
    { num: 2, title: 'Analisis AI', desc: 'AI akan menganalisis ciri-ciri objek pada foto kamu', icon: Brain },
    { num: 3, title: 'Hasil Identifikasi', desc: 'Dapatkan informasi jenis sampah, cara pemilahan, dan estimasi nilai jual', icon: Search },
    { num: 4, title: 'Aksi Hijau', desc: 'Kelola sampahmu dengan tepat dan dapatkan poin', icon: Leaf },
  ];

  const tips = [
    { icon: Camera, iconImg: '/assets/icons/icon-tip-photo.png', title: 'Ambil foto yang jelas', desc: 'Pastikan objek sampah terlihat jelas dan tidak buram' },
    { icon: Sun, iconImg: '/assets/icons/icon-tip-sun.png', title: 'Pencahayaan yang cukup', desc: 'Gunakan cahaya alami agar hasil lebih akurat' },
    { icon: Package, iconImg: null, title: 'Satu objek utama', desc: 'Fokus pada satu jenis sampah dalam satu foto' },
  ];

  const categories = [
    { name: 'Plastik', icon: CupSoda, color: 'bg-[#FCE39E] text-[#8C5511]' },
    { name: 'Kertas', icon: ShoppingBag, color: 'bg-[#F3D7E8] text-[#8C2C6A]' },
    { name: 'Logam', icon: Container, color: 'bg-[#D2EAE1] text-[#1C4D38]' },
    { name: 'Kaca', icon: Wine, color: 'bg-[#E1ECB2] text-[#4A6B15]' },
    { name: 'Organik', icon: Leaf, color: 'bg-[#D7E8F7] text-[#1D588C]' },
  ];

  const recentScans = [
    { id: 'rs-1', name: 'Kardus', category: 'Kertas', categoryBg: 'bg-[#F3D7E8] text-[#8C2C6A]', date: '21 Juli 2026, 10.23 WIB', price: 'Rp 1.500/kg', iconImg: '/assets/illustrations/scan-item-kardus.png' },
    { id: 'rs-2', name: 'Botol Plastik (PET)', category: 'Plastik', categoryBg: 'bg-[#FCE39E] text-[#8C5511]', date: '20 Juli 2026, 15.56 WIB', price: 'Rp 2.000/kg', iconImg: '/assets/illustrations/scan-item-bottle.png' },
    { id: 'rs-3', name: 'Sisa Makanan', category: 'Organik', categoryBg: 'bg-[#D7E8F7] text-[#1D588C]', date: '20 Juli 2026, 09.34 WIB', price: 'Gratis', iconImg: '/assets/illustrations/scan-item-banana.png' },
  ];

  return (
    <>
      {/* Hidden File Inputs */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ========== WEBCAM MODAL (Desktop) ========== */}
      {showWebcam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#FAF5ED] rounded-[28px] shadow-2xl w-full max-w-2xl overflow-hidden border border-[#1C4D38]/20">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C4D38]/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E07A5F] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1C4D38] font-display">Ambil Foto via Webcam</h3>
                  <p className="text-[10px] text-[#1C4D38]/60 font-semibold">Arahkan kamera ke objek sampah</p>
                </div>
              </div>
              <button
                onClick={handleCloseWebcam}
                className="w-8 h-8 rounded-full bg-[#1C4D38]/10 hover:bg-[#1C4D38]/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4 text-[#1C4D38]" />
              </button>
            </div>

            {/* Video Feed */}
            <div className="relative bg-black aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Scanning overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/40 rounded-2xl relative">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#E07A5F] rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#E07A5F] rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#E07A5F] rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#E07A5F] rounded-br-lg" />
                </div>
              </div>

              {/* Flash effect on capture */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-ping opacity-80 pointer-events-none" style={{ animationDuration: '0.15s', animationIterationCount: 1 }} />
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#1C4D38]">
              {/* Flip Camera */}
              <button
                onClick={handleFlipCamera}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                title="Ganti Kamera"
              >
                <SwitchCamera className="w-5 h-5 text-white" />
              </button>

              {/* Capture Button */}
              <button
                onClick={handleCapturePhoto}
                disabled={isCapturing}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-[#E07A5F] hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-[#E07A5F]" />
              </button>

              {/* Upload from gallery fallback */}
              <button
                onClick={() => { handleCloseWebcam(); fileInputRef.current?.click(); }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                title="Upload dari Galeri"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webcam Permission Error Modal */}
      {webcamError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF5ED] rounded-[24px] shadow-2xl w-full max-w-sm p-6 space-y-4 text-center border border-red-200">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <ZapOff className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-sm font-black text-[#1C4D38] font-display">Kamera Tidak Dapat Diakses</h3>
            <p className="text-xs text-[#1C4D38]/70 font-medium leading-relaxed">{webcamError}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setWebcamError(null); fileInputRef.current?.click(); }}
                className="flex-1 py-2.5 bg-[#1C4D38] text-white text-xs font-black rounded-xl hover:bg-[#143929] transition cursor-pointer"
              >
                Upload dari Galeri
              </button>
              <button
                onClick={() => setWebcamError(null)}
                className="flex-1 py-2.5 bg-white border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-bold rounded-xl hover:bg-[#FAF5ED] transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MAIN LAYOUT ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Upload / Ambil Foto Box */}
          <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Dashed Dropzone Box */}
            <div className="bg-[#F7EBD4]/60 border-2 border-dashed border-[#E07A5F]/50 rounded-[24px] p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4">
              
              {previewUrl ? (
                /* Preview Foto */
                <div className="w-full space-y-4">
                  <div className="relative mx-auto max-w-sm h-60 rounded-2xl overflow-hidden border-2 border-[#1C4D38]/20 shadow-md">
                    <img src={previewUrl} alt="Preview Foto Sampah" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      Foto Siap Dipindai
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmScan}
                      className="px-6 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>Pindai Sampah Sekarang</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPreview}
                      className="px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              ) : (
                /* Default Upload / Camera Prompt */
                <>
                  {/* Camera Badge Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E9A757] flex items-center justify-center shadow-md border-2 border-white/80 shrink-0 p-3">
                    <img
                      src="/assets/icons/icon-camera-leaf.png"
                      alt="Camera Leaf Icon SIRKULA"
                      className="w-full h-full object-contain filter drop-shadow-2xs hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-[#1C4D38] font-display">
                      Upload atau ambil foto sampahmu
                    </h3>
                    <p className="text-xs text-[#1C4D38]/60 font-bold">atau pilih salah satu cara di bawah</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#E07A5F] hover:bg-[#d4684d] text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload dari Galeri</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenCamera}
                      className="w-full sm:w-auto px-5 py-2.5 bg-transparent border-2 border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F]/10 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isMobile ? 'Ambil Foto Langsung' : 'Buka Webcam'}</span>
                    </button>
                  </div>

                  {/* Hint for desktop */}
                  {!isMobile && (
                    <p className="text-[10px] text-[#1C4D38]/50 font-semibold -mt-1">
                      💻 Di laptop: kamera akan terbuka lewat browser
                    </p>
                  )}

                  {/* Subtext */}
                  <div className="text-[11px] font-semibold text-[#1C4D38]/70 space-x-3">
                    <span>Format: JPG, PNG</span>
                    <span>•</span>
                    <span>Maks. 5MB</span>
                  </div>

                  {/* Security Note */}
                  <div className="bg-[#FAF0DD] border border-[#E07A5F]/25 rounded-full px-4 py-2 text-[11px] font-bold text-[#1C4D38] flex items-center justify-center gap-2 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-[#E07A5F] shrink-0" />
                    <span>Foto kamu aman dan hanya digunakan untuk identifikasi sampah</span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Preset Fast Select */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-extrabold text-[#1C4D38] font-display flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Atau Pilih Sampel Pengujian Cepat AI:</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {presetsData.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => onStartScan(preset.id)}
                    className="p-2.5 rounded-2xl bg-white border border-[#1C4D38]/15 hover:border-[#1C4D38] text-center flex flex-col items-center gap-1.5 transition shadow-2xs hover:shadow-md cursor-pointer group active:scale-95"
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#1C4D38]/10 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] font-extrabold text-[#1C4D38] truncate w-full">
                      {preset.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Card 2: Cara Kerja AI Scanner */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">Cara Kerja AI Scanner</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {steps.map((st, idx) => {
                const IconC = st.icon;
                return (
                  <div key={st.num} className="flex flex-col items-center text-center space-y-2 relative">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-[#FAF5ED] border-2 border-[#E07A5F]/40 flex items-center justify-center text-[#E07A5F] shadow-2xs">
                        <IconC className="w-7 h-7 stroke-[1.8]" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#E07A5F] text-white font-black text-[10px] flex items-center justify-center border-2 border-white shadow-2xs">
                        {st.num}
                      </div>
                    </div>
                    <h4 className="text-xs font-black text-[#1C4D38] font-display leading-tight pt-1">{st.title}</h4>
                    <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-snug">{st.desc}</p>
                    {idx < steps.length - 1 && (
                      <div className="hidden sm:block absolute top-6 -right-3 text-[#E07A5F]/40 font-black text-sm pointer-events-none">›</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Card 1: Tips Foto Terbaik */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">Tips Foto Terbaik</h3>
            <div className="space-y-3.5">
              {tips.map((tp, idx) => {
                const IconC = tp.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#E59B73] flex items-center justify-center shrink-0 shadow-2xs border border-white/20 p-2">
                      {tp.iconImg ? (
                        <img src={tp.iconImg} alt={tp.title} className="w-full h-full object-contain filter drop-shadow-2xs" />
                      ) : (
                        <IconC className="w-5 h-5 text-white stroke-[2]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h4 className="text-xs font-black text-[#1C4D38] font-display leading-tight">{tp.title}</h4>
                      <p className="text-[11px] text-[#1C4D38]/75 font-medium leading-snug mt-0.5">{tp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Jenis Sampah yang Diterima */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">Jenis Sampah yang Diterima</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {categories.map((cat) => {
                const IconC = cat.icon;
                return (
                  <div key={cat.name} className="flex flex-col items-center space-y-1.5 group cursor-pointer">
                    <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center border border-black/5 shadow-2xs group-hover:scale-110 transition-transform duration-200`}>
                      <IconC className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1C4D38]">{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Scan Terbaru */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-[#1C4D38] font-display">Scan Terbaru</h3>
            <div className="space-y-3">
              {recentScans.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { if (onOpenHistory) onOpenHistory(); else router.push('/jejak-hijau/aktivitas'); }}
                  className="p-3.5 rounded-2xl bg-[#FCE39E]/90 border border-[#1C4D38]/10 shadow-2xs flex items-center justify-between gap-3 hover:bg-[#FCE39E] transition cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center shrink-0 border border-[#1C4D38]/10 shadow-2xs p-1 overflow-hidden">
                      <img src={item.iconImg} alt={item.name} className="w-full h-full object-contain filter drop-shadow-2xs" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-[#1C4D38] font-display truncate">{item.name}</h4>
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black rounded-full ${item.categoryBg}`}>{item.category}</span>
                      </div>
                      <p className="text-[10px] text-[#1C4D38]/70 font-semibold">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-right">
                    <span className="text-xs font-black text-[#1C4D38]">{item.price}</span>
                    <ChevronRight className="w-4 h-4 text-[#1C4D38]/50" />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => { if (onOpenHistory) onOpenHistory(); else router.push('/jejak-hijau/aktivitas'); }}
                className="w-full py-2 bg-transparent hover:bg-white/50 border border-[#E07A5F]/70 text-[#E07A5F] text-xs font-extrabold rounded-xl transition shadow-2xs text-center cursor-pointer active:scale-95"
              >
                Muat Lebih Banyak
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
