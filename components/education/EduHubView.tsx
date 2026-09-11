'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Clock,
  Eye,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  Trophy,
  Flame,
  Lightbulb,
  Zap,
  Bookmark,
} from 'lucide-react';
import { getBookmarkedEducation } from '@/lib/utils/storage';

export interface EduMaterialCard {
  id: string;
  title: string;
  desc: string;
  category: string;
  type: 'Video' | 'Artikel' | 'Infografis' | 'Panduan';
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  duration: string;
  date: string;
  views: string;
  points: number;
  image: string;
  completed?: boolean;
}

export const FEATURED_CAROUSEL_DATA = [
  {
    id: 'feat-1',
    badge: 'Materi Unggulan',
    readTime: '5 min baca',
    title: 'Kenali Jenis Sampah dan Cara Mengelolanya',
    desc: 'Yuk, kenali berbagai jenis sampah di sekitar kita dan cara mengelolanya dengan benar.',
    image: '/assets/illustrations/sirkula-truck.png',
    topicTarget: 'Pengelolaan Sampah',
  },
  {
    id: 'feat-2',
    badge: 'Trending Minggu Ini',
    readTime: '6 min video',
    title: 'Membuat Kompos dari Sampah Organik Kos',
    desc: 'Ubah sisa sayuran dan buah menjadi pupuk kompos berkualitas tinggi tanpa bau.',
    image: '/assets/illustrations/edu-compost-bin.png',
    topicTarget: 'Kompos & Organik',
  },
];

export const LATEST_MATERI_LIST: EduMaterialCard[] = [
  {
    id: 'mat-1',
    title: 'Cara Memilah Sampah dengan Benar',
    desc: 'Pelajari cara memilah sampah organik, anorganik, dan B3 dengan tepat untuk memudahkan daur ulang.',
    category: 'Pengelolaan Sampah',
    type: 'Video',
    level: 'Pemula',
    duration: '4:32',
    date: '12 Jul 2026',
    views: '1,2k',
    points: 20,
    image: '/assets/illustrations/edu-sort-waste.png',
  },
  {
    id: 'mat-2',
    title: 'Membuat Kompos dari Sampah Organik',
    desc: 'Ubah sampah organik menjadi kompos yang bermanfaat untuk tanah dan tanaman.',
    category: 'Kompos & Organik',
    type: 'Artikel',
    level: 'Pemula',
    duration: '6:15',
    date: '10 Jul 2026',
    views: '890',
    points: 20,
    image: '/assets/illustrations/edu-compost-bin.png',
  },
  {
    id: 'mat-3',
    title: 'Daur Ulang Plastik: Proses & Manfaatnya',
    desc: 'Kenali proses daur ulang plastik dan dampaknya bagi lingkungan serta nilai ekonominya.',
    category: 'Daur Ulang',
    type: 'Video',
    level: 'Menengah',
    duration: '5:07',
    date: '8 Jul 2026',
    views: '1,5k',
    points: 20,
    image: '/assets/illustrations/edu-plastic-recycle.png',
  },
  {
    id: 'mat-4',
    title: 'Gaya Hidup Minim Sampah untuk Pemula',
    desc: 'Mulai gaya hidup minim sampah dari kebiasaan kecil sehari-hari.',
    category: 'Gaya Hidup Hijau',
    type: 'Artikel',
    level: 'Pemula',
    duration: '3:45',
    date: '6 Jul 2026',
    views: '780',
    points: 20,
    image: '/assets/illustrations/edu-zero-waste.png',
  },
];

export const TOPICS_OVERVIEW = [
  {
    id: 'top-1',
    name: 'Pengelolaan Sampah',
    count: '12 materi',
    desc: 'Belajar cara mengelola sampah dengan tepat.',
    progress: 75,
    icon: '/assets/illustrations/scan-item-bottle.png',
  },
  {
    id: 'top-2',
    name: 'Daur Ulang',
    count: '18 materi',
    desc: 'Proses daur ulang dan manfaatnya untuk bumi.',
    progress: 60,
    icon: '/assets/illustrations/edu-plastic-recycle.png',
  },
  {
    id: 'top-3',
    name: 'Kompos & Organik',
    count: '9 materi',
    desc: 'Mengelola sampah organik jadi sesuatu yang berguna.',
    progress: 80,
    icon: '/assets/illustrations/edu-compost-bin.png',
  },
  {
    id: 'top-4',
    name: 'Gaya Hidup Hijau',
    count: '16 materi',
    desc: 'Kebiasaan kecil untuk hidup yang lebih hijau.',
    progress: 65,
    icon: '/assets/illustrations/edu-zero-waste.png',
  },
  {
    id: 'top-5',
    name: 'Isu Lingkungan',
    count: '14 materi',
    desc: 'Mengenali isu lingkungan dan cara mengatasinya.',
    progress: 50,
    icon: '/assets/illustrations/spring-leaves-bg.png',
  },
];

