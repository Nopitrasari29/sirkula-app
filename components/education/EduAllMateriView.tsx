'use client';

import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Bookmark,
  MoreVertical,
  Play,
  FileText,
  Clock,
  Eye,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Bot,
  RotateCcw,
} from 'lucide-react';
import { EduMaterialCard } from './EduHubView';

export const ALL_MATERI_CATALOG: EduMaterialCard[] = [
  {
    id: 'mat-1',
    title: 'Cara Memilah Sampah dengan Benar',
    desc: 'Pelajari cara memilah sampah organik, anorganik, dan B3 dengan tepat untuk memudahkan proses daur ulang.',
    category: 'Pengelolaan Sampah',
    type: 'Video',
    level: 'Pemula',
    duration: '4:32',
    date: '12 Jul 2026',
    views: '1,2K views',
    points: 20,
    image: '/assets/illustrations/edu-sort-waste.png',
  },
  {
    id: 'mat-2',
    title: 'Membuat Kompos dari Sampah Organik',
    desc: 'Ubah sampah organik menjadi kompos berkualitas tinggi yang bermanfaat untuk tanaman.',
    category: 'Kompos & Organik',
    type: 'Artikel',
    level: 'Pemula',
    duration: '6:15',
    date: '10 Jul 2026',
    views: '890 views',
    points: 20,
    image: '/assets/illustrations/edu-compost-bin.png',
  },
  {
    id: 'mat-3',
    title: 'Daur Ulang Plastik: Proses & Manfaatnya',
    desc: 'Kenali proses daur ulang plastik dan dampaknya bagi lingkungan serta manfaat ekonominya.',
    category: 'Daur Ulang',
    type: 'Video',
    level: 'Menengah',
    duration: '5:07',
    date: '8 Jul 2026',
    views: '1,5K views',
    points: 20,
    image: '/assets/illustrations/edu-plastic-recycle.png',
  },
  {
    id: 'mat-4',
    title: 'Gaya Hidup Minim Sampah untuk Pemula',
    desc: 'Mulai gaya hidup minim sampah dari kebiasaan kecil sehari-hari yang mudah dilakukan.',
    category: 'Gaya Hidup Hijau',
    type: 'Artikel',
    level: 'Pemula',
    duration: '3:45',
    date: '6 Jul 2026',
    views: '780 views',
    points: 20,
    image: '/assets/illustrations/edu-zero-waste.png',
  },
  {
    id: 'mat-5',
    title: 'Isu Lingkungan Global yang Perlu Kita Tahu',
    desc: 'Memahami berbagai isu lingkungan global dan peran kita untuk masa depan bumi yang lebih baik.',
    category: 'Isu Lingkungan',
    type: 'Video',
    level: 'Menengah',
    duration: '7:12',
    date: '3 Jul 2026',
    views: '2,3K views',
    points: 20,
    image: '/assets/illustrations/spring-leaves-bg.png',
  },
];

interface EduAllMateriViewProps {
  onBackToHub: () => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenAiRecommend: () => void;
  completedIds: string[];
}

