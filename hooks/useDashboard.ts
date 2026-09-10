'use client';

import { useState, useEffect } from 'react';
import { WasteSubmission, Badge, SmartNotification } from '../lib/types';
import { INITIAL_BADGES } from '../lib/logic/calculatePoints';

const INITIAL_SUBMISSIONS: WasteSubmission[] = [
  {
    id: 'sub-1',
    date: '15 Juli 2026',
    itemName: 'Botol Plastik PET (600ml x 12)',
    category: 'anorganik_daur_ulang',
    weightKg: 2.4,
    pointsEarned: 120,
    resaleValue: 10800,
    co2SavedKg: 4.3,
    status: 'Selesai',
  },
  {
    id: 'sub-2',
    date: '12 Juli 2026',
    itemName: 'Kardus Paket Belanjaan Kos',
    category: 'anorganik_daur_ulang',
    weightKg: 4.1,
    pointsEarned: 180,
    resaleValue: 18450,
    co2SavedKg: 7.3,
    status: 'Selesai',
  },
  {
    id: 'sub-3',
    date: '08 Juli 2026',
    itemName: 'Baterai Bekas Jam & Laptop (4 Pcs)',
    category: 'b3',
    weightKg: 0.5,
    pointsEarned: 80,
    resaleValue: 6000,
    co2SavedKg: 1.6,
    status: 'Selesai',
  },
];

const INITIAL_NOTIFS: SmartNotification[] = [
  {
    id: 'notif-1',
    title: '🎉 Penjemputan Berhasil!',
    message: 'Setoran 4.1 kg kardus kos disetujui Bank Sampah Bersih. Poin +180 & Rp 18.450 ditambahkan.',
    timestamp: '2 jam lalu',
    type: 'reward',
    read: false,
  },
  {
    id: 'notif-2',
    title: '🔥 Streak Harian Pertahankan!',
    message: 'Sudah 8 hari kamu rajin memilah sampah di kos Wisma Ganesha 3. Yuk foto sampahmu hari ini!',
    timestamp: 'Kemarin',
    type: 'streak',
    read: false,
  },
  {
    id: 'notif-3',
    title: '💡 Tips Bebas Bau Makanan Kos',
    message: 'Keringkan kuah sisa mie/makanan sebelum dimasukkan ke kantong organik ya.',
    timestamp: '2 hari lalu',
    type: 'info',
    read: true,
  },
];

export function useDashboard() {
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [notifications, setNotifications] = useState<SmartNotification[]>(INITIAL_NOTIFS);

  useEffect(() => {
    const savedSubmissions = localStorage.getItem('sirkula_submissions');
    if (savedSubmissions) {
      try {
        setSubmissions(JSON.parse(savedSubmissions));
      } catch (e) {
        setSubmissions(INITIAL_SUBMISSIONS);
      }
    } else {
      setSubmissions(INITIAL_SUBMISSIONS);
      localStorage.setItem('sirkula_submissions', JSON.stringify(INITIAL_SUBMISSIONS));
    }

    const savedBadges = localStorage.getItem('sirkula_badges');
    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (e) {
        setBadges(INITIAL_BADGES);
      }
    }
  }, []);

  const addSubmission = (newSub: Omit<WasteSubmission, 'id' | 'date' | 'status'>) => {
    const created: WasteSubmission = {
      ...newSub,
      id: `sub-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Selesai',
    };

    setSubmissions((prev) => {
      const updated = [created, ...prev];
      localStorage.setItem('sirkula_submissions', JSON.stringify(updated));
      return updated;
    });

    // Add notification
    const newNotif: SmartNotification = {
      id: `notif-${Date.now()}`,
      title: '✅ Sampah Berhasil Disetor!',
      message: `Setoran ${created.itemName} (${created.weightKg} kg) berhasil masuk dashboard. Poin +${created.pointsEarned}.`,
      timestamp: 'Baru saja',
      type: 'reward',
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const updated = prev.map((b) =>
        b.id === badgeId
          ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleDateString('id-ID') }
          : b
      );
      localStorage.setItem('sirkula_badges', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    submissions,
    badges,
    notifications,
    addSubmission,
    markNotifRead,
    unlockBadge,
  };
}
