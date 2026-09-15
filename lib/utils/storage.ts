import { UserProfile, BookingItem, WasteScanResult, SmartNotification } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_BOOKINGS } from '../data/mockData';

const USER_PROFILE_KEY = 'sirkula_user_profile';
const REGISTERED_USERS_KEY = 'sirkula_registered_users';
const BOOKINGS_KEY = 'sirkula_user_bookings';
const SCAN_HISTORY_KEY = 'sirkula_scan_history';
const NOTIFICATIONS_KEY = 'sirkula_notifications';
const FAVORITES_KEY = 'sirkula_favorite_bank_sampah';

const isBrowser = typeof window !== 'undefined';

export interface RegisteredUser {
  fullName: string;
  email: string;
  createdAt: string;
}

// Helper to safely parse JSON from localStorage
function safeJsonParse<T>(data: string | null | undefined, fallback: T): T {
  if (!data || typeof data !== 'string') return fallback;
  const trimmed = data.trim();
  if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return fallback;
  try {
    const parsed = JSON.parse(trimmed);
    return (parsed !== null && parsed !== undefined) ? (parsed as T) : fallback;
  } catch (e) {
    return fallback;
  }
}

const DEFAULT_SEED_USERS: RegisteredUser[] = [
  {
    fullName: 'Rafika Az Zahra',
    email: 'fika@sirkula.id',
    createdAt: '2026-08-01',
  },
  {
    fullName: 'Mahasiswa Demo ITS',
    email: 'demo@sirkula.id',
    createdAt: '2026-08-01',
  },
];

// 1. Registered Users Database Operations
export const getRegisteredUsers = (): RegisteredUser[] => {
  if (!isBrowser) return DEFAULT_SEED_USERS;
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    const parsed = safeJsonParse<RegisteredUser[]>(data, DEFAULT_SEED_USERS);
    // Sanitize any legacy plain-text password from localStorage for security
    const sanitized = (parsed.length > 0 ? parsed : DEFAULT_SEED_USERS).map((u) => {
      const { password, ...rest } = u as any;
      return rest as RegisteredUser;
    });
    return sanitized;
  } catch (e) {
    return DEFAULT_SEED_USERS;
  }
};

export const registerUser = (userData: { fullName: string; email: string; password?: string }): { success: boolean; message: string } => {
  const users = getRegisteredUsers();
  const existingUser = users.find((u) => u.email && u.email.toLowerCase() === userData.email.toLowerCase());

  if (existingUser) {
    return { success: false, message: 'Email sudah terdaftar. Silakan masuk menggunakan email Anda.' };
  }

  const newUser: RegisteredUser = {
    fullName: userData.fullName.trim(),
    email: userData.email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  if (isBrowser) {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
    } catch (e) {}
  }

  // Also save active user session
  saveUserProfile({
    ...INITIAL_USER_PROFILE,
    name: newUser.fullName,
    email: newUser.email,
    isLoggedIn: true,
  });

  // Seamlessly sync with backend API in background
  if (isBrowser) {
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem('sirkula_auth_token', data.token);
        }
      })
      .catch((err) => console.warn('Backend sync (register):', err));
  }

  return { success: true, message: 'Pendaftaran berhasil!' };
};

export const validateLogin = (emailInput: string, passwordInput: string): { success: boolean; message: string; user?: RegisteredUser } => {
  const users = getRegisteredUsers();
  const targetEmail = emailInput.trim().toLowerCase();
  
  const foundUser = users.find((u) => u.email && u.email.toLowerCase() === targetEmail);

  if (!foundUser) {
    return { success: false, message: 'Email belum terdaftar! Silakan daftar akun terlebih dahulu.' };
  }

  if (!passwordInput || passwordInput.trim().length === 0) {
    return { success: false, message: 'Password wajib diisi.' };
  }

  // Set as logged in user
  saveUserProfile({
    ...INITIAL_USER_PROFILE,
    name: foundUser.fullName,
    email: foundUser.email,
    isLoggedIn: true,
  });

  // Seamlessly sync with backend API in background & obtain JWT
  if (isBrowser) {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: targetEmail, password: passwordInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem('sirkula_auth_token', data.token);
        }
      })
      .catch((err) => console.warn('Backend sync (login):', err));
  }

  return { success: true, message: 'Login berhasil!', user: foundUser };
};

