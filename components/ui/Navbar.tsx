'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { getUserProfile, logoutUser } from '@/lib/utils/storage';
import { UserProfile } from '@/lib/types';

type NavSection = 'beranda' | 'fitur' | 'cara-kerja' | 'testimoni';

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'cara-kerja', label: 'Cara Kerja' },
  { id: 'testimoni', label: 'Testimoni' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<NavSection>('beranda');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Track page scroll progress, active section & check user login session state
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }

      // Scrollspy calculation
      if (window.scrollY < 120) {
        setActiveSection('beranda');
        return;
      }

      const sections: NavSection[] = ['testimoni', 'cara-kerja', 'fitur', 'beranda'];
      const scrollPos = window.scrollY + 160;

      for (const sId of sections) {
        const el = document.getElementById(sId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };

    // Load active logged-in user profile from storage
    const activeProfile = getUserProfile();
    setUser(activeProfile);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    const defaultLoggedOutProfile = logoutUser();
    setUser(defaultLoggedOutProfile);
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: NavSection) => {
    e.preventDefault();
    setActiveSection(sectionId);

    if (pathname !== '/') {
      window.location.href = sectionId === 'beranda' ? '/' : `/#${sectionId}`;
      return;
    }

    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const navHeight = 84;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth',
      });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F5F3E9]/90 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, 'beranda')}
          className="flex items-center group cursor-pointer"
        >
          <img
            src="/assets/brand/logo-icon.png"
            alt="SIRKULA - Menutup Lingkaran Sampah dari Rumah ke Pengepul"
            className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.endsWith('.svg')) {
                img.src = '/assets/brand/logo-icon.svg';
              }
            }}
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleNavClick(e, item.id)}
                className={`px-5 py-2 text-base font-extrabold transition rounded-xl relative cursor-pointer ${
                  isActive
                    ? 'text-[#1C4D38] bg-[#EFECE3]'
                    : 'text-[#1C4D38]/80 hover:text-[#1C4D38] hover:bg-[#EFECE3]/60'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-4 right-4 h-[2.5px] bg-[#1C4D38] rounded-full transition-all duration-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-4">
          {user && user.isLoggedIn ? (
            /* Logged-In State */
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-[#1C4D38] bg-white border border-[#1C4D38]/20 rounded-full hover:bg-[#1C4D38]/5 transition shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-[#1C4D38]/20">
                <div className="w-9 h-9 rounded-full bg-[#E07A5F] text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-extrabold text-[#1C4D38] leading-none">{user.name}</p>
                  <p className="text-[10px] text-[#1C4D38]/70 font-semibold mt-0.5">{user.points} Poin</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-1.5 text-[#1C4D38]/60 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Visitor State */
            <div className="flex items-center gap-5">
              <Link
                href="/login"
                className="text-base font-extrabold text-[#1C4D38] hover:opacity-80 transition"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-7 py-2.5 text-base font-extrabold text-[#D9A74E] bg-[#1C4D38] hover:bg-[#143929] rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Full-width Line at Bottom of Navbar with Active Scroll Progress Indicator */}
      <div className="w-full bg-[#1C4D38]/20 h-[3px] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1C4D38] via-[#66C699] to-[#D9A74E] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}