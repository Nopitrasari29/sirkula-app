'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserProfile, logoutUser } from '@/lib/utils/storage';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';

export default function UserProfilePopover() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [imageError, setImageError] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  const updateUserData = () => {
    setMounted(true);
    const user = getUserProfile();
    if (user) {
      setUserName(user.name ? user.name : 'Rafika Az Zahra K.');
      setUserEmail(user.email ? user.email : 'rafikaazzhr@gmail.com');
      setAvatarUrl(user.avatarUrl);
      setImageError(false);
    }
    setLang(getCurrentLanguage());
  };

  useEffect(() => {
    updateUserData();
    window.addEventListener('storage', updateUserData);
    return () => window.removeEventListener('storage', updateUserData);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const t = translations[lang] || translations.id;
  const displayFullName = mounted && userName ? userName : '...';
  const avatarInitials = mounted && userName ? userName.substring(0, 2).toUpperCase() : '..';

  return (
    <div className="relative" ref={popoverRef}>
      {/* User Profile Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 pl-1 pr-3.5 py-1 bg-white rounded-full border border-[#1C4D38]/10 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 ${
          isOpen ? 'ring-2 ring-[#1C4D38]/20 bg-gray-50' : ''
        }`}
        aria-label="Toggle User Profile Menu"
      >
        {/* Avatar Circle or Image */}
        <div className="w-8 h-8 rounded-full bg-[#E07A5F] text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
          {avatarUrl && !imageError ? (
            <img
              src={avatarUrl}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{avatarInitials}</span>
          )}
        </div>
        <span className="text-xs font-extrabold text-[#1C4D38] max-w-[140px] truncate">
          {displayFullName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#1C4D38]/60 shrink-0" />
      </button>

      {/* 👤 Floating User Profile Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white rounded-3xl border border-gray-100 shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200 space-y-4">
          
          {/* Top Pointer Caret */}
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />

          {/* User Profile Header Box */}
          <div className="flex items-center gap-3.5 pb-2">
            <div className="w-12 h-12 rounded-full bg-[#E07A5F] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
              {avatarUrl && !imageError ? (
                <img
                  src={avatarUrl}
                  alt=""
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{avatarInitials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-gray-900 truncate leading-tight font-display">
                {displayFullName}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Group Menu Links */}
          <div className="space-y-1 pt-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-gray-900 hover:bg-gray-50 transition"
            >
              <User className="w-4.5 h-4.5 shrink-0 text-gray-900 stroke-[2.2]" />
              <span>{t.popover.myProfile}</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-gray-900 hover:bg-gray-50 transition"
            >
              <Settings className="w-4.5 h-4.5 shrink-0 text-gray-900 stroke-[2.2]" />
              <span>{t.popover.settings}</span>
            </Link>
          </div>

          {/* Logout Action */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-[#E07A5F] hover:bg-red-50 transition text-left"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0 text-[#E07A5F] stroke-[2.2]" />
              <span>{t.popover.logout}</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
