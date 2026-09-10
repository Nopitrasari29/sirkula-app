'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Scan,
  Calendar,
  Trash2,
  MapPin,
  Leaf,
  GraduationCap,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import { logoutUser, getUserProfile, getUnreadNotificationCount } from '@/lib/utils/storage';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userPoints, setUserPoints] = useState<number>(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [lang, setLang] = useState<'id' | 'en'>('id');

  const updateProfileData = () => {
    const user = getUserProfile();
    if (user && typeof user.points === 'number') {
      setUserPoints(user.points);
    } else {
      setUserPoints(1250);
    }
    setUnreadNotifCount(getUnreadNotificationCount());
    setLang(getCurrentLanguage());
  };

  useEffect(() => {
    updateProfileData();
    window.addEventListener('storage', updateProfileData);
    window.addEventListener('sirkula:languageChange', updateProfileData);
    return () => {
      window.removeEventListener('storage', updateProfileData);
      window.removeEventListener('sirkula:languageChange', updateProfileData);
    };
  }, []);

  const t = translations[lang] || translations.id;

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  // Menu items with i18n support
  const menuItems = [
    { name: t.sidebar.home, href: '/dashboard', icon: Home, active: pathname === '/dashboard' },
    { name: t.sidebar.scanner, href: '/scanner', icon: Scan, active: pathname === '/scanner' },
    { name: t.sidebar.booking, href: '/booking', icon: Calendar, active: pathname === '/booking' },
    { name: t.sidebar.bankSampah, href: '/bank-sampah', icon: Trash2, active: pathname === '/bank-sampah' },
    { name: t.sidebar.locations, href: '/lokasi', icon: MapPin, active: pathname === '/lokasi' },
    { name: t.sidebar.jejakHijau, href: '/jejak-hijau', icon: Leaf, active: pathname === '/jejak-hijau' || pathname.startsWith('/jejak-hijau/') },
    { name: t.sidebar.edukasi, href: '/edukasi', icon: GraduationCap, active: pathname === '/edukasi' },
    {
      name: t.sidebar.notifications,
      href: '/notifikasi',
      icon: Bell,
      active: pathname === '/notifikasi',
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-[#1C4D38] text-white flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0 z-30 shadow-xl overflow-hidden">
      
      {/* Top Header Logo (Original Multi-tone Logo Asset) */}
      <div className="space-y-6 overflow-y-auto">
        <Link href="/" className="flex items-center group pt-1">
          <img
            src="/assets/brand/logo-navbar.png"
            alt="SIRKULA - Menutup Lingkaran Sampah dari Rumah ke Pengepul"
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/assets/brand/logo-icon.png';
            }}
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="text-[10px] font-black text-[#F5F3E9]/50 uppercase tracking-wider px-3 mb-1">
            MENU
          </div>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 group ${
                  item.active
                    ? 'bg-[#2A664C] text-white shadow-md'
                    : 'text-[#F5F3E9]/80 hover:bg-[#2A664C]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    item.active ? 'text-white' : 'text-[#F5F3E9]/70 group-hover:text-white'
                  }`} />
                  <span>{item.name}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-red-500 text-white rounded-full min-w-[18px] text-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom General & Points Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        
        {/* General / Settings Menu Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-black text-[#F5F3E9]/50 uppercase tracking-wider px-3 mb-2">
            {t.sidebar.umum}
          </div>
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 group ${
              pathname === '/settings'
                ? 'bg-[#2A664C] text-white shadow-md'
                : 'text-[#F5F3E9]/80 hover:bg-[#2A664C]/50 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 text-[#F5F3E9]/70 group-hover:text-white" />
            <span>{t.sidebar.settings}</span>
          </Link>
        </div>

        {/* User Points Widget Card */}
        <div className="bg-[#2A664C]/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D9A74E]/20 text-[#D9A74E] flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 fill-[#D9A74E]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#F5F3E9]/70">
              {t.sidebar.yourPoints}
            </p>
            <p className="text-sm font-black text-white font-display">
              {userPoints.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-[#D9A74E]">{t.sidebar.pointsUnit}</span>
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-[#F5F3E9]/80 hover:bg-red-900/40 hover:text-red-200 transition-all duration-200 group text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 text-[#F5F3E9]/70 group-hover:text-red-200" />
          <span>{t.sidebar.logout}</span>
        </button>

      </div>

    </aside>
  );
}
