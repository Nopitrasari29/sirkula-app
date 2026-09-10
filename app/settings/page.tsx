'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import NotificationPopover from '@/components/ui/NotificationPopover';
import UserProfilePopover from '@/components/ui/UserProfilePopover';
import ProfilePhotoCard from '@/components/settings/ProfilePhotoCard';
import AccountInfoCard from '@/components/settings/AccountInfoCard';
import AccountSecurityCard from '@/components/settings/AccountSecurityCard';
import WebsitePreferencesCard from '@/components/settings/WebsitePreferencesCard';
import { getUserProfile, saveUserProfile } from '@/lib/utils/storage';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function SettingsPage() {
  const isAuthorized = useAuthGuard();
  const [fullName, setFullName] = useState('Rafika Az Zahra Kusumastuti');
  const [email, setEmail] = useState('rafikaazzhr@gmail.com');
  const [phone, setPhone] = useState('08123456789');
  const [boardingName, setBoardingName] = useState('Kos Melati Asri, Kamar 14');
  const [kosAddress, setKosAddress] = useState('Jl. Keputih Gang 2 No. 15, Sukolilo, Surabaya');
  const [language, setLanguage] = useState('id');
  const [location, setLocation] = useState('Sukolilo, Surabaya');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [notifPickup, setNotifPickup] = useState(true);
  const [notifPoints, setNotifPoints] = useState(true);
  const [notifTips, setNotifTips] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUserData = () => {
    const user = getUserProfile();
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.boardingName) setBoardingName(user.boardingName);
      if (user.kosAddress) setKosAddress(user.kosAddress);
      if (user.language) setLanguage(user.language);
      if (user.defaultLocation) setLocation(user.defaultLocation);
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
      if (user.notifPickup !== undefined) setNotifPickup(user.notifPickup);
      if (user.notifPoints !== undefined) setNotifPoints(user.notifPoints);
      if (user.notifTips !== undefined) setNotifTips(user.notifTips);
    }

    // Check GPS storage for real detected location
    try {
      const gpsRaw = localStorage.getItem('sirkula_user_gps_coords');
      if (gpsRaw) {
        const parsed = JSON.parse(gpsRaw);
        if (parsed?.name) {
          const cleanName = parsed.name
            .replace(' (GPS Real-Time)', '')
            .replace(' (Default)', '')
            .replace(' (Simulasi)', '')
            .trim();
          if (cleanName && (!user?.defaultLocation || user.defaultLocation === 'Sukolilo, Surabaya')) {
            setLocation(cleanName);
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isAuthorized) {
      loadUserData();
    }
    window.addEventListener('storage', loadUserData);
    window.addEventListener('sirkula:locationChange', loadUserData);
    return () => {
      window.removeEventListener('storage', loadUserData);
      window.removeEventListener('sirkula:locationChange', loadUserData);
    };
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  const currentLang = getCurrentLanguage();
  const t = translations[currentLang] || translations.id;

  const handlePhotoChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    const currentUser = getUserProfile();
    saveUserProfile({
      ...currentUser,
      avatarUrl: newUrl,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleSave = () => {
    const currentUser = getUserProfile();
    const updatedProfile = {
      ...currentUser,
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      boardingName: boardingName.trim(),
      kosAddress: kosAddress.trim(),
      language: language,
      defaultLocation: location,
      avatarUrl: avatarUrl,
      notifPickup: notifPickup,
      notifPoints: notifPoints,
      notifTips: notifTips,
    };

    saveUserProfile(updatedProfile);

    // Trigger local storage event for cross-component update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('sirkula:languageChange', {
        detail: { language: language }
      }));
    }

    const activeT = translations[language as 'id' | 'en'] || translations.id;
    setToastMessage(activeT.settings.savedToast);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReset = () => {
    const defaultName = 'Rafika Az Zahra Kusumastuti';
    const defaultEmail = 'rafikaazzhr@gmail.com';
    const defaultPhone = '08123456789';
    const defaultBoarding = 'Kos Melati Asri, Kamar 14';
    const defaultKosAddress = 'Jl. Keputih Gang 2 No. 15, Sukolilo, Surabaya';
    const defaultLang = 'id';
    const defaultLoc = 'Sukolilo, Surabaya';

    setFullName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);
    setBoardingName(defaultBoarding);
    setKosAddress(defaultKosAddress);
    setLanguage(defaultLang);
    setLocation(defaultLoc);
    setNotifPickup(true);
    setNotifPoints(true);
    setNotifTips(false);

    const currentUser = getUserProfile();
    saveUserProfile({
      ...currentUser,
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      boardingName: defaultBoarding,
      kosAddress: defaultKosAddress,
      language: defaultLang,
      defaultLocation: defaultLoc,
      notifPickup: true,
      notifPoints: true,
      notifTips: false,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('sirkula:languageChange', {
        detail: { language: defaultLang }
      }));
    }

    setToastMessage(translations.id.settings.resetToast);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        
        {/* 🍃 Top Leaf Garland Watermark */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-40 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Top Watermark"
            className="w-full h-auto max-h-[320px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        {/* Floating Fixed Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[9999] px-5 py-3.5 bg-[#1C4D38] text-white text-xs font-black rounded-2xl shadow-2xl border border-emerald-400/30 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>✓ {toastMessage}</span>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display">
                {t.settings.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
                {t.settings.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <NotificationPopover />
              <UserProfilePopover />
            </div>
          </div>

          {/* 1. Top Section: Profile Photo & Account Info Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Foto Profil Card (4 Cols) */}
            <div className="lg:col-span-4">
              <ProfilePhotoCard
                initialPhoto={avatarUrl}
                onPhotoChange={handlePhotoChange}
              />
            </div>

            {/* Informasi Akun Card (8 Cols) */}
            <div className="lg:col-span-8">
              <AccountInfoCard
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                boardingName={boardingName}
                setBoardingName={setBoardingName}
                kosAddress={kosAddress}
                setKosAddress={setKosAddress}
              />
            </div>

          </div>

          {/* 2. Middle Section: Account Security Card */}
          <AccountSecurityCard />

          {/* 3. Bottom Section: Website Preferences Card */}
          <WebsitePreferencesCard
            language={language}
            setLanguage={setLanguage}
            location={location}
            setLocation={setLocation}
            notifPickup={notifPickup}
            setNotifPickup={setNotifPickup}
            notifPoints={notifPoints}
            setNotifPoints={setNotifPoints}
            notifTips={notifTips}
            setNotifTips={setNotifTips}
            onReset={handleReset}
            onSave={handleSave}
          />

        </div>
      </div>
    </div>
  );
}