export default function EduAllMateriView({
  onBackToHub,
  onSelectLesson,
  onOpenAiRecommend,
  completedIds,
}: EduAllMateriViewProps) {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Video' | 'Artikel' | 'Infografis' | 'Panduan'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [bookmarkedList, setBookmarkedList] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    setBookmarkedList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const filteredMateri = ALL_MATERI_CATALOG.filter((mat) => {
    const matchType = activeTab === 'Semua' || mat.type === activeTab;
    const matchSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff =
      selectedDifficulty.length === 0 || selectedDifficulty.includes(mat.level);
    const matchTopic =
      selectedTopics.length === 0 || selectedTopics.includes(mat.category);

    return matchType && matchSearch && matchDiff && matchTopic;
  });

  return (
    <div className="space-y-6">
      
      {/* 🧭 Breadcrumb & Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1C4D38]/60">
          <button
            type="button"
            onClick={onBackToHub}
            className="hover:text-[#1C4D38] hover:underline cursor-pointer"
          >
            Edukasi
          </button>
          <span>&gt;</span>
          <span className="text-[#1C4D38] font-black">Materi Terbaru</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display flex items-center gap-2">
          <span>Materi Terbaru</span>
          <span>📖</span>
        </h2>
        <p className="text-xs text-[#1C4D38]/70 font-medium">
          Temukan berbagai materi edukasi terbaru seputar pengelolaan sampah, daur ulang, gaya hidup hijau, dan isu lingkungan.
        </p>
      </div>

      {/* 🔍 Top Search & Filter Bar */}
      <div className="bg-white border border-[#1C4D38]/10 rounded-2xl p-3 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#1C4D38]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi edukasi..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF5ED] rounded-xl border border-[#1C4D38]/10 focus:outline-hidden text-[#1C4D38] font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="px-3 py-2 bg-[#FAF5ED] border border-[#1C4D38]/10 rounded-xl text-xs font-bold text-[#1C4D38] cursor-pointer"
            >
              <option value="Semua">Semua Tipe</option>
              <option value="Video">Video</option>
              <option value="Artikel">Artikel</option>
            </select>

            <select className="px-3 py-2 bg-[#FAF5ED] border border-[#1C4D38]/10 rounded-xl text-xs font-bold text-[#1C4D38] cursor-pointer">
              <option>Semua Topik</option>
              <option>Pengelolaan Sampah</option>
              <option>Daur Ulang</option>
              <option>Kompos & Organik</option>
            </select>

            <select className="px-3 py-2 bg-[#FAF5ED] border border-[#1C4D38]/10 rounded-xl text-xs font-bold text-[#1C4D38] cursor-pointer">
              <option>Semua Tingkat</option>
              <option>Pemula</option>
              <option>Menengah</option>
            </select>

            <select className="px-3 py-2 bg-[#FAF5ED] border border-[#1C4D38]/10 rounded-xl text-xs font-bold text-[#1C4D38] cursor-pointer">
              <option>Terbaru</option>
              <option>Paling Populer</option>
            </select>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#1C4D38]/10">
          {(
            [
              { id: 'Semua', label: 'Semua (46)' },
              { id: 'Video', label: 'Video (20)' },
              { id: 'Artikel', label: 'Artikel (18)' },
              { id: 'Infografis', label: 'Infografis (5)' },
              { id: 'Panduan', label: 'Panduan (3)' },
            ] as const
          ).map((t) => {
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C4D38] text-white shadow-2xs'
                    : 'bg-[#FAF5ED] text-[#1C4D38]/80 hover:bg-[#FAF3E5]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Horizontal Material Cards List */}
        <div className="lg:col-span-8 space-y-4">
          <p className="text-xs text-[#1C4D38]/60 font-bold">
            {filteredMateri.length} materi ditemukan
          </p>

          <div className="space-y-3.5">
            {filteredMateri.map((mat) => {
              const isDone = completedIds.includes(mat.id);
              const isBookmarked = bookmarkedList.includes(mat.id);
              return (
                <div
                  key={mat.id}
                  onClick={() => onSelectLesson(mat.id)}
                  className="p-4 bg-white border border-[#1C4D38]/10 rounded-[24px] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center gap-4 group"
                >
                  {/* Left Thumbnail with Duration */}
                  <div className="w-full sm:w-44 h-28 bg-[#FAF5ED] rounded-2xl relative overflow-hidden flex items-center justify-center p-2 shrink-0">
                    <img
                      src={mat.image}
                      alt={mat.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {mat.type === 'Video' && (
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 text-[#1C4D38] flex items-center justify-center shadow-xs">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-black rounded">
                      {mat.duration}
                    </span>

                    {isDone && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded-full">
                        ✓ Selesai
                      </span>
                    )}
                  </div>

                  {/* Center Content */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#D1EBE1] text-[#1C4D38] text-[9px] font-black rounded">
                        {mat.type}
                      </span>
                      <span className="px-2 py-0.5 bg-[#FAF3E5] text-[#9B6A1B] text-[9px] font-black rounded">
                        {mat.level}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-[#1C4D38] font-display group-hover:text-emerald-800 transition-colors">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-[#1C4D38]/70 font-medium line-clamp-2 leading-relaxed">
                      {mat.desc}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-[#1C4D38]/60 font-bold pt-1">
                      <span>{mat.date}</span>
                      <span>•</span>
                      <span>{mat.views}</span>
                      <span>•</span>
                      <span className="text-[#E07A5F] font-black">+{mat.points} poin</span>
                    </div>
                  </div>

                  {/* Right Action Icons */}
                  <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(mat.id);
                      }}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#1C4D38] text-white'
                          : 'bg-[#FAF5ED] hover:bg-gray-200 text-[#1C4D38]'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1C4D38]/10 text-xs">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg bg-white border border-[#1C4D38]/10 flex items-center justify-center font-bold">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#1C4D38] text-white flex items-center justify-center font-black">
                1
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-[#1C4D38]/10 flex items-center justify-center font-bold">
                2
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-[#1C4D38]/10 flex items-center justify-center font-bold">
                3
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-7 h-7 rounded-lg bg-white border border-[#1C4D38]/10 flex items-center justify-center font-bold">
                9
              </button>
              <button className="w-7 h-7 rounded-lg bg-white border border-[#1C4D38]/10 flex items-center justify-center font-bold">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[11px] text-[#1C4D38]/60 font-medium">
              Tampilkan <strong>10</strong> per halaman
            </span>
          </div>

        </div>

        {/* Right Column (4 Cols): Filter Accordion & AI Recommendation */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Filter Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setSelectedDifficulty([]);
                  setSelectedTopics([]);
                }}
                className="text-[10px] font-bold text-gray-500 hover:text-black cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Tingkat Kesulitan */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-[#1C4D38]/60 uppercase">Tingkat Kesulitan</p>
              <div className="space-y-1.5 text-xs text-[#1C4D38]/90 font-medium">
                {[
                  { id: 'Pemula', label: 'Pemula', count: 23, icon: '🌱' },
                  { id: 'Menengah', label: 'Menengah', count: 15, icon: '🌿' },
                  { id: 'Lanjutan', label: 'Lanjutan', count: 8, icon: '🌳' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between cursor-pointer py-0.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDifficulty.includes(item.id)}
                        onChange={() => toggleFilter(selectedDifficulty, setSelectedDifficulty, item.id)}
                        className="rounded text-[#1C4D38] focus:ring-[#1C4D38]"
                      />
                      <span>{item.icon} {item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1C4D38]/50">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Topik Filter */}
            <div className="space-y-2 pt-2 border-t border-[#1C4D38]/10">
              <p className="text-[10px] font-black text-[#1C4D38]/60 uppercase">Topik</p>
              <div className="space-y-1.5 text-xs text-[#1C4D38]/90 font-medium">
                {[
                  { id: 'Pengelolaan Sampah', label: 'Pengelolaan Sampah', count: 14 },
                  { id: 'Daur Ulang', label: 'Daur Ulang', count: 12 },
                  { id: 'Kompos & Organik', label: 'Kompos & Organik', count: 8 },
                  { id: 'Gaya Hidup Hijau', label: 'Gaya Hidup Hijau', count: 7 },
                  { id: 'Isu Lingkungan', label: 'Isu Lingkungan', count: 5 },
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between cursor-pointer py-0.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(item.id)}
                        onChange={() => toggleFilter(selectedTopics, setSelectedTopics, item.id)}
                        className="rounded text-[#1C4D38] focus:ring-[#1C4D38]"
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1C4D38]/50">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Durasi Video */}
            <div className="space-y-2 pt-2 border-t border-[#1C4D38]/10">
              <p className="text-[10px] font-black text-[#1C4D38]/60 uppercase">Durasi Video</p>
              <div className="space-y-1.5 text-xs text-[#1C4D38]/90 font-medium">
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1C4D38]" />
                    <span>&lt; 5 menit</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1C4D38]/50">10</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1C4D38]" />
                    <span>5 - 15 menit</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1C4D38]/50">7</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1C4D38]" />
                    <span>&gt; 15 menit</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1C4D38]/50">3</span>
                </label>
              </div>
            </div>
          </div>

          {/* Total Poin Card */}
          <div className="bg-[#FAF3E5] border border-[#1C4D38]/10 rounded-[28px] p-5 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] text-[#1C4D38]/60 font-bold uppercase">Total Poin dari Materi</p>
              <p className="text-xl font-black text-emerald-800 font-display mt-0.5">+920 poin</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E07A5F] shadow-2xs border border-[#1C4D38]/10">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[28px] p-5 space-y-3 shadow-xs text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D1EBE1] flex items-center justify-center text-[#1C4D38] border border-emerald-500/20">
              <Bot className="w-6 h-6 text-emerald-800" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">
                Butuh rekomendasi materi?
              </h4>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                AI SIRKULA siap membantumu menemukan materi yang paling sesuai untukmu!
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAiRecommend}
              className="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Dapatkan Rekomendasi</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
