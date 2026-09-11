'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Calendar,
  Eye,
  Award,
  CheckCircle2,
  Share2,
  Bookmark,
  Sparkles,
  BookOpen,
  HelpCircle,
  ThumbsUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { addPoints, getCompletedEducation, markEducationCompleted, getBookmarkedEducation, toggleBookmarkedEducation } from '@/lib/utils/storage';
import CustomAlertModal from '@/components/ui/CustomAlertModal';

export interface EducationItem {
  id: string;
  title: string;
  desc: string;
  category: 'Pengelolaan Sampah' | 'Daur Ulang' | 'Lingkungan';
  type: 'Video' | 'Artikel';
  level: 'Pemula' | 'Menengah';
  date: string;
  views: string;
  points: string;
  image: string;
  videoUrl?: string;
  readTime?: string;
  author?: string;
  content: string[];
  keyTakeaways?: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface EducationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: EducationItem | null;
  onClaimReward?: (points: number) => void;
}

export default function EducationDetailModal({
  isOpen,
  onClose,
  item,
  onClaimReward,
}: EducationDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isClaimed, setIsClaimed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setIsPlaying(false);
      setProgress(item.type === 'Video' ? 35 : 100);
      const completedList = getCompletedEducation();
      setIsClaimed(completedList.includes(item.id));
      setIsBookmarked(getBookmarkedEducation().includes(item.id));
      setShowQuiz(false);
      setSelectedOption(null);
      setQuizSubmitted(false);
      setLikesCount(Math.floor(Math.random() * 100) + 80);
      setHasLiked(false);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleClaimPoints = () => {
    if (isClaimed) return;
    
    // Add 20 points in localStorage & update user points
    addPoints(20, 0.2);
    markEducationCompleted(item.id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
    
    setIsClaimed(true);
    if (onClaimReward) {
      onClaimReward(20);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedOption(index);
  };

  const submitQuizAnswer = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    if (item.quiz && selectedOption === item.quiz.correctIndex) {
      handleClaimPoints();
    }
  };

  const handleLikeToggle = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-[#FAF5ED] border border-[#1C4D38]/15 rounded-[32px] max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#1C4D38] font-sans animate-in zoom-in-95 duration-200 relative">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-white/90 border-b border-[#1C4D38]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#D1EBE1] text-[#1C4D38] text-[11px] font-black rounded-full border border-[#1C4D38]/10 flex items-center gap-1.5">
              {item.type === 'Video' ? <Play className="w-3 h-3 fill-current" /> : <BookOpen className="w-3 h-3" />}
              <span>{item.type}</span>
            </span>

            <span className="px-3 py-1 bg-[#FAF5ED] text-[#1C4D38] text-[11px] font-bold rounded-full border border-[#1C4D38]/10">
              {item.category}
            </span>

            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-[#FCE39E]/80 text-[#8F5E15] border border-[#D9A74E]/30 hidden sm:inline-block">
              {item.level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <button
              type="button"
              onClick={() => {
                const updated = toggleBookmarkedEducation(item.id);
                setIsBookmarked(updated.includes(item.id));
              }}
              className={`p-2 rounded-full transition cursor-pointer ${
                isBookmarked ? 'bg-[#FCE39E] text-[#1C4D38]' : 'hover:bg-gray-100 text-[#1C4D38]/60'
              }`}
              title={isBookmarked ? 'Hapus dari Simpanan' : 'Simpan Materi'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-[#1C4D38]/70 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* 🎬 1. Media Section: Video Player or Article Hero Illustration */}
          {item.type === 'Video' ? (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-md border border-[#1C4D38]/15 group">
              
              {/* Video Thumbnail / Mock Player Canvas */}
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-t from-black/80 via-black/30 to-black/20">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-contain p-4 filter drop-shadow-md opacity-90"
                />

                {/* Big Center Play/Pause Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[#1C4D38]/90 hover:bg-[#1C4D38] text-white flex items-center justify-center shadow-lg border-2 border-white/80 transition transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>{isPlaying ? 'Memutar Video Edukasi' : 'Siap Ditonton (HD)'}</span>
                </div>
              </div>

              {/* Bottom Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-3 space-y-2">
                {/* Progress Bar */}
                <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-[#66C699] h-full transition-all duration-300"
                    style={{ width: `${isPlaying ? 75 : progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-white text-[11px] font-bold">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-[#66C699] transition cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-[#66C699] transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span>{isPlaying ? '02:45 / 03:30' : '00:00 / 03:30'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">1080p</span>
                    <Maximize2 className="w-4 h-4 hover:text-[#66C699] cursor-pointer" />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="w-full h-52 sm:h-60 bg-white rounded-2xl flex items-center justify-center p-4 border border-[#1C4D38]/10 shadow-2xs relative overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-[#FAF5ED]/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-extrabold text-[#1C4D38] border border-[#1C4D38]/10 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Waktu baca: {item.readTime || '3 menit'}</span>
              </div>
            </div>
          )}

          {/* 📰 2. Title & Metadata */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1C4D38] font-display leading-snug">
              {item.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#1C4D38]/70 font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1C4D38]/60" />
                <span>{item.date}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#1C4D38]/60" />
                <span>{item.views} tayangan</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1C4D38]/60" />
                <span>Oleh: {item.author || 'Tim Edukasi SIRKULA'}</span>
              </span>
            </div>
          </div>

          {/* 💡 3. Key Takeaways Box */}
          {item.keyTakeaways && item.keyTakeaways.length > 0 && (
            <div className="bg-[#EBF5F0] border border-[#1C4D38]/15 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black text-[#1C4D38] font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1C4D38]" />
                <span>Poin Penting & Ringkasan Materi:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#1C4D38]/85 font-medium">
                {item.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C4D38] mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 📝 4. Main Educational Content */}
          <div className="space-y-3.5 text-xs sm:text-sm text-[#1C4D38]/90 leading-relaxed font-medium">
            {item.content.map((paragraph, idx) => (
              <p key={idx} className="bg-white/60 p-3 rounded-xl border border-[#1C4D38]/5">
                {paragraph}
              </p>
            ))}
          </div>

          {/* 🎯 5. Interactive Mini Quiz Box (Gamifikasi Belajar) */}
          {item.quiz && (
            <div className="bg-white border-2 border-[#1C4D38]/15 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1C4D38]/10 pb-3">
                <h4 className="text-xs sm:text-sm font-black text-[#1C4D38] font-display flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#E07A5F]" />
                  <span>Kuis Pemahaman Materi</span>
                </h4>
                <span className="text-[10px] font-black bg-[#FCE39E] text-[#8F5E15] px-2.5 py-0.5 rounded-full">
                  Bonus +20 Poin
                </span>
              </div>

              <p className="text-xs sm:text-sm font-extrabold text-[#1C4D38]">
                {item.quiz.question}
              </p>

              <div className="space-y-2">
                {item.quiz.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === item.quiz?.correctIndex;
                  let btnStyle = 'bg-[#FAF5ED] border-[#1C4D38]/10 text-[#1C4D38] hover:bg-gray-100';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-[#D1EBE1] border-emerald-500 text-emerald-900 font-black';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-100 border-red-400 text-red-800 font-bold';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-[#1C4D38] text-white border-[#1C4D38] font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuizAnswer(i)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={submitQuizAnswer}
                  disabled={selectedOption === null}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-xs ${
                    selectedOption !== null
                      ? 'bg-[#1C4D38] hover:bg-[#143929] text-white active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Kirim Jawaban & Klaim Poin
                </button>
              ) : (
                <div className="p-3 bg-[#EBF5F0] rounded-xl text-[11px] text-[#1C4D38] space-y-1">
                  <p className="font-extrabold flex items-center gap-1.5">
                    {selectedOption === item.quiz.correctIndex ? 'Jawabanmu Tepat Sekali!' : 'Jawaban Belum Tepat'}
                  </p>
                  <p className="text-[#1C4D38]/80 font-medium leading-relaxed">
                    {item.quiz.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 💬 6. Social Feedback Row */}
          <div className="pt-2 flex items-center justify-between border-t border-[#1C4D38]/10 text-xs">
            <button
              type="button"
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-bold cursor-pointer ${
                hasLiked ? 'bg-[#1C4D38] text-white' : 'bg-white hover:bg-gray-50 text-[#1C4D38] border border-[#1C4D38]/10'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Bermanfaat ({likesCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-[#1C4D38] border border-[#1C4D38]/10 font-bold cursor-pointer transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>

        </div>

        {/* 🏆 Bottom Action Bar */}
        <div className="px-6 py-4 bg-white/95 border-t border-[#1C4D38]/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C4D38]">
            <Award className="w-5 h-5 text-[#E07A5F]" />
            <span>Reward Belajar: <strong className="text-[#E07A5F]">+20 Poin SIRKULA</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isClaimed ? (
              <div className="w-full sm:w-auto px-5 py-2.5 bg-[#D1EBE1] text-[#1C4D38] text-xs font-black rounded-xl border border-[#1C4D38]/15 flex items-center justify-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Poin Berhasil Diklaim! (+20 Poin)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleClaimPoints}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Selesaikan & Klaim +20 Poin</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 🌟 Custom SIRKULA Share Alert Modal */}
      <CustomAlertModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Tautan Materi Berhasil Disalin!"
        message={`Tautan materi "${item.title}" telah disalin ke clipboard Anda. Sebarkan edukasi ramah lingkungan ini ke teman-temanmu!`}
        type="share"
        primaryButtonText="Selesai"
      />

    </div>
  );
}
