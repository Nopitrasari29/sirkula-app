'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '../../lib/types';
import { HelpCircle, CheckCircle2, XCircle, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizCardProps {
  questions: QuizQuestion[];
  onQuizCompleted: (totalScorePoints: number) => void;
}

export default function QuizCard({ questions, onQuizCompleted }: QuizCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scorePoints, setScorePoints] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const q = questions[currentIdx] || questions[0];
  const correctAnswerIndex = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q.correctAnswer !== undefined ? q.correctAnswer : 0);
  const questionPoints = q.pointsReward || q.points || 10;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === correctAnswerIndex) {
      setScorePoints((prev) => prev + questionPoints);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onQuizCompleted(scorePoints + (selectedOption === correctAnswerIndex ? questionPoints : 0));
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScorePoints(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-emerald-500/40 text-center space-y-6 animate-fadeIn">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-gold-500 to-gold-400 text-slate-950 font-black shadow-2xl">
          <Award className="h-10 w-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
            Kuis Selesai!
          </span>
          <h3 className="text-2xl font-black text-white mt-2">Selamat, Kamu Hebat!</h3>
          <p className="text-xs text-slate-400 mt-1">
            Kamu telah menyelesaikan seluruh mini-kuis edukasi lingkungan Sirkula.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 max-w-sm mx-auto space-y-1">
          <div className="text-xs text-slate-400">Total Poin Diperoleh:</div>
          <div className="text-3xl font-black text-gold-400">+{scorePoints} Poin Sirkula</div>
          <p className="text-[10px] text-emerald-400 pt-1">Otomatis Ditambahkan ke Profil Dashboard</p>
        </div>

        <button
          onClick={handleRestart}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="h-4 w-4" /> Ulangi Kuis Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
            Mini-Kuis Edukasi #{currentIdx + 1}
          </span>
          <h3 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-400" /> Uji Pemahaman Pilah Sampah
          </h3>
        </div>
        <div className="text-xs font-black text-gold-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          Soal {currentIdx + 1} dari {questions.length}
        </div>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <h4 className="text-base font-extrabold text-white leading-relaxed">{q.question}</h4>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-emerald-600 hover:bg-emerald-950/30';
            if (isAnswered) {
              if (idx === correctAnswerIndex) {
                btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-300 font-bold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-300 font-bold';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 font-black text-[11px] text-emerald-400 border border-slate-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isAnswered && idx === correctAnswerIndex && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== correctAnswerIndex && (
                  <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Box on Answered */}
      {isAnswered && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-2 animate-fadeIn">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Pembahasan & Pembelajaran:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <button
          onClick={handleNextQuestion}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-xs hover:from-emerald-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {currentIdx < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'} <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
