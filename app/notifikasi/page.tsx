'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderBar from '@/components/dashboard/HeaderBar';
import { ChevronLeft, Calendar, CheckSquare, Settings, Bell, Sparkles, Award, BookOpen, X } from 'lucide-react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { getNotifications, markAllNotificationsRead, markNotificationRead, deleteNotification } from '@/lib/utils/storage';
import { SmartNotification } from '@/lib/types';

export default function NotificationPage() {
  const isAuthorized = useAuthGuard();
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);

  const loadNotifications = async () => {
    // API-first: coba ambil dari backend, fallback ke localStorage
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sirkula_auth_token') : null;
      if (token) {
        const res = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setNotifications(data.data);
          return;
        }
      }
    } catch {
      // fallback ke localStorage
    }
    // Fallback: baca dari localStorage
    const list = getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const handleStorage = () => loadNotifications();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!isAuthorized) return null;

  const tabs = ['Semua', 'Sampah & Pickup', 'Poin & Badge', 'Edukasi', 'Sistem'];

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleMarkOneRead = (id: string) => {
    const updated = markNotificationRead(id);
    setNotifications(updated);
  };

  const handleDeleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteNotification(id);
    setNotifications(updated);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'Semua') return true;
    return (n.category || 'Sistem') === activeTab;
  });

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Sampah & Pickup':
        return <Calendar className="w-5 h-5" />;
      case 'Poin & Badge':
        return <Award className="w-5 h-5" />;
      case 'Edukasi':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        
        {/* 🍃 Top Leaf Garland Watermark */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-20 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Top Watermark"
            className="w-full h-auto max-h-[320px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          
          {/* Top Header Bar */}
          <HeaderBar />

          {/* Sub-Header Back Navigation Link */}
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1C4D38] hover:opacity-75 transition"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Semua Notifikasi</span>
            </Link>
          </div>

          {/* Main Card Container (Identik 100% dengan Figma) */}
          <div className="bg-[#FAF5ED]/90 border border-[#1C4D38]/10 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xs backdrop-blur-md">
            
            {/* Filter Tabs & Action Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1C4D38]/10">
              
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 border ${
                      activeTab === tab
                        ? 'bg-[#1C4D38] text-white border-[#1C4D38] shadow-xs'
                        : 'bg-white/80 text-[#1C4D38] border-[#1C4D38]/20 hover:bg-white hover:border-[#1C4D38]/40'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tandai Semua Sebagai Dibaca Button */}
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 hover:bg-white text-xs font-bold text-[#1C4D38] rounded-full border border-[#1C4D38]/20 transition shadow-2xs shrink-0"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tandai semua sebagai dibaca</span>
              </button>

            </div>

            {/* Notification Rows List */}
            <div className="divide-y divide-[#1C4D38]/10">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center text-xs font-semibold text-[#1C4D38]/60">
                  Tidak ada notifikasi dalam kategori ini.
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMarkOneRead(item.id)}
                    className={`py-4 px-3 sm:px-4 rounded-2xl transition duration-150 cursor-pointer flex items-start justify-between gap-4 group ${
                      !item.read ? 'bg-[#E3F0E9]/30 hover:bg-[#E3F0E9]/50' : 'hover:bg-white/60'
                    }`}
                  >
                    {/* Left: Icon Box + Details */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      
                      {/* Mint Icon Box */}
                      <div className="w-12 h-12 rounded-2xl bg-[#E3F0E9] text-[#1C4D38] flex items-center justify-center shrink-0 border border-[#1C4D38]/10 shadow-2xs group-hover:scale-105 transition-transform duration-200 relative">
                        {getCategoryIcon(item.category)}
                        {!item.read && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white" />
                        )}
                      </div>

                      {/* Text & Tag */}
                      <div className="space-y-1 min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-extrabold font-display leading-tight ${!item.read ? 'text-[#1C4D38]' : 'text-gray-700'}`}>
                            {item.title}
                          </h3>
                          {!item.read && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                              Baru
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1C4D38]/80 font-medium leading-relaxed">
                          {item.body || item.message}
                        </p>
                        
                        {/* Category Tag Pill */}
                        <div className="pt-1.5 flex items-center gap-2">
                          <span className="inline-block px-3 py-0.5 bg-white/80 text-[10px] font-bold text-[#1C4D38] rounded-full border border-[#1C4D38]/20">
                            {item.category || 'Sistem'}
                          </span>
                          {item.read && (
                            <span className="text-[10px] text-gray-400 font-medium">
                              Dibaca
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right: Time Ago & Delete Action */}
                    <div className="shrink-0 flex items-center gap-2 text-right pt-0.5">
                      <span className="text-[11px] font-medium text-[#1C4D38]/60">
                        {item.time || item.timestamp}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteOne(item.id, e)}
                        title="Hapus notifikasi"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all duration-150 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Bottom Banner Card (Matching Figma 100% with Leaf Bell Icon) */}
            <div className="bg-gradient-to-r from-[#D6E6C5] to-[#CBE0BA] border border-[#1C4D38]/15 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs mt-6">
              
              {/* Left: Leaf Bell Icon + Text Container */}
              <div className="flex items-center gap-4 min-w-0">
                {/* 🔔 Leaf Bell Custom Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                  <img
                    src="/assets/icons/icon-notification-bell.png"
                    alt="Lonceng Notifikasi Daun SIRKULA"
                    className="w-full h-full object-contain filter drop-shadow-xs hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Banner Text */}
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1C4D38] font-display leading-tight">
                    Aktifkan notifikasi untuk pengalaman terbaik!
                  </h4>
                  <p className="text-xs text-[#1C4D38]/85 font-medium leading-snug">
                    Dapatkan update penting seputar jadwal, poin, badge, dan edukasi langsung!
                  </p>
                </div>
              </div>

              {/* Atur Preferensi Button */}
              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 shrink-0"
              >
                <span>Atur Preferensi</span>
                <Settings className="w-3.5 h-3.5" />
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
