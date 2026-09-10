'use client';

import React, { useMemo } from 'react';
import {
  ChevronLeft,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Check,
  Lock,
  Play,
  FileText,
  HelpCircle,
  Sparkles,
  Bot,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Building2,
  Recycle,
  ChevronRight,
} from 'lucide-react';

export interface LearningPathStep {
  id: string;
  stepNumber: number;
  title: string;
  type: 'Video' | 'Artikel' | 'Kuis' | 'Bank';
  duration: string;
  points: number;
  status: 'completed' | 'active' | 'locked';
  desc?: string;
}

export const TOPIC_LEARNING_PATHS: Record<string, LearningPathStep[]> = {
  'Pengelolaan Sampah': [
    {
      id: 'mat-1',
      stepNumber: 1,
      title: 'Cara Memilah Sampah dengan Benar',
      type: 'Video',
      duration: '4 menit',
      points: 20,
      status: 'completed',
    },
    {
      id: 'mat-sort-2',
      stepNumber: 2,
      title: 'Jenis-jenis Sampah dan Karakteristiknya',
      type: 'Artikel',
      duration: '5 menit',
      points: 20,
      status: 'completed',
    },
    {
      id: 'mat-2',
      stepNumber: 3,
      title: 'Membuat Kompos dari Sampah Organik',
      type: 'Video',
      duration: '6 menit',
      points: 20,
      status: 'active',
      desc: 'Pelajari proses sederhana mengolah sisa makanan menjadi kompos berkualitas.',
    },
    {
      id: 'mat-bank-4',
      stepNumber: 4,
      title: 'Bank Sampah: Pengertian dan Manfaat',
      type: 'Bank',
      duration: '5 menit',
      points: 20,
      status: 'locked',
      desc: 'Belum terbuka. Selesaikan materi sebelumnya.',
    },
    {
      id: 'mat-3r-5',
      stepNumber: 5,
      title: 'Reduce, Reuse, Recycle (3R) dalam Kehidupan Sehari-hari',
      type: 'Artikel',
      duration: '7 menit',
      points: 20,
      status: 'locked',
      desc: 'Belum terbuka. Selesaikan materi sebelumnya.',
    },
    {
      id: 'mat-quiz-6',
      stepNumber: 6,
      title: 'Kuis Topik Pengelolaan Sampah',
      type: 'Kuis',
      duration: '10 soal',
      points: 50,
      status: 'locked',
      desc: 'Selesaikan semua materi untuk membuka kuis.',
    },
  ],
};

interface EduLearningPathViewProps {
  topicName: string;
  onBackToTopics: () => void;
  onSelectLesson: (lessonId: string) => void;
  onOpenAiRecommend: () => void;
  completedIds: string[];
}

