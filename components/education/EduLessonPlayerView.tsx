'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  CheckCircle2,
  Check,
  Lock,
  Award,
  Sparkles,
  Bot,
  Lightbulb,
  FileText,
  Clock,
  ThumbsUp,
  Share2,
  Bookmark,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import CustomAlertModal, { AlertType } from '@/components/ui/CustomAlertModal';

interface EduLessonPlayerViewProps {
  lessonId: string;
  topicName: string;
  onBackToLearningPath: () => void;
  onCompleteAndNext: (lessonId: string, points: number) => void;
  onOpenAiRecommend: () => void;
  completedIds: string[];
}

export default function EduLessonPlayerView({
  lessonId,
  topicName,
  onBackToLearningPath,
  onCompleteAndNext,
  onOpenAiRecommend,
  completedIds,
}: EduLessonPlayerViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'Ringkasan' | 'Catatan' | 'Transkrip'>('Ringkasan');
  const [userNote, setUserNote] = useState('');
  const [isClaimed, setIsClaimed] = useState(completedIds.includes(lessonId));

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const LESSONS_REGISTRY: Record<string, {
    title: string;
    type: 'Video' | 'Artikel';
    duration: string;
    points: number;
    currentStep: number;
    totalSteps: number;
    image: string;
    intro: string;
    learningPoints: string[];
    practicalTip: string;
  }> = {
    'mat-1': {
      title: 'Cara Memilah Sampah dengan Benar',
      type: 'Video',
      duration: '4 menit',
      points: 20,
      currentStep: 1,
      totalSteps: 12,
      image: '/assets/illustrations/edu-sort-waste.png',
      intro: 'Memilah sampah sejak dari kamar kos adalah fondasi utama keberhasilan sirkular ekonomi dan daur ulang modern.',
      learningPoints: [
        'Mengenali 3 wadah dasar: Organik, Anorganik Daur Ulang, dan Residu',
        'Mengapa sampah kering tidak boleh bercampur dengan sisa kuah makanan',
        'Teknik penataan kantong sampah mini di kamar kos berukuran terbatas',
        'Cara menyalurkan sampah terpilah ke bank sampah mitra terdekat',
      ],
      practicalTip: 'Gunakan kardus bekas paket sebagai wadah pemilah botol dan kaleng sebelum disetor ke kurir.',
    },
    'mat-sort-2': {
      title: 'Jenis-jenis Sampah dan Karakteristiknya',
      type: 'Artikel',
      duration: '5 menit',
      points: 20,
      currentStep: 2,
      totalSteps: 12,
      image: '/assets/illustrations/scan-item-bottle.png',
      intro: 'Setiap material memiliki nilai ekonomi dan metode daur ulang yang berbeda sesuai kode polimernya.',
      learningPoints: [
        'Memahami kode plastik resin 1 (PET), 2 (HDPE), hingga 5 (PP)',
        'Perbedaan kertas duplex, HVS putih, dan kardus corrugated boks',
        'Karakteristik limbah B3 kos seperti baterai, lampu, dan botol aerosol',
        'Bahan-bahan yang tidak dapat didaur ulang (residu sachet laminasi)',
      ],
      practicalTip: 'Periksa simbol segitiga daur ulang di bagian bawah kemasan minuman untuk memastikan jenis plastiknya.',
    },
    'mat-2': {
      title: 'Membuat Kompos dari Sampah Organik',
      type: 'Video',
      duration: '6 menit',
      points: 20,
      currentStep: 3,
      totalSteps: 12,
      image: '/assets/illustrations/edu-compost-bin.png',
      intro: 'Kompos adalah hasil penguraian bahan organik oleh mikroorganisme yang bermanfaat bagi tanah dan tanaman.',
      learningPoints: [
        'Pengertian kompos dan manfaatnya bagi kesuburan lingkungan tanah',
        'Bahan-bahan sisa dapur kos yang dapat dan tidak dapat dijadikan kompos',
        'Langkah-langkah praktis pembuatan kompos mini sederhana dalam wadah ember',
        'Tips agar kompos cepat matang dan terhindar dari bau menyengat',
      ],
      practicalTip: 'Cacah sampah organik menjadi potongan kecil-kecil agar proses pengomposan oleh mikroba alami lebih cepat dan merata.',
    },
    'mat-3': {
      title: 'Daur Ulang Plastik: Proses & Manfaatnya',
      type: 'Video',
      duration: '5 menit',
      points: 20,
      currentStep: 4,
      totalSteps: 12,
      image: '/assets/illustrations/edu-plastic-recycle.png',
      intro: 'Proses transformasi botol plastik bekas menjadi serpihan bijih plastik baru dan benang polyester ramah lingkungan.',
      learningPoints: [
        'Rantai pasok daur ulang dari kos, pemulung, bank sampah, hingga pabrik pellet',
        'Pengurangan emisi karbon hingga 70% dibanding memproduksi plastik virgin baru',
        'Potensi nilai jual rupiah per kilogram sampah plastik bersih',
        'Inovasi produk circular economy: pakaian, sepatu, dan perabotan dari botol bekas',
      ],
      practicalTip: 'Bilas dan lepaskan ring cincin tutup botol agar nilai jual botol PET Anda mencapai harga tertinggi di bank sampah.',
    },
    'mat-4': {
      title: 'Gaya Hidup Minim Sampah untuk Pemula',
      type: 'Artikel',
      duration: '3 menit',
      points: 20,
      currentStep: 5,
      totalSteps: 12,
      image: '/assets/illustrations/edu-zero-waste.png',
      intro: 'Langkah sederhana memulai zero waste lifestyle untuk mahasiswa kos tanpa perlu biaya mahal.',
      learningPoints: [
        'Membawa tumbler dan kotak makan saat membeli makanan di sekitar kampus',
        'Menolak sedotan plastik sekali pakai dan kantong kresek belanjaan',
        'Memilih belanja isi ulang (bulk store) untuk sabun dan deterjen kos',
        'Menumbuhkan mindset bijak konsumsi sebelum membeli barang baru',
      ],
      practicalTip: 'Simpan selalu tas belanja kain lipat di dalam tas ransel kuliah agar siap digunakan sewaktu-waktu.',
    },
  };

  const lessonData = LESSONS_REGISTRY[lessonId] || LESSONS_REGISTRY['mat-2'];

  const handleDownloadMaterial = () => {
    setAlertModal({
      isOpen: true,
      title: 'Modul PDF Berhasil Diunduh!',
      message: `Ringkasan panduan praktis "${lessonData.title}" telah disimpan ke perangkat Anda dalam format PDF ramah cetak.`,
      type: 'download',
    });
  };

  const handleComplete = () => {
    setIsClaimed(true);
    onCompleteAndNext(lessonId, lessonData.points);
  };

  const playlistItems = [
    { id: 'mat-1', title: 'Cara Memilah Sampah dengan Benar', type: 'Video' },
    { id: 'mat-sort-2', title: 'Jenis-jenis Sampah dan Karakteristiknya', type: 'Artikel' },
    { id: 'mat-2', title: 'Membuat Kompos dari Sampah Organik', type: 'Video' },
    { id: 'mat-3', title: 'Daur Ulang Plastik: Proses & Manfaatnya', type: 'Video' },
    { id: 'mat-4', title: 'Gaya Hidup Minim Sampah untuk Pemula', type: 'Artikel' },
    { id: 'mat-quiz-6', title: 'Kuis Topik Pengelolaan Sampah', type: 'Kuis' },
  ].map((item) => {
    const isComp = completedIds.includes(item.id);
    const isAct = item.id === lessonId;
    return {
      ...item,
      status: isComp ? 'completed' : isAct ? 'active' : 'locked',
    };
  });

  return (
    <div className="space-y-6">
      
      {/* 🧭 Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C4D38]/60">
            <button
              type="button"
              onClick={onBackToLearningPath}
              className="hover:text-[#1C4D38] hover:underline cursor-pointer"
            >
              Edukasi
            </button>
            <span>&gt;</span>
            <button
              type="button"
              onClick={onBackToLearningPath}
              className="hover:text-[#1C4D38] hover:underline cursor-pointer"
            >
              {topicName}
            </button>
            <span>&gt;</span>
            <span className="text-[#1C4D38] font-black">{lessonData.title}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display">
            {lessonData.title}
          </h2>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="px-2.5 py-0.5 bg-[#D1EBE1] text-[#1C4D38] text-[10px] font-black rounded-full">
              {lessonData.type}
            </span>
            <span className="text-[10px] font-bold text-[#1C4D38]/70 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{lessonData.duration}</span>
            </span>
            <span className="text-[10px] font-black text-[#E07A5F]">
              +{lessonData.points} poin
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToLearningPath}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Learning Path</span>
        </button>
      </div>

      {/* 2-Column Grid: Video Player + Notes (Left) & Playlist + Rewards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): HD Video Simulator + Tabs + Bottom Navigation */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Video Player Simulator Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[32px] overflow-hidden shadow-xs space-y-4 p-4 sm:p-6">
            
            {/* Top Player Strip */}
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-3">
              <span className="text-xs font-black text-[#1C4D38]">
                Materi {lessonData.currentStep} dari {lessonData.totalSteps}
              </span>

              <button
                type="button"
                onClick={handleDownloadMaterial}
                className="px-3 py-1.5 bg-[#FAF5ED] hover:bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-xl text-xs font-black text-[#1C4D38] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Materi</span>
              </button>
            </div>

            {/* Video Canvas Container */}
            <div className="w-full h-64 sm:h-80 lg:h-96 bg-[#1A3326] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner group">
              <img
                src={lessonData.image}
                alt={lessonData.title}
                className="w-full h-full object-contain p-6 filter drop-shadow-2xl"
              />

              {/* Central Play/Pause Trigger */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#1C4D38] shadow-2xl flex items-center justify-center transition-transform transform group-hover:scale-110 active:scale-95 cursor-pointer z-20"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col gap-2 z-20 text-white text-xs">
                {/* Progress Scrub Bar */}
                <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-[#66C699] rounded-full w-[42%]" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="cursor-pointer hover:text-[#66C699]"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="cursor-pointer hover:text-[#66C699]"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span>02:34 / 06:00</span>
                  </div>

                  <div className="flex items-center gap-3 font-bold">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] cursor-pointer">
                      1.25x &gt;
                    </span>
                    <span className="cursor-pointer hover:text-[#66C699]">CC</span>
                    <Maximize2 className="w-4 h-4 cursor-pointer hover:text-[#66C699]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation: Ringkasan | Catatan | Transkrip */}
            <div className="pt-2">
              <div className="flex items-center gap-4 border-b border-[#1C4D38]/10 text-xs font-black">
                {(['Ringkasan', 'Catatan', 'Transkrip'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 border-b-2 transition cursor-pointer ${
                      activeTab === tab
                        ? 'border-[#1C4D38] text-[#1C4D38]'
                        : 'border-transparent text-[#1C4D38]/50 hover:text-[#1C4D38]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Ringkasan */}
              {activeTab === 'Ringkasan' && (
                <div className="space-y-4 pt-4 text-xs">
                  <p className="text-xs text-[#1C4D38]/85 font-medium leading-relaxed">
                    {lessonData.intro}
                  </p>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Hal yang Kamu Pelajari</span>
                    </h4>

                    <div className="space-y-1.5 text-xs text-[#1C4D38]/90 font-medium">
                      {lessonData.learningPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips Praktis Box */}
                  <div className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#1C4D38]/15 flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-black text-[#1C4D38]">Tips Praktis</h5>
                      <p className="text-[11px] text-[#1C4D38]/80 font-medium leading-relaxed">
                        {lessonData.practicalTip}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Catatan */}
              {activeTab === 'Catatan' && (
                <div className="space-y-3 pt-4 text-xs">
                  <p className="text-[#1C4D38]/70 font-medium">
                    Tulis poin-poin penting dari video ini untuk mempermudah ingatanmu:
                  </p>
                  <textarea
                    rows={4}
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Contoh: Perbandingan sampah coklat (daun kering) dan sampah hijau (kulit buah) adalah 2:1..."
                    className="w-full p-3 bg-[#FAF5ED] rounded-xl border border-[#1C4D38]/15 focus:outline-hidden text-xs text-[#1C4D38]"
                  />
                </div>
              )}

              {/* Tab 3: Transkrip */}
              {activeTab === 'Transkrip' && (
                <div className="space-y-2 pt-4 text-xs text-[#1C4D38]/80 font-medium leading-relaxed max-h-48 overflow-y-auto pr-2">
                  <p><strong>[00:15]</strong> Halo Eco Warriors! Selamat datang di modul pembuatan kompos organik rumahan.</p>
                  <p><strong>[01:05]</strong> Pertama, mari siapkan wadah ember bertutup yang telah dilubangi kecil pada bagian dasarnya...</p>
                  <p><strong>[02:30]</strong> Masukkan lapisan pertama berupa tanah subur atau kompos matang sebagai starter bakteri pengurai...</p>
                  <p><strong>[04:10]</strong> Tambahkan sampah sisa sayuran yang telah dicacah halus untuk mempercepat proses dekomposisi...</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Next / Previous Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToLearningPath}
              className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Materi Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={handleComplete}
              className="w-full sm:w-auto px-8 py-3 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isClaimed ? 'Lanjut ke Materi Berikutnya' : 'Tandai Selesai & Lanjut (+20 Poin)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column (4 Cols): Playlist + Points + AI Helper */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Daftar Materi Playlist */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">Daftar Materi</h4>
              <span className="text-[10px] font-bold text-emerald-800">3 / 12 selesai</span>
            </div>

            {/* Progress Topik Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-[#1C4D38]/60">
                <span>Progress Topik</span>
                <span>25%</span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF5ED] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[25%]" />
              </div>
            </div>

            {/* Step Items List */}
            <div className="space-y-2 pt-1">
              {playlistItems.map((item, idx) => {
                const isItemDone = item.status === 'completed';
                const isItemActive = item.status === 'active';
                const isItemLocked = item.status === 'locked';

                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition ${
                      isItemActive
                        ? 'bg-[#D1EBE1]/50 border-emerald-600 font-black text-[#1C4D38]'
                        : isItemDone
                        ? 'bg-white border-[#1C4D38]/10 font-bold text-[#1C4D38]'
                        : 'bg-white/50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FAF5ED] text-[10px] flex items-center justify-center font-black">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] truncate max-w-[170px]">{item.title}</span>
                    </div>

                    <div className="shrink-0">
                      {isItemDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                      {isItemActive && <Play className="w-3.5 h-3.5 text-emerald-800 fill-current" />}
                      {isItemLocked && <Lock className="w-3 h-3 text-gray-400" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onBackToLearningPath}
              className="w-full py-2 bg-[#FAF5ED] hover:bg-[#FAF3E5] border border-[#1C4D38]/10 text-xs font-black text-[#1C4D38] rounded-xl transition cursor-pointer"
            >
              Lihat Learning Path
            </button>
          </div>

          {/* Poin yang Akan Didapatkan Card */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">Poin yang Akan Didapat</p>
              <p className="text-xl font-black text-[#E07A5F] font-display mt-0.5">+20 poin</p>
              <p className="text-[10px] text-[#1C4D38]/70 font-medium">Selesaikan materi ini untuk mendapatkan poin</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E07A5F] shadow-2xs border border-[#1C4D38]/10">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* AI Helper Card */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[28px] p-5 space-y-3 shadow-xs text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D1EBE1] flex items-center justify-center text-[#1C4D38] border border-emerald-500/20">
              <Bot className="w-6 h-6 text-emerald-800" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">
                Butuh Bantuan?
              </h4>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                AI SIRKULA siap menjelaskan materi ini dengan cara yang lebih mudah dipahami!
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAiRecommend}
              className="w-full py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Tanya AI</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FCE39E]" />
            </button>
          </div>

        </div>

      </div>

      {/* 🌟 Custom Alert Modal */}
      <CustomAlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />

    </div>
  );
}
