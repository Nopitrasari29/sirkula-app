import { WasteScanResult, BankSampahLocation, BookingItem, UserProfile, EduArticle, QuizQuestion } from '../types';

// 1. Preset AI Scanner Results Database
export const MOCK_SCAN_DATABASE: Record<string, WasteScanResult> = {
  botol_pet: {
    id: 'scan-1',
    name: 'Botol Plastik PET (Polyethylene Terephthalate)',
    category: 'Plastik PET',
    confidence: 98,
    recycleability: 'Tinggi',
    estimatedPricePerKg: 3500,
    earnedPoints: 50,
    instructions: [
      'Bilas bagian dalam botol dengan air bersih untuk menghilangkan sisa cairan.',
      'Lepaskan tutup botol dan label plastik (dapat dipisah).',
      'Gepengkan botol untuk menghemat ruang penyimpanan di kosan.',
      'Kumpulkan hingga 1 kg untuk ditukarkan ke Pengepul SIRKULA.'
    ],
    recyclingImpact: 'Dapat didaur ulang menjadi serat kain dakron, kaos, ransel, dan botol plastik baru.',
    imageUrl: '/assets/illustrations/feature-scanner.png'
  },
  kardus_bekas: {
    id: 'scan-2',
    name: 'Kardus Bekas Paket & Kertas Karton',
    category: 'Kertas & Kardus',
    confidence: 96,
    recycleability: 'Tinggi',
    estimatedPricePerKg: 2200,
    earnedPoints: 40,
    instructions: [
      'Lepaskan selotip dan lakban bening yang menempel pada kardus.',
      'Lipat dan pipihkan kardus agar rapi dan menghemat tempat.',
      'Pastikan kardus dalam keadaan kering (tidak basah terkena air/minyak).'
    ],
    recyclingImpact: 'Dapat didaur ulang menjadi kertas karton kemasan baru, kertas koran, dan bubur kertas daur ulang.',
    imageUrl: '/assets/illustrations/feature-edukasi.png'
  },
  kaleng_minuman: {
    id: 'scan-3',
    name: 'Kaleng Aluminium Minuman',
    category: 'Logam & Kaleng',
    confidence: 99,
    recycleability: 'Tinggi',
    estimatedPricePerKg: 12000,
    earnedPoints: 75,
    instructions: [
      'Cuci bersih sisa minuman di dalam kaleng.',
      'Remukkan atau gepengkan kaleng.',
      'Simpan dalam wadah terpisah dari sampah organik.'
    ],
    recyclingImpact: 'Aluminium dapat didaur ulang 100% tanpa penurunan kualitas menjadi kaleng baru dalam 60 hari.',
    imageUrl: '/assets/illustrations/feature-booking.png'
  }
};

// 2. Mock Bank Sampah & Pengepul Locations around Campuses
export const MOCK_BANK_SAMPAH_LOCATIONS: BankSampahLocation[] = [
  {
    id: 'loc-1',
    name: 'Bank Sampah Induk (Mitra Utama Kampus)',
    category: 'Bank Sampah Induk',
    address: 'Jl. Teknik Kimia Gg. Melati No.12, Area Kampus Mitra',
    campusRegion: 'Zona Kampus Mitra',
    latitude: -7.2825,
    longitude: 112.7944,
    phone: '0812-3456-7890',
    operatingHours: 'Senin - Sabtu: 08.00 - 16.00 WIB',
    acceptedCategories: ['Plastik PET', 'Kertas & Kardus', 'Logam & Kaleng', 'Organik'],
    rating: 4.8,
  },
  {
    id: 'loc-2',
    name: 'Bank Sampah Mandiri Terdekat',
    category: 'Bank Sampah Unit',
    address: 'Jl. Keputih Tengah No. 45, Area Kampus Mitra',
    campusRegion: 'Zona Kampus Mitra',
    latitude: -7.2912,
    longitude: 112.8021,
    phone: '0857-9876-5432',
    operatingHours: 'Senin - Sabtu: 08.00 - 15.00 WIB',
    acceptedCategories: ['Plastik PET', 'Logam & Kaleng', 'Kertas & Kardus'],
    rating: 4.6,
  },
  {
    id: 'loc-3',
    name: 'Bank Sampah Mulyorejo Asri',
    category: 'Bank Sampah Induk',
    address: 'Jl. Mulyorejo Utara No. 88, Mulyorejo, Surabaya',
    campusRegion: 'UNAIR Kampus C',
    latitude: -7.2654,
    longitude: 112.7832,
    phone: '0821-1122-3344',
    operatingHours: 'Senin - Sabtu: 08.00 - 16.30 WIB',
    acceptedCategories: ['Plastik PET', 'Kertas & Kardus', 'Kaca', 'Logam & Kaleng'],
    rating: 4.7,
  },
  {
    id: 'loc-4',
    name: 'Smart Drop Point Kos Gebang Wetan',
    category: 'Drop Point Kos',
    address: 'Jl. Gebang Wetan No. 22, Area Kampus Mitra',
    campusRegion: 'Zona Kampus Mitra',
    latitude: -7.2885,
    longitude: 112.7912,
    phone: '0813-5566-7788',
    operatingHours: '24 Jam (Drop Box)',
    acceptedCategories: ['Plastik PET', 'Kertas & Kardus'],
    rating: 4.9,
  },
];