// 2. Active Session User Profile Storage Operations
export const getUserProfile = (): UserProfile => {
  if (!isBrowser) return INITIAL_USER_PROFILE;
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    return safeJsonParse<UserProfile>(data, INITIAL_USER_PROFILE);
  } catch (e) {
    return INITIAL_USER_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Error saving user profile to storage:', e);
  }
};

export const logoutUser = (): UserProfile => {
  if (isBrowser) {
    localStorage.removeItem('sirkula_auth_token');
  }
  const defaultProfile = { ...INITIAL_USER_PROFILE, isLoggedIn: false };
  saveUserProfile(defaultProfile);
  return defaultProfile;
};

export const addPoints = (pointsToAdd: number, recycledKgToAdd: number = 0): UserProfile => {
  const currentProfile = getUserProfile();
  const updatedProfile: UserProfile = {
    ...currentProfile,
    points: (currentProfile.points || 0) + pointsToAdd,
    totalRecycledKg: Number(((currentProfile.totalRecycledKg || 0) + recycledKgToAdd).toFixed(1)),
    co2SavedKg: Number(((currentProfile.co2SavedKg || 0) + recycledKgToAdd * 1.75).toFixed(1)),
  };
  saveUserProfile(updatedProfile);
  return updatedProfile;
};

// 3. Booking Storage Operations
export const getBookings = (): BookingItem[] => {
  if (!isBrowser) return INITIAL_BOOKINGS;
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return safeJsonParse<BookingItem[]>(data, INITIAL_BOOKINGS);
  } catch (e) {
    return INITIAL_BOOKINGS;
  }
};

export const createBooking = (newBookingData: Omit<BookingItem, 'id' | 'createdAt' | 'status'>): BookingItem => {
  const currentBookings = getBookings();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const newBooking: BookingItem = {
    ...newBookingData,
    id: `BK-${dateStr}-${String(currentBookings.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    status: 'Dibuat',
  };

  const updatedList = [newBooking, ...currentBookings];
  if (isBrowser) {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedList));
    } catch (e) {}
  }

  // Event-driven notification for booking
  addNotification({
    category: 'Sampah & Pickup',
    title: 'Booking penjemputan berhasil!',
    message: `Jadwal penjemputan ${newBooking.wasteType || 'sampah'} (${newBooking.estimatedWeightKg || 2} kg) telah dicatat (#${newBooking.id})`,
    body: `Jadwal penjemputan ${newBooking.wasteType || 'sampah'} (${newBooking.estimatedWeightKg || 2} kg) telah dicatat (#${newBooking.id})`,
    time: 'Baru saja',
  });

  // Sync ke backend API (fire-and-forget) — data booking masuk ke Prisma DB
  if (isBrowser) {
    const token = localStorage.getItem('sirkula_auth_token');
    fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        wasteType: newBooking.wasteType,
        wasteCategories: newBooking.wasteCategories || [],
        estimatedWeightKg: newBooking.estimatedWeightKg,
        pickupDate: newBooking.pickupDate,
        pickupTime: newBooking.pickupTime || newBooking.pickupTimeSlot,
        userAddress: newBooking.userAddress || newBooking.addressDetail,
        addressDetail: newBooking.addressDetail,
        notes: newBooking.notes,
      }),
    }).catch((err) => console.warn('Backend booking sync:', err));
  }

  if (isBrowser) {
    window.dispatchEvent(new Event('storage'));
  }

  return newBooking;
};

