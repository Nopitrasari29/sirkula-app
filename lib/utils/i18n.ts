import { getUserProfile } from './storage';

export type Language = 'id' | 'en';

export const translations = {
  id: {
    sidebar: {
      home: 'Beranda',
      scanner: 'AI Scanner',
      booking: 'Jadwal & Booking',
      bankSampah: 'Bank Sampah',
      locations: 'Lokasi & Drop Point',
      jejakHijau: 'Jejak Hijau',
      edukasi: 'Edukasi',
      notifications: 'Notifikasi',
      umum: 'UMUM',
      settings: 'Pengaturan',
      logout: 'Keluar',
      yourPoints: 'Poin Kamu',
      pointsUnit: 'poin',
    },
    header: {
      greeting: 'Halo,',
      subgreeting: 'Yuk, kelola sampahmu hari ini untuk lingkungan yang lebih bersih!',
    },
    popover: {
      myProfile: 'Profil Saya',
      settings: 'Pengaturan',
      logout: 'Keluar',
    },
    settings: {
      title: 'Pengaturan',
      subtitle: 'Kelola preferensi SIRKULA-mu',
      profilePhoto: 'Foto Profil',
      changePhoto: 'Ganti Foto',
      formatNote: 'Format: JPG, PNG',
      maxNote: 'Maks. 2MB',
      accountInfo: 'Informasi Akun',
      accountInfoSub: 'Kelola informasi pribadi kamu',
      fullName: 'Nama Lengkap',
      email: 'Email',
      phone: 'Nomor HP',
      kosName: 'Nama Kos & No. Kamar',
      kosAddress: 'Alamat Lengkap Kos',
      security: 'Keamanan Akun',
      securitySub: 'Ubah password untuk menjaga keamanan akunmu',
      currentPass: 'Password Saat Ini',
      newPass: 'Password Baru',
      confirmPass: 'Konfirmasi Password Baru',
      passNote: 'Minimal 6 karakter kombinasi huruf dan angka untuk akun kosmu',
      preferences: 'Preferensi Website',
      preferencesSub: 'Atur preferensi tampilan dan lokasi sesuai kebutuhanmu',
      language: 'Bahasa',
      languageSub: 'Pilih bahasa yang digunakan di website',
      location: 'Lokasi Default',
      locationSub: 'Lokasi ini digunakan untuk menampilkan bank sampah terdekat dan layanan penjemputan',
      notificationsPref: 'Preferensi Notifikasi Pintar',
      notifPickup: 'Pengingat Jadwal Jemput Sampah (H-1)',
      notifPoints: 'Pemberitahuan Poin & Reward Baru',
      notifTips: 'Tips Mingguan Pilah Sampah Kos',
      reset: 'Reset Pengaturan',
      save: 'Simpan Perubahan',
      savedToast: 'Pengaturan berhasil disimpan dan diperbarui!',
      resetToast: 'Pengaturan dikembalikan ke nilai standar.',
    },
  },
  en: {
    sidebar: {
      home: 'Home',
      scanner: 'AI Scanner',
      booking: 'Schedule & Booking',
      bankSampah: 'Waste Bank',
      locations: 'Locations & Drop-off',
      jejakHijau: 'Green Trail',
      edukasi: 'Education',
      notifications: 'Notifications',
      umum: 'GENERAL',
      settings: 'Settings',
      logout: 'Logout',
      yourPoints: 'Your Points',
      pointsUnit: 'pts',
    },
    header: {
      greeting: 'Hello,',
      subgreeting: "Let's manage your waste today for a cleaner environment!",
    },
    popover: {
      myProfile: 'My Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your SIRKULA preferences',
      profilePhoto: 'Profile Photo',
      changePhoto: 'Change Photo',
      formatNote: 'Format: JPG, PNG',
      maxNote: 'Max. 2MB',
      accountInfo: 'Account Information',
      accountInfoSub: 'Manage your personal information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      kosName: 'Boarding House & Room',
      kosAddress: 'Full Kos Address',
      security: 'Account Security',
      securitySub: 'Change password to secure your account',
      currentPass: 'Current Password',
      newPass: 'New Password',
      confirmPass: 'Confirm New Password',
      passNote: 'Minimum 6 characters combination of letters and numbers',
      preferences: 'Website Preferences',
      preferencesSub: 'Customize display and location preferences to your needs',
      language: 'Language',
      languageSub: 'Choose the language used on the website',
      location: 'Default Location',
      locationSub: 'This location is used to display nearby waste banks and pickup services',
      notificationsPref: 'Smart Notification Preferences',
      notifPickup: 'Waste Pickup Reminders (D-1)',
      notifPoints: 'Points & Rewards Announcements',
      notifTips: 'Weekly Kos Waste Sorting Tips',
      reset: 'Reset Settings',
      save: 'Save Changes',
      savedToast: 'Settings saved and updated successfully!',
      resetToast: 'Settings reset to default values.',
    },
  },
};

export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'id';
  const user = getUserProfile();
  return (user && user.language === 'en') ? 'en' : 'id';
}

export function useTranslation() {
  const lang = getCurrentLanguage();
  return translations[lang] || translations.id;
}
