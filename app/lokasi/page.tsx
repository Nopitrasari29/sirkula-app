'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/dashboard/Sidebar';
import HeaderBar from '@/components/dashboard/HeaderBar';
import CustomAlertModal from '@/components/ui/CustomAlertModal';
import DropPointLeafletMap from '@/components/map/DropPointLeafletMap';
import GpsLocationDetectorBar from '@/components/map/GpsLocationDetectorBar';
import { useGeolocation, adaptLocationsToUser } from '@/hooks/useGeolocation';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import {
  MapPin,
  Search,
  Clock,
  Navigation,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Compass,
  Building2,
  Recycle,
} from 'lucide-react';

interface DropPoint {
  id: string;
  name: string;
  category: 'Drop-off Box 24 Jam' | 'TPS3R Terdekat' | 'Kompos Kampus' | 'Bank Sampah Mitra';
  address: string;
  distance: string;
  hours: string;
  acceptedWaste: string[];
  contact: string;
  lat: number;
  lng: number;
  capacityStatus: 'Tersedia' | 'Hampir Penuh' | 'Penuh';
  notes: string;
}

const DROP_POINTS_DATA: DropPoint[] = [
  {
    id: 'dp-1',
    name: 'Smart Drop-Box 24 Jam — Keputih Permai Kos',
    category: 'Drop-off Box 24 Jam',
    address: 'Jl. Keputih Gang 2 No. 15, Sukolilo, Surabaya',
    distance: '0.4 km',
    hours: '24 Jam Nonstop',
    acceptedWaste: ['Plastik PET Botol', 'Kaleng Minuman', 'Kardus Paket'],
    contact: '0812-3456-7890',
    lat: -7.2890,
    lng: 112.7980,
    capacityStatus: 'Tersedia',
    notes: 'Kamera scanner mandiri aktif. Poin langsung masuk ke akun SIRKULA.',
  },
  {
    id: 'dp-2',
    name: 'Drop-off Bin Mandiri — Gebang Timur',
    category: 'Drop-off Box 24 Jam',
    address: 'Jl. Gebang Wetan No. 8, Gebang Putih, Sukolilo, Surabaya',
    distance: '0.8 km',
    hours: '24 Jam Nonstop',
    acceptedWaste: ['Botol Plastik', 'Gelas Plastik', 'Kertas & Karton'],
    contact: '0813-9876-5432',
    lat: -7.2865,
    lng: 112.7915,
    capacityStatus: 'Tersedia',
    notes: 'Dilengkapi timbangan digital SIRKULA. Bersihkan botol sebelum dimasukkan.',
  },
  {
    id: 'dp-3',
    name: 'TPS3R Semolowaru Ramah Lingkungan',
    category: 'TPS3R Terdekat',
    address: 'Jl. Semolowaru Bahari No. 4, Sukolilo, Surabaya',
    distance: '1.5 km',
    hours: 'Senin - Sabtu: 08.00 - 15.00 WIB',
    acceptedWaste: ['Semua Jenis Plastik', 'Kardus & Kertas', 'Minyak Jelantah', 'Logam'],
    contact: '0851-2345-6789',
    lat: -7.2980,
    lng: 112.7810,
    capacityStatus: 'Tersedia',
    notes: 'Menerima setoran volume besar hingga 50 kg dengan konversi rupiah tunai/poin.',
  },
  {
    id: 'dp-4',
    name: 'Stasiun Kompos Kampus Terpadu — ITS Eco Campus',
    category: 'Kompos Kampus',
    address: 'Area Lingkungan Hidup Kampus ITS, Sukolilo, Surabaya',
    distance: '1.1 km',
    hours: 'Setiap Hari: 07.00 - 17.00 WIB',
    acceptedWaste: ['Sisa Makanan Kering', 'Kulit Buah & Sayur', 'Ampas Kopi & Teh'],
    contact: '0821-4567-8901',
    lat: -7.2810,
    lng: 112.7950,
    capacityStatus: 'Tersedia',
    notes: 'Bahan baku pupuk organik taman kampus. Gratis pupuk kompos untuk mahasiswa.',
  },
  {
    id: 'dp-5',
    name: 'Bank Sampah Induk Surabaya Timur — SIRKULA Central Hub',
    category: 'Bank Sampah Mitra',
    address: 'Jl. Mulyorejo Utara No. 88, Mulyorejo, Surabaya',
    distance: '3.1 km',
    hours: 'Senin - Sabtu: 08.30 - 16.30 WIB',
    acceptedWaste: ['Plastik PET', 'Kertas & Buku Bekas', 'Aluminium & Seng', 'Elektronik B3'],
    contact: '0812-7788-9900',
    lat: -7.2654,
    lng: 112.7832,
    capacityStatus: 'Tersedia',
    notes: 'Pusat daur ulang induk resmi. Mendukung penjemputan armada roda tiga SIRKULA.',
  },
  {
    id: 'dp-6',
    name: 'Drop-off E-Waste Kos Arief Rahman Hakim',
    category: 'Drop-off Box 24 Jam',
    address: 'Jl. Arief Rahman Hakim No. 102, Sukolilo, Surabaya',
    distance: '1.6 km',
    hours: '24 Jam Nonstop',
    acceptedWaste: ['Baterai Bekas', 'Kabel Rusak', 'Charger', 'Lampu LED'],
    contact: '0819-0123-4567',
    lat: -7.2840,
    lng: 112.7850,
    capacityStatus: 'Tersedia',
    notes: 'Kotak khusus limbah B3 elektronik kecil agar tidak bercampur ke TPA.',
  },
];

