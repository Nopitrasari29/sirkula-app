'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronRight, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/utils/storage';
import { SmartNotification } from '@/lib/types';

export default function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [bellImgError, setBellImgError] = useState(false);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    const list = getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const handleStorage = () => loadNotifications();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleItemClick = (id: string) => {
    const updated = markNotificationRead(id);
    setNotifications(updated);
  };

  const displayList = notifications.slice(0, 4);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 bg-white rounded-full border border-[#1C4D38]/10 shadow-sm text-[#1C4D38] hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer ${
          isOpen ? 'ring-2 ring-[#1C4D38]/20 bg-gray-50' : ''
        }`}
        title="Notifikasi"
        aria-label="Toggle Notifikasi"
      >
        {!bellImgError ? (
          <img
            src="/assets/icons/icon-notification-bell.png"
            alt="Bell"
            className="w-5 h-5 object-contain"
            onError={() => setBellImgError(true)}
          />
        ) : (
          <Bell className="w-5 h-5 text-[#1C4D38]" />
        )}

        {/* Dynamic unread badge/dot */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 🔔 Floating Notification Popover (Global Reusable Component) */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-3xl border border-gray-100 shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Pointer Caret */}
          <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />

          {/* Popover Header Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {!bellImgError ? (
                <img
                  src="/assets/icons/icon-notification-bell.png"
                  alt="Leaf Bell"
                  className="w-5 h-5 object-contain"
                  onError={() => setBellImgError(true)}
                />
              ) : (
                <Bell className="w-5 h-5 text-[#1C4D38]" />
              )}
              <h3 className="text-base font-black text-[#1C4D38] font-display">
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#1C4D38]/70 hover:text-[#1C4D38] flex items-center gap-1 transition"
                  title="Tandai semua dibaca"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Baca Semua</span>
                </button>
              )}
              <Link
                href="/notifikasi"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-0.5 text-xs font-bold text-[#1C4D38] hover:underline ml-1"
              >
                <span>Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Notification List Items */}
          <div className="py-2.5 space-y-3 max-h-80 overflow-y-auto">
            {displayList.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 font-medium">
                Belum ada notifikasi baru.
              </div>
            ) : (
              displayList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`flex items-start gap-3.5 p-2.5 rounded-2xl transition duration-150 cursor-pointer ${
                    !item.read ? 'bg-[#E3F0E9]/30 hover:bg-[#E3F0E9]/50' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Mint Icon Box */}
                  <div className="w-10 h-10 rounded-2xl bg-[#E3F0E9] text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10 group-hover:scale-105 transition-transform duration-200 relative">
                    {!bellImgError ? (
                      <img
                        src="/assets/icons/icon-notification-bell.png"
                        alt="Bell"
                        className="w-5 h-5 object-contain"
                        onError={() => setBellImgError(true)}
                      />
                    ) : (
                      <Bell className="w-4 h-4 text-[#1C4D38]" />
                    )}
                    {!item.read && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-extrabold truncate ${!item.read ? 'text-[#1C4D38]' : 'text-gray-700'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">
                        {item.time || item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed line-clamp-2">
                      {item.body || item.message}
                    </p>
                    {item.category && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#1C4D38]/5 text-[#1C4D38] rounded-md text-[9px] font-bold">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popover Footer Action Bar */}
          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/notifikasi"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-xs font-extrabold text-[#1C4D38] hover:text-[#143929] transition py-1"
            >
              <span>Buka Seluruh Halaman Notifikasi</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