// 3. Initial Default User Profile (UNAUTHENTICATED VISITORS BY DEFAULT)
export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-guest',
  name: 'Pengguna',
  email: '',
  role: 'Mahasiswa Kos',
  campus: '',
  kosAddress: '',
  avatarUrl: '',
  points: 0,
  level: 1,
  totalRecycledKg: 0,
  co2SavedKg: 0,
  isLoggedIn: false, // Default is NOT logged in!
  badges: [],
};

// 4. Mock Active Bookings List
export const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'BK-260721-001',
    userId: 'user-001',
    userName: 'Rafika Az Zahra',
    userPhone: '0812-3456-7890',
    userAddress: 'Kos Putri Melati Asri No. 14, Area Terdekat',
    wasteType: 'Plastik PET & Kardus Bekas Paket',
    estimatedWeightKg: 3.5,
    pickupDate: 'Senin, 21 Juli 2026',
    pickupTime: '09.30 - 10.30 WIB',
    notes: 'Mohon telepon saat armada truk sudah sampai di depan gang kos.',
    collectorName: 'Pak Budi (Armada Truk Penjemputan #03)',
    collectorPhone: '0857-9876-5432',
    status: 'Pengepul Menuju Kos',
    createdAt: '2026-07-21 08:30',
  },
];

// 5. Mock Edu Articles
export const MOCK_EDU_ARTICLES: EduArticle[] = [
  {
    id: 'edu-1',
    title: 'Panduan Pemilahan Sampah Botol Plastik untuk Anak Kos',
    category: 'Pemilahan',
    readTime: '3 Menit',
    summary: 'Langkah mudah memilah botol plastik kosan agar bernilai ekonomi dan layak daur ulang.',
    content: 'Memilah botol plastik bekas minuman dingin di kosan sangatlah mudah. Cukup bilas dengan sedikit air, lepaskan label plastik kemasannya, dan gepengkan botol.',
    imageUrl: '/assets/illustrations/feature-scanner.png',
  },
  {
    id: 'edu-2',
    title: 'Cara Mengubah Kardus Paket Belanja Online Jadi Poin',
    category: 'Gaya Hidup Kos',
    readTime: '4 Menit',
    summary: 'Ubah tumpukan kardus paket kosan menjadi poin SIRKULA yang bisa ditukar voucher.',
    content: 'Anak kosan pasti sering belanja online. Jangan buang kardusnya! Lipat kardus hingga pipih dan kumpulkan hingga 1 kg.',
    imageUrl: '/assets/illustrations/feature-edukasi.png',
  }
];

// 6. Mock Quiz Questions
export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Jenis plastik apakah yang umumnya digunakan untuk botol air mineral kemasan sekali pakai?',
    options: [
      'PET (Polyethylene Terephthalate)',
      'PVC (Polyvinyl Chloride)',
      'PS (Polystyrene / Styrofoam)',
      'LDPE (Low-Density Polyethylene)'
    ],
    correctOptionIndex: 0,
    explanation: 'Botol air mineral sekali pakai menggunakan plastik jenis PET / PETE berangka daur ulang 1.',
    pointsReward: 25,
  },
  {
    id: 'q2',
    question: 'Mengapa kardus bekas paket harus dipipihkan sebelum disetorkan ke Bank Sampah?',
    options: [
      'Agar baunya hilang',
      'Menghemat ruang penyimpanan & memudahkan penimbangan',
      'Agar warnanya berubah',
      'Menambah berat kardus'
    ],
    correctOptionIndex: 1,
    explanation: 'Memipihkan kardus menghemat volume penyimpanan di kosan maupun armada penjemputan pengepul.',
    pointsReward: 25,
  }
];
