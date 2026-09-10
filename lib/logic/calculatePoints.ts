import { Badge, UserProfile } from '../types';

/**
 * Calculates environmental impact metrics based on total waste weight (kg)
 */
export function calculateImpactMetrics(totalWasteKg: number) {
  // 10 kg waste = approx 1 tree saved equivalent
  const treesSaved = Number((totalWasteKg / 10).toFixed(1));
  // 1 kg waste = approx 1.6 kg CO2 emission avoided
  const co2SavedKg = Number((totalWasteKg * 1.6).toFixed(1));
  // Approx average resale earnings calculation
  const estimatedMoneyEarned = Math.round(totalWasteKg * 4200);

  return {
    treesSaved,
    co2SavedKg,
    estimatedMoneyEarned,
  };
}

/**
 * Derives level name and percentage progress based on points
 */
export function deriveUserLevel(points: number): { level: string; progress: number } {
  if (points < 200) {
    return { level: 'Pemula Hijau Kos', progress: Math.min(100, Math.round((points / 200) * 100)) };
  } else if (points < 500) {
    return { level: 'Pejuang Pemilah Kos', progress: Math.min(100, Math.round(((points - 200) / 300) * 100)) };
  } else if (points < 1000) {
    return { level: 'Pahlawan Hijau Kampus', progress: Math.min(100, Math.round(((points - 500) / 500) * 100)) };
  } else {
    return { level: 'Legenda Sirkula', progress: 100 };
  }
}

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-first-scan',
    title: 'Scan Pertama Kos',
    description: 'Berhasil melakukan 1x foto/scan sampah terpilah dengan AI Scanner.',
    icon: 'Scan',
    category: 'scanner',
    requiredSubmissions: 1,
    unlocked: true,
    unlockedAt: '16 Juli 2026',
  },
  {
    id: 'b-streak-7',
    title: 'Streak 7 Hari',
    description: 'Konsisten melakukan aktivitas pilah sampah kos 7 hari berturut-turut.',
    icon: 'Zap',
    category: 'streak',
    requiredPoints: 150,
    unlocked: true,
    unlockedAt: '22 Juli 2026',
  },
  {
    id: 'b-master-plastic',
    title: 'Master Botol PET',
    description: 'Menyetor lebih dari 5 kg sampah plastik PET terpilah.',
    icon: 'Recycle',
    category: 'scanner',
    requiredSubmissions: 5,
    unlocked: false,
  },
  {
    id: 'b-quiz-champ',
    title: 'Jawara Kuis Edukasi',
    description: 'Menjawab sempurna seluruh mini-kuis edukasi lingkungan Sirkula.',
    icon: 'Award',
    category: 'education',
    requiredQuizScore: 100,
    unlocked: false,
  },
  {
    id: 'b-booking-hero',
    title: 'Kolektor Bank Sampah',
    description: 'Berhasil melakukan 1x penjemputan sampah kos via Booking Peta Sirkula.',
    icon: 'Truck',
    category: 'booking',
    unlocked: false,
  },
];
