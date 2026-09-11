'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ChevronRight,
  Sparkles,
  Bot,
  Filter,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

export interface TopicDetailItem {
  id: string;
  name: string;
  count: number;
  desc: string;
  progressPercent: number;
  image: string;
}

export const TOPICS_FULL_LIST: TopicDetailItem[] = [
  {
    id: 'top-1',
    name: 'Pengelolaan Sampah',
    count: 12,
    desc: 'Pelajari cara mengelola sampah dengan benar mulai dari pemilahan, pengurangan, hingga penanganan yang tepat.',
    progressPercent: 75,
    image: '/assets/illustrations/scan-item-bottle.png',
  },
  {
    id: 'top-2',
    name: 'Daur Ulang',
    count: 18,
    desc: 'Kenali proses daur ulang berbagai jenis sampah dan manfaatnya bagi lingkungan dan kehidupan kita.',
    progressPercent: 60,
    image: '/assets/illustrations/edu-plastic-recycle.png',
  },
  {
    id: 'top-3',
    name: 'Kompos & Organik',
    count: 9,
    desc: 'Belajar membuat kompos dari sampah organik dan manfaatnya untuk tanah dan tanaman di sekitar kita.',
    progressPercent: 80,
    image: '/assets/illustrations/edu-compost-bin.png',
  },
  {
    id: 'top-4',
    name: 'Gaya Hidup Hijau',
    count: 16,
    desc: 'Temukan tips dan kebiasaan baik untuk menjalani gaya hidup minim sampah dan lebih ramah lingkungan.',
    progressPercent: 65,
    image: '/assets/illustrations/edu-zero-waste.png',
  },
  {
    id: 'top-5',
    name: 'Isu Lingkungan',
    count: 14,
    desc: 'Pahami berbagai isu lingkungan terkini dan peran kita dalam menjaga bumi untuk masa depan yang lebih baik.',
    progressPercent: 50,
    image: '/assets/illustrations/spring-leaves-bg.png',
  },
  {
    id: 'top-6',
    name: 'Energi & Air',
    count: 8,
    desc: 'Pelajari cara menghemat energi dan air serta pentingnya menjaga sumber daya untuk kehidupan berkelanjutan.',
    progressPercent: 40,
    image: '/assets/illustrations/banana-tip.png',
  },
];

interface EduTopicsViewProps {
  onBackToHub: () => void;
  onSelectTopic: (topicName: string) => void;
  onOpenAiRecommend: () => void;
}

export default function EduTopicsView({
  onBackToHub,
  onSelectTopic,
  onOpenAiRecommend,
}: EduTopicsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRange, setFilterRange] = useState<string | null>(null);

  const filteredTopics = TOPICS_FULL_LIST.filter((top) => {
    const matchSearch =
      top.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      top.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchRange = true;
    if (filterRange === '>15') matchRange = top.count > 15;
    if (filterRange === '10-15') matchRange = top.count >= 10 && top.count <= 15;
    if (filterRange === '<10') matchRange = top.count < 10;

    return matchSearch && matchRange;
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
          <span className="text-[#1C4D38] font-black">Semua Topik</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display">
          Semua Topik
        </h2>
        <p className="text-xs text-[#1C4D38]/70 font-medium">
          Pilih topik yang ingin kamu pelajari. Setiap topik berisi berbagai materi edukasi menarik untuk menambah pengetahuanmu.
        </p>
      </div>

      {/* 🔍 Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#1C4D38]/10 rounded-2xl p-3 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1C4D38]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik yang ingin dipelajari..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF5ED] rounded-xl border border-[#1C4D38]/10 focus:outline-hidden text-[#1C4D38] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#1C4D38]/60 font-bold hidden sm:inline">Urutkan:</span>
          <select className="px-3 py-2 bg-[#FAF5ED] border border-[#1C4D38]/10 rounded-xl text-xs font-bold text-[#1C4D38] cursor-pointer">
            <option>Terbaru</option>
            <option>Paling Populer</option>
            <option>Materi Terbanyak</option>
          </select>
        </div>
      </div>

      {/* 2-Column Grid: 6 Topic Cards (Left) + Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): 6 Topic Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.name)}
              className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              {/* Top: Icon & Topic Name */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-[#FAF5ED] rounded-2xl flex items-center justify-center p-3 border border-[#1C4D38]/10 group-hover:scale-102 transition-transform">
                  <img
                    src={topic.image}
                    alt={topic.name}
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#1C4D38] font-display group-hover:text-emerald-800 transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-[11px] text-[#1C4D38]/70 font-medium line-clamp-3 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              </div>

              {/* Bottom: Progress Bar & Action */}
              <div className="space-y-3 pt-2 border-t border-[#1C4D38]/10">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#1C4D38]/70">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-700" /> {topic.count} materi
                    </span>
                    <span className="font-black text-emerald-800">{topic.progressPercent}% selesai</span>
                  </div>

                  <div className="w-full h-1.5 bg-[#FAF5ED] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${topic.progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTopic(topic.name)}
                  className="w-full py-2 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Mulai Belajar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (4 Cols): Filter Topik & AI Helper */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Filter Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-2.5">
              <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Topik</span>
              </h4>
              <button
                type="button"
                onClick={() => setFilterRange(null)}
                className="text-[10px] font-bold text-gray-500 hover:text-black cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#1C4D38]/90 font-medium">
              <p className="text-[10px] font-black text-[#1C4D38]/60 uppercase">Jumlah Materi</p>
              
              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="countFilter"
                    checked={filterRange === '>15'}
                    onChange={() => setFilterRange('>15')}
                    className="text-[#1C4D38] focus:ring-[#1C4D38]"
                  />
                  <span>&gt; 15 materi</span>
                </div>
                <span className="text-[10px] font-bold text-[#1C4D38]/50">(3)</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="countFilter"
                    checked={filterRange === '10-15'}
                    onChange={() => setFilterRange('10-15')}
                    className="text-[#1C4D38] focus:ring-[#1C4D38]"
                  />
                  <span>10 - 15 materi</span>
                </div>
                <span className="text-[10px] font-bold text-[#1C4D38]/50">(2)</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="countFilter"
                    checked={filterRange === '<10'}
                    onChange={() => setFilterRange('<10')}
                    className="text-[#1C4D38] focus:ring-[#1C4D38]"
                  />
                  <span>&lt; 10 materi</span>
                </div>
                <span className="text-[10px] font-bold text-[#1C4D38]/50">(2)</span>
              </label>
            </div>
          </div>

          {/* AI Helper Banner */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[28px] p-5 space-y-3 shadow-xs text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#D1EBE1] flex items-center justify-center text-[#1C4D38] border border-emerald-500/20">
              <Bot className="w-6 h-6 text-emerald-800" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-[#1C4D38] font-display">
                Belum tahu mulai dari mana?
              </h4>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                Jawab beberapa pertanyaan singkat dan AI SIRKULA akan merekomendasikan topik yang cocok untukmu!
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAiRecommend}
              className="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Temukan Rekomendasi</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            </button>
          </div>

        </div>

      </div>

      {/* 💡 Bottom Motivation Banner */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-xs text-[#1C4D38]/85 font-medium shadow-2xs">
        <div className="w-9 h-9 rounded-xl bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <p>
          <strong>Terus belajar, terus berdampak!</strong> Setiap materi yang kamu pelajari adalah langkah kecil untuk perubahan besar bagi lingkungan.
        </p>
      </div>

    </div>
  );
}
