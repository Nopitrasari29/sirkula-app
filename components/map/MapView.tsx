'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { WasteLocation, WasteCategoryType } from '../../lib/types';
import { MapPin, Phone, Clock, Star, ArrowRight, ShieldCheck, CheckCircle2, Truck, Layers } from 'lucide-react';
import categoriesData from '../../lib/data/wasteCategories.json';

const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 bg-slate-950 rounded-2xl">
      Memuat Peta Leaflet.js...
    </div>
  ),
});

interface MapViewProps {
  locations: WasteLocation[];
  selectedCategory: string;
  onSelectLocation: (location: WasteLocation) => void;
}

export default function MapView({ locations, selectedCategory, onSelectLocation }: MapViewProps) {
  const [activeLocId, setActiveLocId] = useState<string>(locations[0]?.id || '');
  const [mapMode, setMapMode] = useState<'leaflet' | 'vector'>('leaflet');

  const filteredLocations = selectedCategory
    ? locations.filter((loc) => loc.acceptedCategories.includes(selectedCategory as WasteCategoryType))
    : locations;

  const activeLoc = locations.find((l) => l.id === activeLocId) || locations[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Interactive Map Visual Box (Left 7 Cols) */}
      <div className="lg:col-span-7 glass-card rounded-3xl p-4 sm:p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px]">
        {/* Top Floating Overlay Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 z-10">
          <div className="flex items-center gap-3 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-emerald-500/30">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-black text-white">Peta Bank Sampah Sekitar Kampus</div>
              <div className="text-[10px] text-slate-400">Radius 1.5 km Zona Kos Mahasiswa</div>
            </div>
          </div>

          {/* Mode Switcher: Leaflet vs Vector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setMapMode('leaflet')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mapMode === 'leaflet'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Leaflet.js Map
            </button>
            <button
              onClick={() => setMapMode('vector')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mapMode === 'vector'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid Vektor Kampus
            </button>
          </div>
        </div>

        {/* Map Container View */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          {mapMode === 'leaflet' ? (
            <DynamicLeafletMap
              locations={filteredLocations}
              activeLocId={activeLocId}
              onSelectLocId={(id) => setActiveLocId(id)}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Simulated Grid Streets */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.8" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <circle cx="50%" cy="50%" r="90" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-950/90 border border-emerald-400 px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-300 shadow-xl z-0 pointer-events-none">
                🏫 Gedung Utama Kampus
              </div>

              {filteredLocations.map((loc, idx) => {
                const isSelected = loc.id === activeLocId;
                const positions = [
                  { top: '28%', left: '35%' },
                  { top: '62%', left: '68%' },
                  { top: '22%', left: '75%' },
                  { top: '70%', left: '25%' },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocId(loc.id)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-xs shadow-xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-white ring-4 ring-emerald-500/40'
                          : 'bg-slate-900/90 text-emerald-300 border-emerald-500/40 hover:bg-emerald-950'
                      }`}
                    >
                      <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'fill-slate-950' : 'fill-emerald-400'}`} />
                      <span className="truncate max-w-[100px]">{loc.name.split(' ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Selected Location Banner */}
        {activeLoc && (
          <div className="mt-4 bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full">
                {activeLoc.type || activeLoc.category} • {activeLoc.distanceKm || 0.8} km dari kos
              </span>
              <h4 className="text-sm font-black text-white mt-1">{activeLoc.name}</h4>
              <p className="text-[11px] text-slate-400 truncate">{activeLoc.address}</p>
            </div>
            <button
              onClick={() => onSelectLocation(activeLoc)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-xs hover:from-emerald-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0"
            >
              <Truck className="h-4 w-4" /> Ajukan Penjemputan
            </button>
          </div>
        )}
      </div>

      {/* Location Detail List Cards (Right 5 Cols) */}
      <div className="lg:col-span-5 space-y-3 max-h-[540px] overflow-y-auto pr-1">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Daftar Mitra Bank Sampah Kos ({filteredLocations.length})
        </h3>

        {filteredLocations.map((loc) => {
          const isSelected = loc.id === activeLocId;
          const locType = loc.type || loc.category;
          const priceRange = loc.pricePerKgRange || 'Rp 3.000 - Rp 7.000 / kg';
          return (
            <div
              key={loc.id}
              onClick={() => setActiveLocId(loc.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-950/70 border-emerald-400 shadow-lg ring-1 ring-emerald-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-emerald-700 hover:bg-emerald-950/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {locType}
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-1">{loc.name}</h4>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-gold-400 bg-slate-900 px-2 py-1 rounded-lg">
                  <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" /> {loc.rating}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{loc.address}</p>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" /> {loc.operatingHours.split(':')[0]}
                </div>
                <div className="font-bold text-emerald-400">{priceRange}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {loc.acceptedCategories.map((catId) => {
                    const catName = categoriesData.find((c) => c.id === catId)?.name.split(' ')[0];
                    return (
                      <span key={catId} className="text-[9px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md">
                        {catName}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(loc);
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  Booking <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