function getSimulatedCapacity(id: string): 'Tersedia' | 'Hampir Penuh' | 'Penuh' {
  const hour = new Date().getHours();
  if (id === 'dp-1' && hour >= 15 && hour < 19) return 'Hampir Penuh';
  if (id === 'dp-3' && hour >= 12 && hour < 14) return 'Hampir Penuh';
  if (id === 'dp-2' && hour >= 17) return 'Hampir Penuh';
  if (id === 'dp-6' && (hour >= 21 || hour < 6)) return 'Hampir Penuh';
  return 'Tersedia';
}

export default function LokasiPage() {
  const isAuthorized = useAuthGuard();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Titik');
  const [activeDropPoint, setActiveDropPoint] = useState<DropPoint>(DROP_POINTS_DATA[0]);
  const [mapViewMode, setMapViewMode] = useState<'leaflet' | 'vector'>('leaflet');

  // 📍 Live Geolocation / GPS Hook
  const {
    coords,
    isDetecting,
    isRealGps,
    errorMsg: gpsError,
    requestGpsLocation,
    setSimulatedLocation,
    resetToDefault,
    getDistanceTo,
  } = useGeolocation();

  // 📐 Recalculate dynamic distance based on user GPS coords & sort closest first
  const enrichedDropPoints = useMemo(() => {
    const localizedPoints = adaptLocationsToUser(DROP_POINTS_DATA, coords);
    return localizedPoints.map((item) => {
      const distInfo = getDistanceTo(item.lat, item.lng);
      return {
        ...item,
        distance: distInfo.formatted,
        _numericDistance: distInfo.km,
        capacityStatus: getSimulatedCapacity(item.id),
      };
    }).sort((a, b) => a._numericDistance - b._numericDistance);
  }, [coords, getDistanceTo]);

  // Modal feedback
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });

  const categories = [
    'Semua Titik',
    'Drop-off Box 24 Jam',
    'TPS3R Terdekat',
    'Kompos Kampus',
    'Bank Sampah Mitra',
  ];

  const filteredPoints = useMemo(() => {
    return enrichedDropPoints.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua Titik' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.acceptedWaste.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [enrichedDropPoints, searchQuery, selectedCategory]);

  // Keep active drop point valid
  useEffect(() => {
    if (filteredPoints.length > 0) {
      const exists = filteredPoints.some((p) => p.id === activeDropPoint.id);
      if (!exists) {
        setActiveDropPoint(filteredPoints[0]);
      }
    }
  }, [filteredPoints, activeDropPoint.id]);

  if (!isAuthorized) return null;

  const handleOpenDirections = (point: DropPoint) => {
    const originParam = coords ? `&origin=${coords.lat},${coords.lng}` : '';
    const url = `https://www.google.com/maps/dir/?api=1${originParam}&destination=${point.lat},${point.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContact = (point: DropPoint) => {
    setModalConfig({
      isOpen: true,
      title: `Kontak ${point.name}`,
      message: `Nomor pengelola / admin lokasi: ${point.contact}. Anda dapat menghubungi melalui WhatsApp atau telepon pada jam operasional.`,
      type: 'info',
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF5ED] text-[#1C4D38] font-sans">
      <Sidebar />

      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        {/* Leaf Garland Top Watermark */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none opacity-20 z-0 overflow-hidden">
          <img
            src="/assets/illustrations/leaf-garland-top.png"
            alt="Leaf Garland Watermark"
            className="w-full h-auto max-h-[300px] object-cover object-top filter drop-shadow-xs"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <HeaderBar />

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#1C4D38] to-[#2A664C] rounded-[28px] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D6E6C5]/20 backdrop-blur-md text-[#D6E6C5] rounded-full text-xs font-bold border border-white/10">
                <Compass className="w-3.5 h-3.5" />
                <span>Titik Drop-off & Green Spots Terintegrasi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
                Peta Drop-off Kos & Zona Daur Ulang
              </h1>
              <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                Temukan Smart Drop-Box 24 jam di sekitar kos, TPS3R kelurahan, stasiun kompos kampus, dan bank sampah resmi mitra SIRKULA terdekat.
              </p>
            </div>
          </div>

          {/* 📍 Live GPS Location Detector Bar */}
          <GpsLocationDetectorBar
            currentCoords={coords}
            isRealGps={isRealGps}
            isDetecting={isDetecting}
            errorMsg={gpsError}
            onRequestGps={requestGpsLocation}
            onSelectSimulated={setSimulatedLocation}
            onReset={resetToDefault}
          />

          {/* Filter Bar & Search */}
          <div className="bg-white rounded-2xl p-4 border border-[#1C4D38]/10 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#1C4D38]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari lokasi, jalan, atau jenis sampah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF5ED] rounded-xl text-xs font-bold text-[#1C4D38] placeholder-[#1C4D38]/40 border border-[#1C4D38]/15 focus:outline-hidden focus:ring-2 focus:ring-[#1C4D38]/20 transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 border ${
                      selectedCategory === cat
                        ? 'bg-[#1C4D38] text-white border-[#1C4D38] shadow-xs'
                        : 'bg-[#FAF5ED] text-[#1C4D38] border-[#1C4D38]/20 hover:bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid: Interactive Map + Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive Visual Map Preview */}
            <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#1C4D38]/10 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E3F0E9] text-[#1C4D38] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-[#1C4D38] font-display">
                      Peta Interaktif Titik Drop-off
                    </h2>
                    <p className="text-[10px] text-[#1C4D38]/60 font-semibold">
                      {filteredPoints.length} titik drop-off aktif di {coords.name ? coords.name.replace(' (GPS Real-Time)', '').replace(' (Default)', '').trim() : 'Wilayah Sekitar'}
                    </p>
                  </div>
                </div>

                {/* Map Mode Switcher: Leaflet Real Map vs Vector Map */}
                <div className="flex items-center bg-[#FAF5ED] p-1 rounded-xl border border-[#1C4D38]/15 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMapViewMode('leaflet')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapViewMode === 'leaflet'
                        ? 'bg-[#1C4D38] text-white shadow-2xs'
                        : 'text-[#1C4D38]/70 hover:text-[#1C4D38]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Peta Real</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapViewMode('vector')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mapViewMode === 'vector'
                        ? 'bg-[#1C4D38] text-white shadow-2xs'
                        : 'text-[#1C4D38]/70 hover:text-[#1C4D38]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Sketsa Area</span>
                  </button>
                </div>
              </div>

              {/* Conditional Map View: Real OpenStreetMap (Leaflet) OR Vector Sketch */}
              {mapViewMode === 'leaflet' ? (
                <DropPointLeafletMap
                  dropPoints={filteredPoints}
                  activeDropPoint={activeDropPoint}
                  onSelectPoint={(pt) => setActiveDropPoint(pt as DropPoint)}
                  userCoords={coords}
                />
              ) : (
                /* Simulated Map Canvas with Interactive Markers */
                <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#E8F0EA] border border-[#1C4D38]/15 overflow-hidden flex items-center justify-center">
                  {/* SVG Map Grid Pattern */}
                  <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-map" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1C4D38" strokeWidth="0.8" strokeDasharray="3,3" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-map)" />
                  </svg>

                  {/* Road illustration paths */}
                  <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 20,40 Q 180,80 340,60 T 600,120" fill="none" stroke="#FAF5ED" strokeWidth="18" />
                    <path d="M 20,40 Q 180,80 340,60 T 600,120" fill="none" stroke="#CBD5C0" strokeWidth="8" />
                    <path d="M 80,320 Q 220,200 400,240 T 700,280" fill="none" stroke="#FAF5ED" strokeWidth="16" />
                    <path d="M 80,320 Q 220,200 400,240 T 700,280" fill="none" stroke="#CBD5C0" strokeWidth="7" />
                    <path d="M 240,10 L 250,380" fill="none" stroke="#FAF5ED" strokeWidth="14" />
                    <path d="M 240,10 L 250,380" fill="none" stroke="#CBD5C0" strokeWidth="6" />
                  </svg>

                  {/* Drop Point Markers */}
                  {filteredPoints.map((pt, idx) => {
                    const isSelected = activeDropPoint.id === pt.id;
                    // Dynamic coordinate positions on canvas
                    const topOffsets = ['28%', '45%', '65%', '35%', '75%', '55%'];
                    const leftOffsets = ['22%', '42%', '30%', '68%', '78%', '58%'];

                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setActiveDropPoint(pt)}
                        style={{
                          top: topOffsets[idx % topOffsets.length],
                          left: leftOffsets[idx % leftOffsets.length],
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-300 z-10 ${
                          isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-2xl shadow-md border flex items-center justify-center transition ${
                            isSelected
                              ? 'bg-[#1C4D38] text-white border-white ring-4 ring-[#1C4D38]/20'
                              : 'bg-white text-[#1C4D38] border-[#1C4D38]/20 hover:bg-[#E3F0E9]'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span
                          className={`mt-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold whitespace-nowrap shadow-xs ${
                            isSelected
                              ? 'bg-[#1C4D38] text-white'
                              : 'bg-white/90 text-[#1C4D38] border border-[#1C4D38]/10'
                          }`}
                        >
                          {pt.name.split('—')[0].trim()}
                        </span>
                      </button>
                    );
                  })}

                  {/* Compass & Scale overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#1C4D38]/15 text-[10px] font-bold text-[#1C4D38] flex items-center gap-1.5 shadow-2xs">
                    <Compass className="w-3.5 h-3.5 text-[#1C4D38]" />
                    <span>Area {coords.name ? coords.name.replace(' (GPS Real-Time)', '').replace(' (Default)', '').trim() : 'Sekitar Kamu'} (Radius 3 km)</span>
                  </div>
                </div>
              )}

              {/* Active Drop Point Detail Summary Card */}
              {activeDropPoint && (
                <div className="bg-[#FAF5ED] rounded-2xl p-4 border border-[#1C4D38]/15 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 bg-[#1C4D38] text-white text-[10px] font-extrabold rounded-full inline-block mb-1">
                        {activeDropPoint.category}
                      </span>
                      <h3 className="text-sm font-black text-[#1C4D38] font-display">
                        {activeDropPoint.name}
                      </h3>
                      <p className="text-xs text-[#1C4D38]/70 font-medium mt-0.5">
                        {activeDropPoint.address}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-white text-xs font-black text-[#1C4D38] rounded-xl border border-[#1C4D38]/15 shrink-0">
                      {activeDropPoint.distance}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1C4D38]/10 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-[#1C4D38]/80">
                      <Clock className="w-3.5 h-3.5 text-[#1C4D38]" />
                      <span>{activeDropPoint.hours}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{activeDropPoint.capacityStatus}</span>
                    </div>
                  </div>

                  {/* Actions for active spot */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDirections(activeDropPoint)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1C4D38] hover:bg-[#143929] text-white text-xs font-extrabold rounded-xl transition shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Petunjuk Arah</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContact(activeDropPoint)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-[#FAF5ED] text-[#1C4D38] text-xs font-extrabold rounded-xl border border-[#1C4D38]/20 transition shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Kontak</span>
                    </button>
                    <Link
                      href={`/booking?source=${encodeURIComponent(activeDropPoint.name)}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#D6E6C5] hover:bg-[#C2D6AF] text-[#1C4D38] text-xs font-extrabold rounded-xl transition shadow-2xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Pesan Jemput</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: List of All Matching Locations */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-[#1C4D38] font-display">
                  Daftar Lokasi Terdekat ({filteredPoints.length})
                </h3>
                <Link
                  href="/bank-sampah"
                  className="text-xs font-extrabold text-[#1C4D38] hover:underline"
                >
                  Buka Bank Sampah
                </Link>
              </div>

              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {filteredPoints.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-xs font-semibold text-[#1C4D38]/60 border border-[#1C4D38]/10">
                    Tidak ditemukan titik drop-off yang cocok dengan pencarian Anda.
                  </div>
                ) : (
                  filteredPoints.map((pt) => {
                    const isSelected = activeDropPoint.id === pt.id;
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setActiveDropPoint(pt)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#1C4D38] shadow-md ring-2 ring-[#1C4D38]/15'
                            : 'bg-white/80 hover:bg-white border-[#1C4D38]/10 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-[#1C4D38]/70 block">
                              {pt.category}
                            </span>
                            <h4 className="text-xs font-black text-[#1C4D38] font-display">
                              {pt.name}
                            </h4>
                            <p className="text-[11px] text-[#1C4D38]/70 font-medium">
                              {pt.address}
                            </p>
                          </div>
                          <span className="text-xs font-black text-[#1C4D38] px-2 py-0.5 bg-[#FAF5ED] rounded-lg border border-[#1C4D38]/10 shrink-0">
                            {pt.distance}
                          </span>
                        </div>

                        {/* Waste tags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {pt.acceptedWaste.slice(0, 3).map((w, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#E3F0E9] text-[#1C4D38] text-[9px] font-bold rounded-md"
                            >
                              {w}
                            </span>
                          ))}
                          {pt.acceptedWaste.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-md">
                              +{pt.acceptedWaste.length - 3} lainnya
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#1C4D38]/10 text-[11px]">
                          <span className="text-[#1C4D38]/70 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pt.hours}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDirections(pt);
                            }}
                            className="text-[#1C4D38] font-black hover:underline flex items-center gap-1"
                          >
                            <span>Navigasi</span>
                            <Navigation className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <CustomAlertModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}
