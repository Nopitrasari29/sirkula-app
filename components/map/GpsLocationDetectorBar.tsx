'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, CheckCircle2, RefreshCw, AlertCircle, Compass, ChevronDown } from 'lucide-react';
import { GeoCoordinates, DEFAULT_SURABAYA_COORDS } from '@/hooks/useGeolocation';

interface GpsLocationDetectorBarProps {
  currentCoords: GeoCoordinates;
  isRealGps: boolean;
  isDetecting: boolean;
  errorMsg: string | null;
  onRequestGps: () => Promise<any>;
  onSelectSimulated: (coords: GeoCoordinates) => void;
  onReset: () => void;
}

const PRESET_SIMULATED_LOCATIONS: GeoCoordinates[] = [
  {
    lat: -7.2910,
    lng: 112.7990,
    name: 'Kos Keputih Permai (Dekat ITS)',
  },
  {
    lat: -7.2885,
    lng: 112.7915,
    name: 'Kos Gebang Wetan (Belakang Kampus)',
  },
  {
    lat: -7.2680,
    lng: 112.7850,
    name: 'Kos Mulyorejo (Dekat UNAIR Kampus C)',
  },
  {
    lat: -7.2980,
    lng: 112.7810,
    name: 'Kos Semolowaru Bahari',
  },
];

export default function GpsLocationDetectorBar({
  currentCoords,
  isRealGps,
  isDetecting,
  errorMsg,
  onRequestGps,
  onSelectSimulated,
  onReset,
}: GpsLocationDetectorBarProps) {
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-[#1C4D38]/10 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left Status & Details */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
              isRealGps
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : isDetecting
                ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                : 'bg-[#FAF5ED] text-[#1C4D38] border-[#1C4D38]/15'
            }`}
          >
            {isDetecting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : isRealGps ? (
              <Navigation className="w-5 h-5 text-emerald-700" />
            ) : (
              <Compass className="w-5 h-5 text-[#1C4D38]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-[#1C4D38] font-display">
                Deteksi Lokasi & Radius Sekitar Kamu
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  isRealGps
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-[#FAF5ED] text-[#1C4D38]/80 border border-[#1C4D38]/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isRealGps ? 'bg-white animate-ping' : 'bg-emerald-700'}`} />
                <span>{isRealGps ? 'GPS Aktif' : 'Mode Default'}</span>
              </span>
            </div>

            <p className="text-[11px] text-[#1C4D38]/75 font-medium mt-0.5">
              Titik acuan: <strong className="text-[#1C4D38] font-black">{currentCoords.name || `${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`}</strong>
              {currentCoords.accuracy && ` (Akurasi ±${Math.round(currentCoords.accuracy)}m)`}
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Main GPS Detect Button */}
          <button
            type="button"
            onClick={onRequestGps}
            disabled={isDetecting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C4D38] hover:bg-[#143929] disabled:opacity-60 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Mencari Satelit GPS...' : 'Nyalakan GPS Saya'}</span>
          </button>

          {/* Preset Simulation Dropdown Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1 px-3 py-2 bg-[#FAF5ED] hover:bg-white text-[#1C4D38] text-xs font-bold rounded-xl border border-[#1C4D38]/15 transition cursor-pointer"
              title="Pilih Titik Simulasi Kos"
            >
              <span>Simulasi Kos</span>
              <ChevronDown className="w-3 h-3 text-[#1C4D38]/60" />
            </button>

            {/* Presets Menu */}
            {showPresets && (
              <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl border border-[#1C4D38]/15 shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[9px] font-black uppercase text-[#1C4D38]/50 px-2 py-1">
                  Pilih Area Sekitar Kos:
                </div>
                {PRESET_SIMULATED_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      onSelectSimulated(loc);
                      setShowPresets(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-[#1C4D38] hover:bg-[#FAF5ED] rounded-lg transition flex items-center justify-between"
                  >
                    <span>{loc.name}</span>
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                  </button>
                ))}

                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setShowPresets(false);
                    }}
                    className="w-full text-left px-2.5 py-1 text-[11px] font-extrabold text-amber-800 hover:bg-amber-50 rounded-lg transition"
                  >
                    ↺ Reset ke Sukolilo Default
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Error / Fallback Alert Note */}
      {errorMsg && (
        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