export const updateBookingStatus = (bookingId: string, status: BookingItem['status']): BookingItem[] => {
  const currentBookings = getBookings();
  const updatedList = currentBookings.map((item) =>
    item.id === bookingId ? { ...item, status } : item
  );

  if (isBrowser) {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }

  return updatedList;
};

// 4. AI Scanner History Storage Operations
export const getScanHistory = (): WasteScanResult[] => {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(SCAN_HISTORY_KEY);
    return safeJsonParse<WasteScanResult[]>(data, []);
  } catch (e) {
    return [];
  }
};

export const saveScanToHistory = (scanResult: WasteScanResult): WasteScanResult[] => {
  const currentHistory = getScanHistory();
  const updatedHistory = [scanResult, ...currentHistory];

  if (isBrowser) {
    try {
      localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {}
  }

  const earnedPts = scanResult.earnedPoints || scanResult.pointsEarned || 50;
  addPoints(earnedPts, scanResult.estimatedWeightKg || 0.5);

  // Event-driven notification for scanner
  addNotification({
    category: 'Poin & Badge',
    title: 'Scan sampah berhasil!',
    message: `Identifikasi ${scanResult.itemName || scanResult.name || 'sampah'} berhasil (+${earnedPts} poin)`,
    body: `Identifikasi ${scanResult.itemName || scanResult.name || 'sampah'} berhasil (+${earnedPts} poin)`,
    time: 'Baru saja',
  });

  if (isBrowser) {
    window.dispatchEvent(new Event('storage'));
  }

  return updatedHistory;
};

// 5. Completed Education Storage Operations
const COMPLETED_EDU_KEY = 'sirkula_completed_education';

export const getCompletedEducation = (): string[] => {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(COMPLETED_EDU_KEY);
    return safeJsonParse<string[]>(data, []);
  } catch (e) {
    return [];
  }
};

export const markEducationCompleted = (eduId: string): string[] => {
  const current = getCompletedEducation();
  if (!current.includes(eduId)) {
    const updated = [...current, eduId];
    if (isBrowser) {
      try {
        localStorage.setItem(COMPLETED_EDU_KEY, JSON.stringify(updated));
      } catch (e) {}
    }

    addPoints(20, 0);

    // Event-driven notification for education
    addNotification({
      category: 'Edukasi',
      title: 'Materi edukasi selesai!',
      message: 'Selamat! Modul edukasi hijau telah berhasil kamu selesaikan (+20 poin).',
      body: 'Selamat! Modul edukasi hijau telah berhasil kamu selesaikan (+20 poin).',
      time: 'Baru saja',
    });

    if (isBrowser) {
      window.dispatchEvent(new Event('storage'));
    }

    return updated;
  }
  return current;
};

// 5b. Bookmarked Education Storage Operations
const BOOKMARKED_EDU_KEY = 'sirkula_bookmarked_education';

export const getBookmarkedEducation = (): string[] => {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(BOOKMARKED_EDU_KEY);
    return safeJsonParse<string[]>(data, []);
  } catch (e) {
    return [];
  }
};

