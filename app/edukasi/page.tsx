'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import NotificationPopover from '@/components/ui/NotificationPopover';
import UserProfilePopover from '@/components/ui/UserProfilePopover';
import EduHubView from '@/components/education/EduHubView';
import EduAllMateriView from '@/components/education/EduAllMateriView';
import EduTopicsView from '@/components/education/EduTopicsView';
import EduLearningPathView from '@/components/education/EduLearningPathView';
import EduLessonPlayerView from '@/components/education/EduLessonPlayerView';
import EduAiRecommendModal from '@/components/education/EduAiRecommendModal';
import CustomAlertModal from '@/components/ui/CustomAlertModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getCompletedEducation, markEducationCompleted, addPoints } from '@/lib/utils/storage';
import { MapPin, ChevronDown, Sparkles, HelpCircle, Trophy, Award, CheckCircle2, RotateCcw } from 'lucide-react';

import quizData from '@/lib/data/quiz.json';

export type EduPageView = 'hub' | 'all-materi' | 'topics' | 'learning-path' | 'lesson-player' | 'quiz-challenge';

export default function EdukasiPage() {
  const isAuthorized = useAuthGuard();

  // Navigation View State
  const [currentView, setCurrentView] = useState<EduPageView>('hub');
  const [allMateriTab, setAllMateriTab] = useState<'Semua' | 'Video' | 'Artikel' | 'Infografis' | 'Panduan' | 'Tersimpan'>('Semua');
  const [selectedTopic, setSelectedTopic] = useState<string>('Pengelolaan Sampah');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('mat-2');

  // Completed Lessons & Points State
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  // AI Recommendation Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Daily Quiz State (Tab / View)
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState('Sukolilo, Surabaya');

  const updateLocation = () => {
    try {
      const gpsRaw = localStorage.getItem('sirkula_user_gps_coords');
      if (gpsRaw) {
        const parsed = JSON.parse(gpsRaw);
        if (parsed?.name) {
          setUserLocation(parsed.name.replace(' (GPS Real-Time)', '').replace(' (Default)', '').trim());
          return;
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    updateLocation();
    window.addEventListener('storage', updateLocation);
    window.addEventListener('sirkula:locationChange', updateLocation);
    return () => {
      window.removeEventListener('storage', updateLocation);
      window.removeEventListener('sirkula:locationChange', updateLocation);
    };
  }, []);

  const QUIZ_QUESTIONS = quizData.map((q) => ({
    q: q.question,
    options: q.options,
    correct: q.correctAnswer,
    expl: q.explanation,
    points: q.points ?? 25,
  }));

  const handleQuizReset = () => {
    setQuizIdx(0);
    setQuizAnswers([]);
    setQuizSubmitted(false);
  };

  useEffect(() => {
    setCompletedIds(getCompletedEducation());
  }, []);

  if (!isAuthorized) return null;

  const handleSelectTopic = (topicName: string) => {
    setSelectedTopic(topicName);
    setCurrentView('learning-path');
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson-player');
  };

  const handleCompleteAndNext = (lessonId: string, points: number) => {
    markEducationCompleted(lessonId);
    setCompletedIds(getCompletedEducation());

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }

    setRewardToast(`Selamat! Kamu telah menyelesaikan materi & mendapatkan +${points} Poin SIRKULA.`);
    setTimeout(() => {
      setRewardToast(null);
    }, 4500);

    // Back to learning path with updated state
    setCurrentView('learning-path');
  };

  const handleSelectQuizOption = (optIdx: number) => {
    if (quizSubmitted) return;
    const newAns = [...quizAnswers];
    newAns[quizIdx] = optIdx;
    setQuizAnswers(newAns);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const score = quizAnswers.reduce((acc, ans, i) => (ans === QUIZ_QUESTIONS[i].correct ? acc + 25 : acc), 0);
    if (score >= 50) {
      addPoints(50, 0);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));

        // Sync quiz score ke backend API
        const token = localStorage.getItem('sirkula_auth_token');
        fetch('/api/edu/quiz/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            quizTopic: 'Kuis Harian Pemilahan Sampah',
            score,
            totalQuestions: QUIZ_QUESTIONS.length,
          }),
        }).catch((err) => console.warn('Backend quiz sync:', err));
      }
      setRewardToast(`Hebat! Kamu meraih skor ${score}/100 pada Kuis Harian & mendapatkan +50 Poin SIRKULA.`);
      setTimeout(() => {
        setRewardToast(null);
      }, 4500);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        
        {/* 🍃 Top Leaf Garland Watermark (Identik dengan Dashboard & Bank Sampah) */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-40 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Top Watermark"
            className="w-full h-auto max-h-[320px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        {/* Floating Reward Toast Notification */}
        {rewardToast && (
          <div className="fixed top-6 right-6 z-50 bg-[#1C4D38] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#FCE39E]/60 flex items-center gap-3.5 animate-in slide-in-from-top-6 duration-300">
            <Sparkles className="w-5 h-5 text-[#FCE39E]" />
            <span className="text-xs font-black">{rewardToast}</span>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display">
                Edukasi
              </h1>
              <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
                Belajar, peduli, dan bertindak untuk lingkungan yang lebih baik.
              </p>
            </div>

            {/* Header Right Action Bar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('sirkula:openLocationModal'));
                  }
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#1C4D38]/10 shadow-sm text-xs font-bold text-[#1C4D38] hover:shadow-md hover:border-emerald-600 transition cursor-pointer"
                title="Klik untuk melihat atau mengubah lokasi GPS"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span className="max-w-[140px] truncate">{userLocation}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1C4D38]/60" />
              </button>

              <NotificationPopover />
              <UserProfilePopover />
            </div>
          </div>

          {/* VIEW 1: Main Edukasi Hub (Screen 1) */}
          {currentView === 'hub' && (
            <EduHubView
              onNavigateToAllMateri={(tab) => {
                setAllMateriTab(tab || 'Semua');
                setCurrentView('all-materi');
              }}
              onNavigateToTopics={() => setCurrentView('topics')}
              onSelectTopic={handleSelectTopic}
              onSelectLesson={handleSelectLesson}
              onStartDailyQuiz={() => setCurrentView('quiz-challenge')}
              completedIds={completedIds}
            />
          )}

          {/* VIEW 2: Materi Terbaru Catalog (Screen 2) */}
          {currentView === 'all-materi' && (
            <EduAllMateriView
              onBackToHub={() => setCurrentView('hub')}
              onSelectLesson={handleSelectLesson}
              onOpenAiRecommend={() => setIsAiModalOpen(true)}
              completedIds={completedIds}
              initialTab={allMateriTab}
            />
          )}

          {/* 🌟 VIEW 3: Semua Topik Grid (Screen 3) */}
          {currentView === 'topics' && (
            <EduTopicsView
              onBackToHub={() => setCurrentView('hub')}
              onSelectTopic={handleSelectTopic}
              onOpenAiRecommend={() => setIsAiModalOpen(true)}
            />
          )}

          {/* 🌟 VIEW 4: Learning Path Detail (Screen 4) */}
          {currentView === 'learning-path' && (
            <EduLearningPathView
              topicName={selectedTopic}
              onBackToTopics={() => setCurrentView('topics')}
              onSelectLesson={handleSelectLesson}
              onOpenAiRecommend={() => setIsAiModalOpen(true)}
              completedIds={completedIds}
            />
          )}

          {/* 🌟 VIEW 5: Materi Reader & Video Player (Screen 5) */}
          {currentView === 'lesson-player' && (
            <EduLessonPlayerView
              lessonId={selectedLessonId}
              topicName={selectedTopic}
              onBackToLearningPath={() => setCurrentView('learning-path')}
              onCompleteAndNext={handleCompleteAndNext}
              onOpenAiRecommend={() => setIsAiModalOpen(true)}
              completedIds={completedIds}
            />
          )}

          {/* 🌟 VIEW 6: Tantangan Kuis Harian */}
          {currentView === 'quiz-challenge' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-3">
                <div>
                  <h3 className="text-xl font-black text-[#1C4D38] font-display flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#E07A5F]" />
                    <span>Tantangan Kuis Pintar SIRKULA</span>
                  </h3>
                  <p className="text-xs text-[#1C4D38]/70 font-medium mt-0.5">
                    Soal {quizIdx + 1} dari {QUIZ_QUESTIONS.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView('hub')}
                  className="px-4 py-2 bg-white border border-[#1C4D38]/20 text-xs font-bold text-[#1C4D38] rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Kembali ke Hub
                </button>
              </div>

              {/* Question Card */}
              <div className="bg-white border border-[#1C4D38]/10 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-xs">
                <h4 className="text-sm sm:text-base font-black text-[#1C4D38] leading-relaxed">
                  {QUIZ_QUESTIONS[quizIdx].q}
                </h4>

                <div className="space-y-3">
                  {QUIZ_QUESTIONS[quizIdx].options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[quizIdx] === oIdx;
                    const isCorrect = QUIZ_QUESTIONS[quizIdx].correct === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectQuizOption(oIdx)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950'
                                : 'bg-red-50 border-2 border-red-500 text-red-950'
                              : 'bg-[#FAF3E5] border-2 border-[#1C4D38] text-[#1C4D38]'
                            : 'bg-[#FAF5ED]/60 hover:bg-[#FAF5ED] border-[#1C4D38]/10 text-[#1C4D38]/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-white text-[11px] font-black flex items-center justify-center border border-[#1C4D38]/15 shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation if Submitted */}
                {quizSubmitted && (
                  <div className="p-4 bg-[#FAF5ED] rounded-2xl border border-[#1C4D38]/15 space-y-1 text-xs">
                    <p className="font-black text-[#1C4D38]">Pembahasan & Fakta:</p>
                    <p className="text-[#1C4D38]/80 font-medium leading-relaxed">
                      {QUIZ_QUESTIONS[quizIdx].expl}
                    </p>
                  </div>
                )}

                {/* Quiz Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#1C4D38]/10">
                  <button
                    type="button"
                    onClick={() => setQuizIdx((prev) => Math.max(0, prev - 1))}
                    disabled={quizIdx === 0}
                    className="px-5 py-2 bg-white border border-[#1C4D38]/20 disabled:opacity-40 text-xs font-black text-[#1C4D38] rounded-xl cursor-pointer"
                  >
                    Soal Sebelumnya
                  </button>

                  {quizIdx < QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setQuizIdx((prev) => prev + 1)}
                      className="px-6 py-2 bg-[#1C4D38] text-white text-xs font-black rounded-xl hover:bg-[#143929] cursor-pointer"
                    >
                      Soal Berikutnya
                    </button>
                  ) : quizSubmitted ? (
                    <button
                      type="button"
                      onClick={handleQuizReset}
                      className="px-7 py-2 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Kuis</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      disabled={quizAnswers.filter((a) => a !== undefined).length < QUIZ_QUESTIONS.length}
                      className="px-7 py-2 bg-[#E07A5F] hover:bg-[#d4684d] disabled:bg-gray-300 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                    >
                      Kirim Jawaban (+50 Poin)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 🤖 AI Learning Recommendation Modal */}
      <EduAiRecommendModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectTopic={handleSelectTopic}
      />

    </div>
  );
}
