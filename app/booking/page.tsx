'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import NotificationPopover from '@/components/ui/NotificationPopover';
import UserProfilePopover from '@/components/ui/UserProfilePopover';
import RouteSelectionView, { ROUTES_DATA, RouteData } from '@/components/booking/RouteSelectionView';
import BookingDetailFormView from '@/components/booking/BookingDetailFormView';
import BookingSuccessView from '@/components/booking/BookingSuccessView';
import LiveTrackingView from '@/components/booking/LiveTrackingView';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { addPoints, createBooking, getBookings, getUserProfile } from '@/lib/utils/storage';
import { BookingItem } from '@/lib/types';
import { MapPin, ChevronDown, Sparkles, Calendar, History, ArrowRight, Clock, CheckCircle2, Truck } from 'lucide-react';

export default function BookingPage() {
  const isAuthorized = useAuthGuard();
  
  // Tab State: 'booking' | 'history'
  const [activeTab, setActiveTab] = useState<'booking' | 'history'>('booking');

  // Navigation Flow State: 'routes' | 'detail' | 'success' | 'tracking'
  const [currentStep, setCurrentStep] = useState<'routes' | 'detail' | 'success' | 'tracking'>('routes');
  
  // Selected Route & Halte
  const [selectedRoute, setSelectedRoute] = useState<RouteData>(ROUTES_DATA[0]);
  const [selectedHalteId, setSelectedHalteId] = useState<string>('halte-2');
  
  // Submitted Booking State
  const [activeBookingData, setActiveBookingData] = useState<any>(null);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  // Booking history from localStorage
  const [bookingHistory, setBookingHistory] = useState<BookingItem[]>([]);
  const [userLocation, setUserLocation] = useState('Sukolilo, Surabaya');

  const updateLocation = () => {
    try {
      const gpsRaw = localStorage.getItem('sirkula_user_gps_coords');
      if (gpsRaw) {
        const parsed = JSON.parse(gpsRaw);
        if (parsed?.name) {
          setUserLocation(parsed.name.replace(' (GPS Real-Time)', '').replace(' (Default)', '').trim());
          return;
        }
      }
    } catch (e) {}
    const user = getUserProfile();
    if (user?.defaultLocation) setUserLocation(user.defaultLocation);
  };

  const loadHistory = () => {
    setBookingHistory(getBookings());
  };

  useEffect(() => {
    loadHistory();
    updateLocation();
    window.addEventListener('storage', loadHistory);
    window.addEventListener('storage', updateLocation);
    window.addEventListener('sirkula:locationChange', updateLocation);
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('storage', updateLocation);
      window.removeEventListener('sirkula:locationChange', updateLocation);
    };
  }, []);

  if (!isAuthorized) return null;

  const handleContinueToDetail = () => {
    setCurrentStep('detail');
  };

  const handleConfirmBooking = (bookingSummary: any) => {
    const userProfile = getUserProfile();
    const activeUserName = userProfile?.name?.trim() || 'Pengguna SIRKULA';

    // 1. Save real booking into localStorage
    const newBooking = createBooking({
      userId: userProfile?.id || 'user-active',
      userName: activeUserName,
      userAddress: bookingSummary.halte?.name
        ? `${bookingSummary.halte.name}, ${bookingSummary.halte.address}`
        : `Bank Sampah Terdekat, ${userLocation}`,
      wasteType:
        bookingSummary.wasteItems
          ?.map((w: any) => w.category || w.name)
          .filter(Boolean)
          .join(', ') || 'Plastik & Kardus',
      estimatedWeightKg: bookingSummary.totalWeight || 2.5,
      pickupDate: bookingSummary.pickupDate || 'Senin, 21 Juli 2026',
      pickupTime: bookingSummary.pickupTime || '09.30 WIB - 09.50 WIB',
      totalPoints: bookingSummary.earnedPoints || 82,
      resaleValue: bookingSummary.totalValue || 15000,
    });

    const fullBookingData = {
      ...bookingSummary,
      ...newBooking,
      bookingId: newBooking.id,
      id: newBooking.id,
    };

    setActiveBookingData(fullBookingData);
    loadHistory();
    
    // 2. Add bonus points in localStorage
    addPoints(bookingSummary.earnedPoints || 82, bookingSummary.totalWeight || 2.5);

    setRewardToast(`Booking #${newBooking.id} Berhasil! +${bookingSummary.earnedPoints || 82} Poin ditambahkan ke akunmu.`);
    setTimeout(() => {
      setRewardToast(null);
    }, 4500);

    setCurrentStep('success');
  };

  const handleViewLiveTracking = (booking?: any) => {
    if (booking) {
      setActiveBookingData(booking);
    }
    setActiveTab('booking');
    setCurrentStep('tracking');
  };

  const handleBackToRoutes = () => {
    setCurrentStep('routes');
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

        {/* Floating Reward Toast Notification */}
        {rewardToast && (
          <div className="fixed top-6 right-6 z-50 bg-[#1C4D38] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#FCE39E]/60 flex items-center gap-3.5 animate-in slide-in-from-top-6 duration-300">
            <Sparkles className="w-5 h-5 text-[#FCE39E]" />
            <span className="text-xs font-black">{rewardToast}</span>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display flex items-center gap-2">
                <span>Jadwal & Booking Penjemputan</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
                Pilih rute, titik penyetoran (bank sampah), dan pantau jadwal penjemputanmu
              </p>
            </div>

            {/* Header Right Action Bar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('sirkula:openLocationModal'));
                  }
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#1C4D38]/10 shadow-sm text-xs font-bold text-[#1C4D38] hover:shadow-md hover:border-emerald-600 transition cursor-pointer"
                title="Klik untuk melihat atau mengubah lokasi GPS"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span className="max-w-[140px] truncate">{userLocation}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1C4D38]/60" />
              </button>

              <NotificationPopover />
              <UserProfilePopover />
            </div>
          </div>

          {/* 🏷️ Top Tabs Switcher: Buat Booking Baru vs Riwayat Booking */}
          <div className="flex items-center gap-2 border-b border-[#1C4D38]/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('booking')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'booking'
                  ? 'bg-[#1C4D38] text-white shadow-xs'
                  : 'bg-white/80 text-[#1C4D38]/80 hover:bg-white border border-[#1C4D38]/10'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Buat Booking Penjemputan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#1C4D38] text-white shadow-xs'
                  : 'bg-white/80 text-[#1C4D38]/80 hover:bg-white border border-[#1C4D38]/10'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Booking ({bookingHistory.length})</span>
            </button>
          </div>

          {/* 📋 VIEW 1: FORM WIZARD BOOKING */}
          {activeTab === 'booking' && (
            <>
              {/* STEP 1: Pilih Rute & Halte Penyetoran */}
              {currentStep === 'routes' && (
                <RouteSelectionView
                  selectedRoute={selectedRoute}
                  selectedHalteId={selectedHalteId}
                  onSelectRoute={setSelectedRoute}
                  onSelectHalteId={setSelectedHalteId}
                  onContinue={handleContinueToDetail}
                />
              )}

              {/* STEP 2: Detail Sampah & Konfirmasi */}
              {currentStep === 'detail' && (
                <BookingDetailFormView
                  route={selectedRoute}
                  halteId={selectedHalteId}
                  onBack={handleBackToRoutes}
                  onConfirmBooking={handleConfirmBooking}
                />
              )}

              {/* STEP 3: Booking Berhasil! */}
              {currentStep === 'success' && (
                <BookingSuccessView
                  bookingData={activeBookingData}
                  onViewTracking={() => handleViewLiveTracking(activeBookingData)}
                  onNewBooking={handleBackToRoutes}
                />
              )}

              {/* STEP 4: Live Tracking Perjalanan Truk */}
              {currentStep === 'tracking' && (
                <LiveTrackingView
                  bookingData={activeBookingData}
                  onBackToBooking={handleBackToRoutes}
                />
              )}
            </>
          )}

          {/* 📜 VIEW 2: RIWAYAT BOOKING PENGGUNA (Data Nyata dari localStorage) */}
          {activeTab === 'history' && (
            <div className="bg-[#FAF5ED]/90 border border-[#1C4D38]/10 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-xs backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1C4D38] font-display">
                    Daftar Riwayat Booking Anda
                  </h3>
                  <p className="text-xs text-[#1C4D38]/70 font-semibold">
                    Semua transaksi penjemputan sampah terpilah yang tersimpan di akun Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('booking');
                    setCurrentStep('routes');
                  }}
                  className="px-4 py-2 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-black rounded-xl transition cursor-pointer"
                >
                  + Booking Baru
                </button>
              </div>

              {bookingHistory.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-white/70 rounded-2xl border border-dashed border-[#1C4D38]/20">
                  <Truck className="w-10 h-10 text-[#1C4D38]/40 mx-auto" />
                  <p className="text-sm font-bold text-[#1C4D38]">Belum ada riwayat booking</p>
                  <p className="text-xs text-[#1C4D38]/60">
                    Mulai daftarkan sampah terpilah kosmu untuk dijemput kurir SIRKULA.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#1C4D38]/10 p-5 shadow-2xs space-y-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="font-mono text-xs font-black text-[#1C4D38] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          #{item.id}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#D1EBE1] text-[#1C4D38]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>{item.status || 'Dikonfirmasi'}</span>
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#1C4D38]">
                        <p className="font-extrabold text-sm font-display flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{item.userAddress || item.pickupAddress || 'Halte Bank Sampah'}</span>
                        </p>
                        <p className="text-[#1C4D38]/80 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span>{item.pickupDate || 'Hari ini'} • {item.pickupTime || '09.30 WIB'}</span>
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
                          <span className="text-[#1C4D38]/70 font-bold">
                            Jenis: <strong className="text-[#1C4D38]">{item.wasteType || 'Anorganik'}</strong> ({item.estimatedWeightKg || 2} kg)
                          </span>
                          <span className="text-emerald-700 font-black">
                            +{item.totalPoints || 80} Poin
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewLiveTracking(item)}
                        className="w-full py-2 bg-[#FAF5ED] hover:bg-[#1C4D38] hover:text-white border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Lacak Status Penjemputan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