interface EduHubViewProps {
  onNavigateToAllMateri: (initialTab?: 'Semua' | 'Video' | 'Artikel' | 'Infografis' | 'Panduan' | 'Tersimpan') => void;
  onNavigateToTopics: () => void;
  onSelectTopic: (topicName: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onStartDailyQuiz: () => void;
  completedIds: string[];
}

export default function EduHubView({
  onNavigateToAllMateri,
  onNavigateToTopics,
  onSelectTopic,
  onSelectLesson,
  onStartDailyQuiz,
  completedIds,
}: EduHubViewProps) {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getBookmarkedEducation().length);
    const handleStorage = () => {
      setSavedCount(getBookmarkedEducation().length);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const categories = ['Semua', 'Pengelolaan Sampah', 'Daur Ulang', 'Gaya Hidup Hijau', 'Lingkungan'];

  const handleNextCarousel = () => {
    setCarouselIdx((prev) => (prev + 1) % FEATURED_CAROUSEL_DATA.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIdx((prev) => (prev - 1 + FEATURED_CAROUSEL_DATA.length) % FEATURED_CAROUSEL_DATA.length);
  };

  const currentFeat = FEATURED_CAROUSEL_DATA[carouselIdx];

  const filteredMateri = LATEST_MATERI_LIST.filter((mat) => {
    const matchesSearch = mat.title.toLowerCase().includes(searchQuery.toLowerCase()) || mat.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || mat.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  const totalMateri = 20;
  const totalVideos = 15;
  const totalQuiz = 10;
  const readCount = Math.min(totalMateri, 12 + (completedIds?.length || 0));
  const videoCount = Math.min(totalVideos, 8 + Math.floor((completedIds?.length || 0) / 2));
  const quizCount = Math.min(totalQuiz, 5 + (completedIds?.some((id) => id.includes('quiz')) ? 1 : 0));
  const totalCompleted = readCount + videoCount + quizCount;
  const totalTarget = totalMateri + totalVideos + totalQuiz;
  const progressPct = Math.min(100, Math.round((totalCompleted / totalTarget) * 100));
  const totalEduPoints = 240 + (completedIds?.length || 0) * 20;

  return (
    <div className="space-y-6">

      {/* 🔍 Search & Category Pills Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#1C4D38]/10 shadow-2xs">

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1C4D38]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi edukasi..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-transparent border-none focus:outline-hidden text-[#1C4D38] placeholder-[#1C4D38]/40 font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${isSelected
                    ? 'bg-[#1C4D38] text-white shadow-2xs'
                    : 'bg-[#FAF5ED] text-[#1C4D38]/80 hover:bg-[#FAF3E5]'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* 🌟 2-Column Main Layout: Left (Hero + Materi + Topik) & Right (Progress & Kuis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (8 Cols): Hero Banner, Materi Terbaru, Belajar Berdasarkan Topik */}
        <div className="lg:col-span-8 space-y-6">

          {/* 🚚 Hero Featured Carousel Banner */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* Carousel Nav Arrows */}
            <button
              type="button"
              onClick={handlePrevCarousel}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-[#1C4D38]/10 flex items-center justify-center text-[#1C4D38] hover:bg-white z-20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextCarousel}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-[#1C4D38]/10 flex items-center justify-center text-[#1C4D38] hover:bg-white z-20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Left Content */}
            <div className="space-y-3 z-10 pl-6 pr-2 sm:pl-8 text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-0.5 bg-[#D1EBE1] text-[#1C4D38] text-[10px] font-black uppercase rounded-full">
                  {currentFeat.badge}
                </span>
                <span className="text-[10px] font-bold text-[#1C4D38]/70 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentFeat.readTime}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display leading-snug">
                {currentFeat.title}
              </h2>

              <p className="text-xs text-[#1C4D38]/80 font-medium leading-relaxed max-w-md">
                {currentFeat.desc}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectTopic(currentFeat.topicTarget)}
                  className="px-6 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Pelajari Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots Pagination */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                {FEATURED_CAROUSEL_DATA.map((_, dotIdx) => (
                  <div
                    key={dotIdx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${dotIdx === carouselIdx ? 'w-5 bg-[#1C4D38]' : 'w-1.5 bg-[#1C4D38]/25'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-56 sm:w-64 h-36 sm:h-44 bg-white/60 rounded-2xl flex items-center justify-center p-3 border border-[#1C4D38]/10 shadow-2xs shrink-0 z-10 mr-6">
              <img
                src={currentFeat.image}
                alt={currentFeat.title}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>

          </div>

          {/* Section 1: Materi Terbaru */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-base font-black text-[#1C4D38] font-display flex items-center gap-2">
                <span>Materi Terbaru</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateToAllMateri('Tersimpan')}
                  className="text-xs font-bold text-[#1C4D38] hover:text-emerald-950 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-[#1C4D38]/10 hover:border-emerald-600 shadow-2xs transition cursor-pointer"
                  title="Buka Materi yang Disimpan"
                >
                  <Bookmark className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Materi Tersimpan</span>
                  {savedCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#D1EBE1] text-[#1C4D38] text-[10px] font-black rounded-full">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToAllMateri('Semua')}
                  className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredMateri.slice(0, 4).map((mat) => {
                const isCompleted = completedIds.includes(mat.id);
                return (
                  <div
                    key={mat.id}
                    onClick={() => onSelectLesson(mat.id)}
                    className="bg-white border border-[#1C4D38]/10 rounded-[22px] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                  >
                    {/* Thumbnail */}
                    <div className="w-full h-32 bg-[#FAF5ED] relative overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={mat.image}
                        alt={mat.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Play Button Overlay if Video */}
                      {mat.type === 'Video' && (
                        <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/90 text-[#1C4D38] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-black rounded">
                        {mat.duration}
                      </span>

                      {/* Done Ribbon */}
                      {isCompleted && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded-full shadow-xs">
                          ✓ Selesai
                        </span>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-[#D1EBE1] text-[#1C4D38] text-[9px] font-black rounded">
                            {mat.type}
                          </span>
                          <span className="px-2 py-0.5 bg-[#FAF3E5] text-[#9B6A1B] text-[9px] font-black rounded">
                            {mat.level}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-[#1C4D38] font-display line-clamp-2 group-hover:text-emerald-800 transition-colors">
                          {mat.title}
                        </h4>

                        <p className="text-[10px] text-[#1C4D38]/70 font-medium line-clamp-2 leading-relaxed">
                          {mat.desc}
                        </p>
                      </div>

                      {/* Footer Stats */}
                      <div className="pt-2 border-t border-[#1C4D38]/10 flex items-center justify-between text-[9px] text-[#1C4D38]/60 font-bold">
                        <span>{mat.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3" />
                            <span>{mat.views}</span>
                          </span>
                          <span className="text-[#E07A5F] font-black">+{mat.points} poin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🌿 Section 2: Belajar Berdasarkan Topik */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1C4D38] font-display flex items-center gap-2">
                <span>Belajar Berdasarkan Topik</span>
              </h3>

              <button
                type="button"
                onClick={onNavigateToTopics}
                className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5 Topic Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TOPICS_OVERVIEW.map((top) => (
                <div
                  key={top.id}
                  onClick={() => onSelectTopic(top.name)}
                  className="bg-white border border-[#1C4D38]/10 rounded-[22px] p-3.5 space-y-2.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] p-2 flex items-center justify-center border border-[#1C4D38]/10 group-hover:scale-110 transition-transform">
                    <img src={top.icon} alt={top.name} className="w-full h-full object-contain" />
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-[#1C4D38] font-display line-clamp-1">
                      {top.name}
                    </h4>
                    <p className="text-[10px] text-[#1C4D38]/60 font-bold mt-0.5">
                      {top.count}
                    </p>
                    <p className="text-[9px] text-[#1C4D38]/70 font-medium line-clamp-2 mt-1 leading-tight">
                      {top.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 Cols): Progress Belajarmu + Kuis Hari Ini + Pencapaian */}
        <div className="lg:col-span-4 space-y-5">

          {/* 1. Progress Belajarmu Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">Progress Belajarmu</h4>
              <button
                type="button"
                onClick={onNavigateToTopics}
                className="text-[10px] font-bold text-emerald-800 flex items-center gap-0.5 cursor-pointer hover:underline"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Circular Progress & Breakdown */}
            <div className="flex items-center gap-3.5">
              {/* Compact Fixed Radial Circle Gauge */}
              <div className="relative w-20 h-20 sm:w-[84px] sm:h-[84px] shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#FAF5ED]"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-600 transition-all duration-700"
                    strokeDasharray={`${progressPct}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xs sm:text-sm font-black text-[#1C4D38] leading-none">
                    {progressPct}%
                  </span>
                  <span className="text-[7px] text-[#1C4D38]/60 font-bold uppercase tracking-wider mt-0.5">
                    Progress
                  </span>
                </div>
              </div>

              {/* Stats List with Clean Spacing & No Overflow */}
              <div className="space-y-2 text-[11px] text-[#1C4D38] font-bold flex-1 min-w-0">
                <div className="flex justify-between items-center gap-1.5">
                  <span className="text-[#1C4D38]/70 flex items-center gap-1.5 min-w-0">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Materi Dibaca</span>
                  </span>
                  <span className="font-black shrink-0 whitespace-nowrap">
                    {readCount} / {totalMateri}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-1.5">
                  <span className="text-[#1C4D38]/70 flex items-center gap-1.5 min-w-0">
                    <Play className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Video Ditonton</span>
                  </span>
                  <span className="font-black shrink-0 whitespace-nowrap">
                    {videoCount} / {totalVideos}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-1.5">
                  <span className="text-[#1C4D38]/70 flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Kuis Selesai</span>
                  </span>
                  <span className="font-black shrink-0 whitespace-nowrap">
                    {quizCount} / {totalQuiz}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Points Pill Banner */}
            <div className="p-3 bg-[#FAF3E5] rounded-2xl border border-[#1C4D38]/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center font-black shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-[#1C4D38]">+{totalEduPoints} poin</p>
                  <p className="text-[9px] text-[#1C4D38]/60 font-bold truncate">Total Poin dari Edukasi</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1C4D38]/40 shrink-0" />
            </div>
          </div>

          {/* 2. Kuis Hari Ini Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">Kuis Hari Ini</h4>
              <span className="text-[10px] font-bold text-emerald-800">Tantangan Harian</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5ED] flex items-center justify-center text-[#1C4D38] border border-[#1C4D38]/10 shrink-0">
                <Trophy className="w-6 h-6 text-[#E07A5F]" />
              </div>
              <div>
                <h5 className="text-xs font-black text-[#1C4D38]">Uji pengetahuanmu hari ini!</h5>
                <p className="text-[10px] text-[#1C4D38]/70 font-medium leading-tight mt-0.5">
                  Kerjakan kuis harian dan dapatkan poin bonusnya!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#1C4D38]/70 font-bold px-1">
              <span className="flex items-center gap-1 text-[#E07A5F] font-black">
                <Award className="w-3.5 h-3.5" /> 20 poin
              </span>
              <span>5 pertanyaan</span>
              <span>⏱ ± 3 menit</span>
            </div>

            <button
              type="button"
              onClick={onStartDailyQuiz}
              className="w-full py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Mulai Kuis Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Pencapaian Edukasi Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">Pencapaian Edukasi</h4>
              <span className="text-[10px] font-bold text-emerald-800">4 Lencana</span>
            </div>

            <div className="space-y-2 text-xs font-bold text-[#1C4D38]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#1C4D38]/70 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" /> Materi Selesai
                </span>
                <span className="font-black">12</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#1C4D38]/70 flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-emerald-700" /> Video Ditonton
                </span>
                <span className="font-black">8</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#1C4D38]/70 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Kuis Selesai
                </span>
                <span className="font-black">5</span>
              </div>
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#1C4D38]/10">
                <span className="text-[#1C4D38]/70 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#E07A5F]" /> Total Poin
                </span>
                <span className="font-black text-[#E07A5F]">240</span>
              </div>
            </div>

            {/* Badge Edukasi Icons */}
            <div className="pt-2 border-t border-[#1C4D38]/10 flex items-center justify-between">
              <span className="text-[10px] font-black text-[#1C4D38]/70 uppercase">Badge Edukasi</span>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black shadow-2xs">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-black shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black text-[#1C4D38] ml-1">2</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 💡 Bottom Eco Fact Banner */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 text-xs text-[#1C4D38]/85 font-medium">
          <div className="w-9 h-9 rounded-xl bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <p>
            <strong>Tahukah kamu?</strong> 1 ton sampah plastik yang didaur ulang dapat menghemat hingga 6.000 kWh energi listrik.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToTopics}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0 text-center"
        >
          Jelajahi Sekarang
        </button>
      </div>

    </div>
  );
}