export default function EduLearningPathView({
  topicName,
  onBackToTopics,
  onSelectLesson,
  onOpenAiRecommend,
  completedIds,
}: EduLearningPathViewProps) {
  const baseSteps =
    TOPIC_LEARNING_PATHS[topicName] || TOPIC_LEARNING_PATHS['Pengelolaan Sampah'];

  // 📈 Dynamically compute status for each step based on completedIds from storage
  const steps = useMemo(() => {
    let hasFoundActive = false;
    return baseSteps.map((step) => {
      const isCompleted = completedIds.includes(step.id);
      if (isCompleted) {
        return { ...step, status: 'completed' as const };
      }
      if (!hasFoundActive) {
        hasFoundActive = true;
        return { ...step, status: 'active' as const };
      }
      return { ...step, status: 'locked' as const };
    });
  }, [baseSteps, completedIds]);

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      
      {/* 🧭 Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C4D38]/60">
            <button
              type="button"
              onClick={onBackToTopics}
              className="hover:text-[#1C4D38] hover:underline cursor-pointer"
            >
              Edukasi
            </button>
            <span>&gt;</span>
            <button
              type="button"
              onClick={onBackToTopics}
              className="hover:text-[#1C4D38] hover:underline cursor-pointer"
            >
              Semua Topik
            </button>
            <span>&gt;</span>
            <span className="text-[#1C4D38] font-black">{topicName}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display flex items-center gap-2">
            <span>{topicName}</span>
            <span className="text-emerald-700">♻️</span>
          </h2>
          <p className="text-xs text-[#1C4D38]/70 font-medium">
            Pelajari cara mengelola sampah dengan benar, mulai dari pemilahan, pengurangan, hingga pengolahan untuk lingkungan yang lebih bersih dan sehat.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToTopics}
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-black rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Semua Topik</span>
        </button>
      </div>

      {/* 📊 Top Progress Summary Card */}
      <div className="bg-white border border-[#1C4D38]/10 rounded-[32px] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Illustration & Progress Bar */}
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-20 h-20 bg-[#FAF5ED] rounded-2xl flex items-center justify-center p-2 border border-[#1C4D38]/10 shrink-0">
            <img
              src="/assets/illustrations/scan-item-bottle.png"
              alt="Icon Topik"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[#1C4D38]">Progress Belajarmu</span>
              <span className="font-black text-emerald-800">{progressPercent}%</span>
            </div>

            <div className="w-full h-2.5 bg-[#FAF5ED] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[10px] text-[#1C4D38]/60 font-bold">
              {completedCount} dari {totalCount} materi selesai
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-16 bg-[#1C4D38]/10" />

        {/* Right Stats Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center shrink-0 w-full md:w-auto">
          <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#1C4D38]/10">
            <Clock className="w-4 h-4 text-emerald-800 mx-auto" />
            <p className="text-[9px] text-[#1C4D38]/60 font-bold mt-1 uppercase">Estimasi Waktu</p>
            <p className="text-xs font-black text-[#1C4D38] mt-0.5">2 jam 15 mnt</p>
          </div>

          <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#1C4D38]/10">
            <BookOpen className="w-4 h-4 text-emerald-800 mx-auto" />
            <p className="text-[9px] text-[#1C4D38]/60 font-bold mt-1 uppercase">Jumlah Materi</p>
            <p className="text-xs font-black text-[#1C4D38] mt-0.5">12 materi</p>
          </div>

          <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#1C4D38]/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 mx-auto" />
            <p className="text-[9px] text-[#1C4D38]/60 font-bold mt-1 uppercase">Kuis</p>
            <p className="text-xs font-black text-[#1C4D38] mt-0.5">1 kuis</p>
          </div>

          <div className="p-3 bg-[#FAF3E5] rounded-2xl border border-[#1C4D38]/10">
            <Award className="w-4 h-4 text-[#E07A5F] mx-auto" />
            <p className="text-[9px] text-[#1C4D38]/60 font-bold mt-1 uppercase">Total Poin</p>
            <p className="text-xs font-black text-[#E07A5F] mt-0.5">240 poin</p>
          </div>
        </div>

      </div>

      {/* 2-Column Grid: Learning Path (Left) + Rewards & Help (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols): Learning Path Vertical Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#1C4D38] font-display">
                Learning Path
              </h3>
              <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                Ikuti urutan materi untuk hasil belajar yang maksimal.
              </p>
            </div>

            <button
              type="button"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              Expand All
            </button>
          </div>

          {/* Stepper Node List */}
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isLocked = step.status === 'locked';

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    if (!isLocked) {
                      onSelectLesson(step.id);
                    }
                  }}
                  className={`p-4 rounded-[24px] border transition-all duration-200 flex items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-[#D1EBE1]/40 border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/10 cursor-pointer'
                      : isCompleted
                      ? 'bg-white border-[#1C4D38]/10 shadow-2xs hover:shadow-xs cursor-pointer'
                      : 'bg-white/60 border-gray-200 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {/* Left: Step Circle + Icon + Title */}
                  <div className="flex items-center gap-3.5 flex-1">
                    {/* Circle Step Number */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-[#1C4D38] text-white ring-4 ring-[#1C4D38]/15'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.stepNumber}
                    </div>

                    {/* Type Icon */}
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#1C4D38] border border-[#1C4D38]/10 shadow-2xs shrink-0">
                      {step.type === 'Video' && <Play className="w-4 h-4 text-emerald-700 fill-current" />}
                      {step.type === 'Artikel' && <FileText className="w-4 h-4 text-emerald-700" />}
                      {step.type === 'Bank' && <Building2 className="w-4 h-4 text-emerald-700" />}
                      {step.type === 'Kuis' && <HelpCircle className="w-4 h-4 text-emerald-700" />}
                    </div>

                    {/* Step Title & Meta */}
                    <div className="space-y-0.5 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-[#1C4D38] font-display">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#1C4D38]/60 font-bold">
                        <span>{step.type}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {step.duration}
                        </span>
                        <span>•</span>
                        <span className="text-[#E07A5F] font-black">+{step.points} poin</span>
                      </div>
                      {step.desc && (
                        <p className="text-[10px] text-[#1C4D38]/70 font-medium pt-0.5">
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Action Button / Status Badge */}
                  <div className="shrink-0">
                    {isCompleted && (
                      <span className="text-[11px] font-black text-emerald-800 bg-[#D1EBE1] px-3 py-1 rounded-xl">
                        Selesai
                      </span>
                    )}

                    {isActive && (
                      <button
                        type="button"
                        onClick={() => onSelectLesson(step.id)}
                        className="px-4 py-2 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Lanjut Belajar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isLocked && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Terkunci</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 💡 Tips Belajar Card */}
          <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-xs text-[#1C4D38]/85 font-medium shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <p>
              <strong>Tips Belajar:</strong> Selesaikan materi secara berurutan untuk memahami konsep dengan lebih mudah dan mendapatkan poin maksimal!
            </p>
          </div>

        </div>

        {/* Right Column (4 Cols): Rewards Card & AI Helper */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Reward yang Kamu Dapatkan Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-4 shadow-xs">
            <h4 className="text-xs font-black text-[#1C4D38] font-display border-b border-[#1C4D38]/10 pb-2.5">
              Reward yang Kamu Dapatkan
            </h4>

            <div className="p-4 bg-[#FAF3E5] rounded-2xl border border-[#1C4D38]/10 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-[#FCE39E] text-[#9B6A1B] flex items-center justify-center font-black shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[#1C4D38]">240 poin</p>
                <p className="text-[10px] text-[#1C4D38]/70 font-medium">
                  Setelah menyelesaikan semua materi dan kuis
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#D1EBE1] rounded-2xl border border-emerald-500/20 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-white text-emerald-800 flex items-center justify-center font-black shadow-xs">
                🌱
              </div>
              <div>
                <p className="text-[10px] font-black text-[#1C4D38]/60 uppercase">Badge</p>
                <p className="text-xs font-black text-[#1C4D38]">Eco Beginner</p>
                <p className="text-[10px] text-[#1C4D38]/70 font-medium">
                  Selesaikan topik ini untuk mendapatkan badge!
                </p>
              </div>
            </div>
          </div>

          {/* Setelah Selesai Checklist Card */}
          <div className="bg-white border border-[#1C4D38]/10 rounded-[28px] p-5 space-y-3.5 shadow-xs">
            <h4 className="text-xs font-black text-[#1C4D38] font-display border-b border-[#1C4D38]/10 pb-2.5">
              Setelah Selesai, Kamu Akan Mendapatkan:
            </h4>

            <div className="space-y-2.5 text-xs text-[#1C4D38] font-bold">
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-black">Badge Eksklusif</p>
                  <p className="text-[10px] text-[#1C4D38]/60 font-medium">Tunjukkan pencapaianmu</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-black">+240 Poin</p>
                  <p className="text-[10px] text-[#1C4D38]/60 font-medium">Tingkatkan level dan dapatkan reward</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-black">Progress Edukasi</p>
                  <p className="text-[10px] text-[#1C4D38]/60 font-medium">Pantau perkembangan belajarmu</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-black">Level Meningkat</p>
                  <p className="text-[10px] text-[#1C4D38]/60 font-medium">Semakin tinggi level, semakin banyak manfaat!</p>
                </div>
              </div>
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
                AI SIRKULA siap membantu menjelaskan materi yang belum kamu pahami.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAiRecommend}
              className="w-full py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Tanya AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
