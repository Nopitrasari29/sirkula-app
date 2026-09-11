'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, X, ArrowRight, CheckCircle2, BookOpen, Lightbulb } from 'lucide-react';

interface EduAiRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicName: string) => void;
}

export default function EduAiRecommendModal({
  isOpen,
  onClose,
  onSelectTopic,
}: EduAiRecommendModalProps) {
  const [step, setStep] = useState<'question' | 'result'>('question');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  if (!isOpen) return null;

  const goals = [
    { id: 'sort', label: 'Saya ingin belajar memilah sampah kos / rumah dengan benar', topic: 'Pengelolaan Sampah' },
    { id: 'compost', label: 'Saya ingin memanfaatkan sisa makanan / sampah organik', topic: 'Kompos & Organik' },
    { id: 'recycle', label: 'Saya ingin tahu jenis plastik yang bernilai jual daur ulang', topic: 'Daur Ulang' },
    { id: 'zero', label: 'Saya ingin memulai gaya hidup minim sampah (Zero Waste)', topic: 'Gaya Hidup Hijau' },
  ];

  const handleGenerate = () => {
    if (!selectedGoal) return;
    setStep('result');
  };

  const currentGoalObj = goals.find((g) => g.id === selectedGoal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative text-[#1C4D38] font-sans">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-200 text-[#1C4D38]/70 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D1EBE1] text-[#1C4D38] flex items-center justify-center border border-emerald-500/20 shadow-xs shrink-0">
            <Bot className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1C4D38] font-display">
              Rekomendasi Pintar SIRKULA
            </h3>
            <p className="text-xs text-[#1C4D38]/70 font-medium">
              Asisten pintar kurasi materi belajar sesuai minat & kebutuhanmu
            </p>
          </div>
        </div>

        {step === 'question' ? (
          <div className="space-y-4">
            <p className="text-xs font-bold text-[#1C4D38]">
              Apa tujuan utama yang ingin kamu pelajari hari ini?
            </p>

            <div className="space-y-2">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGoal(g.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-2 border-emerald-600 shadow-xs ring-2 ring-emerald-600/10 text-[#1C4D38]'
                        : 'bg-white/70 hover:bg-white border-[#1C4D38]/10 text-[#1C4D38]/80'
                    }`}
                  >
                    <span>{g.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!selectedGoal}
              className="w-full py-3 bg-[#1C4D38] hover:bg-[#143929] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Dapatkan Rekomendasi Belajar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-[#1C4D38]/10 space-y-2 shadow-2xs">
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-[#D1EBE1] px-2.5 py-0.5 rounded-full">
                Rekomendasi Terbaik
              </span>
              <h4 className="text-sm font-black text-[#1C4D38] font-display">
                Topik: {currentGoalObj?.topic}
              </h4>
              <p className="text-xs text-[#1C4D38]/80 font-medium leading-relaxed">
                Berdasarkan pilihanmu, kami menyarankan untuk memulai jalur belajar <strong>{currentGoalObj?.topic}</strong>. Jalur ini memiliki materi video ringkas dan panduan praktis yang mudah diterapkan!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('question')}
                className="px-4 py-2.5 bg-white border border-[#1C4D38]/20 text-xs font-bold text-[#1C4D38] rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Ubah Pilihan
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentGoalObj) {
                    onSelectTopic(currentGoalObj.topic);
                    onClose();
                  }
                }}
                className="flex-1 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Buka Jalur Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