export const toggleBookmarkedEducation = (eduId: string): string[] => {
  const current = getBookmarkedEducation();
  const updated = current.includes(eduId)
    ? current.filter((id) => id !== eduId)
    : [...current, eduId];
  if (isBrowser) {
    try {
      localStorage.setItem(BOOKMARKED_EDU_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
};

export const isEducationBookmarked = (eduId: string): boolean => {
  return getBookmarkedEducation().includes(eduId);
};

// 6. Notifications Storage Operations
export const INITIAL_NOTIFICATIONS: SmartNotification[] = [
  {
    id: 'notif-1',
    category: 'Sampah & Pickup',
    title: 'Jadwal penjemputan besok',
    message: 'Sampahmu akan dijemput besok, 25 Juli 2026 pukul 09.30 - 10.00 WIB',
    body: 'Sampahmu akan dijemput besok, 25 Juli 2026 pukul 09.30 - 10.00 WIB',
    time: '1 jam yang lalu',
    timestamp: '1 jam yang lalu',
    read: false,
  },
  {
    id: 'notif-2',
    category: 'Poin & Badge',
    title: 'Poin diterima!',
    message: 'Kamu mendapatkan +20 poin dari kuis "Sampah Organik"',
    body: 'Kamu mendapatkan +20 poin dari kuis "Sampah Organik"',
    time: '2 jam yang lalu',
    timestamp: '2 jam yang lalu',
    read: false,
  },
  {
    id: 'notif-3',
    category: 'Edukasi',
    title: 'Tips "Kulit Pisang" dibaca',
    message: 'Kamu berhasil membaca tips "Kulit Pisang"',
    body: 'Kamu berhasil membaca tips "Kulit Pisang"',
    time: '1 hari yang lalu',
    timestamp: '1 hari yang lalu',
    read: true,
  },
  {
    id: 'notif-4',
    category: 'Sistem',
    title: 'Akun SIRKULA aktif',
    message: 'Selamat datang di ekosistem hijau SIRKULA!',
    body: 'Selamat datang di ekosistem hijau SIRKULA!',
    time: '2 hari yang lalu',
    timestamp: '2 hari yang lalu',
    read: true,
  },
];

export const getNotifications = (): SmartNotification[] => {
  if (!isBrowser) return INITIAL_NOTIFICATIONS;
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return safeJsonParse<SmartNotification[]>(data, INITIAL_NOTIFICATIONS);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
};

export const addNotification = (notifData: Partial<SmartNotification> & { title: string }): SmartNotification => {
  const current = getNotifications();
  const newNotif: SmartNotification = {
    id: `notif-${Date.now()}`,
    category: notifData.category || 'Sistem',
    title: notifData.title,
    message: notifData.message || notifData.body || notifData.title,
    body: notifData.body || notifData.message || notifData.title,
    time: notifData.time || 'Baru saja',
    timestamp: notifData.timestamp || 'Baru saja',
    read: false,
  };

  const updated = [newNotif, ...current];
  if (isBrowser) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }

  return newNotif;
};

export const markAllNotificationsRead = (): SmartNotification[] => {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  if (isBrowser) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
};

export const markNotificationRead = (id: string): SmartNotification[] => {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  if (isBrowser) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
};

export const deleteNotification = (id: string): SmartNotification[] => {
  const current = getNotifications();
  const updated = current.filter((n) => n.id !== id);
  if (isBrowser) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
};

export const getUnreadNotificationCount = (): number => {
  const notifs = getNotifications();
  return notifs.filter((n) => !n.read).length;
};

// 7. Favorite Bank Sampah Operations
export const getFavoriteBankSampah = (): string[] => {
  if (!isBrowser) return ['bs-1'];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return safeJsonParse<string[]>(data, ['bs-1']);
  } catch (e) {
    return ['bs-1'];
  }
};

export const toggleFavoriteBankSampah = (bankId: string): string[] => {
  const current = getFavoriteBankSampah();
  const isFav = current.includes(bankId);
  const updated = isFav ? current.filter((id) => id !== bankId) : [...current, bankId];
  if (isBrowser) {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }
  return updated;
};

// 8. User Password Update
export const updateUserPassword = (email: string, newPassword: string): { success: boolean; message: string } => {
  const users = getRegisteredUsers();
  const targetEmail = email.trim().toLowerCase();
  const userIndex = users.findIndex((u) => u.email && u.email.toLowerCase() === targetEmail);

  if (userIndex === -1) {
    return { success: false, message: 'Akun dengan email ini tidak ditemukan.' };
  }

  if (isBrowser) {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      
      // Also notify
      addNotification({
        category: 'Sistem',
        title: 'Password berhasil diubah',
        message: 'Password akun SIRKULA Anda telah berhasil diperbarui.',
        body: 'Password akun SIRKULA Anda telah berhasil diperbarui.',
        time: 'Baru saja',
      });
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }

  return { success: true, message: 'Password berhasil diperbarui!' };
};
