// Comprehensive TypeScript Interfaces for SIRKULA App Backend Data Layer

export interface WasteScanResult {
  id: string;
  name?: string;
  category?: 'Plastik PET' | 'Kertas & Kardus' | 'Logam & Kaleng' | 'Kaca' | 'Organik' | string;
  confidence?: number; // e.g. 98%
  recycleability?: 'Tinggi' | 'Sedang' | 'Rendah';
  estimatedPricePerKg?: number; // e.g. 3500
  earnedPoints?: number; // e.g. 50
  instructions?: string[];
  recyclingImpact?: string;
  imageUrl?: string;

  // Legacy Alias Fields for Compatibility
  itemName?: string;
  timestamp?: string;
  categoryName?: string;
  totalResaleValue?: number;
  estimatedWeightKg?: number;
  pointsEarned?: number;
  co2SavedKg?: number;
  sortingTips?: string[];
}

export interface BankSampahLocation {
  id: string;
  name: string;
  category: 'Pengepul Terverifikasi' | 'Bank Sampah Induk' | 'Bank Sampah Unit' | 'Drop Point Kos' | string;
  address: string;
  campusRegion: 'ITS Sukolilo' | 'UNAIR Kampus C' | 'UI Depok' | 'ITB Bandung' | 'UGM Jogja' | 'UNDIP Semarang' | 'UB Malang' | string;
  latitude: number;
  longitude: number;
  phone: string;
  operatingHours: string;
  acceptedCategories: string[];
  rating: number;

  // Legacy Alias Fields for Compatibility
  lat?: number;
  lng?: number;
  type?: string;
  distanceKm?: number;
  pricePerKgRange?: string;
}

export interface BookingItem {
  id: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  userAddress?: string;
  address?: string;
  wasteType?: string;
  estimatedWeightKg?: number;
  pickupDate?: string;
  pickupTime?: string;
  notes?: string;
  collectorName?: string;
  collectorPhone?: string;
  status?: 'Dibuat' | 'Dikonfirmasi' | 'Pengepul Menuju Kos' | 'Selesai' | 'Dibatalkan' | 'Menunggu' | 'Dijemput' | string;
  createdAt?: string;

  // Legacy Alias Fields for Compatibility
  locationId?: string;
  locationName?: string;
  totalPoints?: number;
  pickupAddress?: string;
  addressDetail?: string;
  courierName?: string;
  courierPhone?: string;
  pickupTimeSlot?: string;
  wasteCategories?: string[];
  category?: string;
  date?: string;
  itemName?: string;
  weightKg?: number;
  pointsEarned?: number;
  resaleValue?: number;
  co2SavedKg?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Mahasiswa Kos' | 'Pengepul Sampah';
  campus?: string;
  kosAddress?: string;
  avatarUrl?: string;
  phone?: string;
  language?: string;
  defaultLocation?: string;
  points: number;
  level: number | string;
  totalRecycledKg: number;
  co2SavedKg: number;
  badges: Badge[];
  isLoggedIn: boolean;

  // Legacy Alias Fields for Compatibility
  university?: string;
  boardingName?: string;
  streakDays?: number;
  levelProgress?: number;
  totalWasteKg?: number;
  totalCo2SavedKg?: number;
  totalTreesSaved?: number;
  totalEarnedMoney?: number;
  notifPickup?: boolean;
  notifPoints?: boolean;
  notifTips?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon?: string;
  unlockedAt?: string;
  category?: string;
  requiredSubmissions?: number;
  requiredPoints?: number;
  requiredQuizScore?: number;
}

export interface EduArticle {
  id: string;
  title: string;
  category: 'Pemilahan' | 'Daur Ulang' | 'Gaya Hidup Kos';
  readTime: string;
  summary: string;
  content: string;
  imageUrl: string;

  // Legacy Alias Fields for Compatibility
  icon?: string;
  impactTag?: string;
  source?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  pointsReward: number;

  // Legacy Alias Fields for Compatibility
  correctAnswer?: number;
  points?: number;
}

// Aliases for legacy component imports
export type BookingRequest = BookingItem;
export type WasteLocation = BankSampahLocation;
export type WasteSubmission = BookingItem;
export type FunFact = EduArticle;
export type SmartNotification = {
  id: string;
  title: string;
  message?: string;
  body?: string;
  category?: 'Sampah & Pickup' | 'Poin & Badge' | 'Edukasi' | 'Sistem' | string;
  date?: string;
  timestamp?: string;
  time?: string;
  type?: string;
  read?: boolean;
};
export type WasteCategoryType = string;
