'use client';

import React, { useEffect, useState } from 'react';
import { WasteLocation } from '../../lib/types';
import L from 'leaflet';

interface LeafletMapProps {
  locations: WasteLocation[];
  activeLocId: string;
  onSelectLocId: (id: string) => void;
}

export default function LeafletMap({ locations, activeLocId, onSelectLocId }: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Center coordinates around campus (e.g. ITB Ganesha -6.8915, 107.6106)
    const map = L.map('leaflet-map-container').setView([-6.8905, 107.6106], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add custom markers
    locations.forEach((loc) => {
      const isSelected = loc.id === activeLocId;
      const lat = loc.lat !== undefined ? loc.lat : (loc.latitude || -6.8905);
      const lng = loc.lng !== undefined ? loc.lng : (loc.longitude || 107.6106);
      const type = loc.type || loc.category || 'Bank Sampah';
      const distance = loc.distanceKm !== undefined ? `${loc.distanceKm} km` : '0.8 km';
      const priceRange = loc.pricePerKgRange || 'Rp 3.000 - Rp 7.000 / kg';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${isSelected ? 'linear-gradient(to right, #10b981, #14b8a6)' : '#091310'};
            color: ${isSelected ? '#091310' : '#34d399'};
            border: 2px solid ${isSelected ? '#ffffff' : '#10b981'};
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: pointer;
          ">
            📍 ${loc.name.split(' ')[0]}
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [60, 15],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <b style="color: #10b981; font-size: 13px;">${loc.name}</b><br/>
          <span style="font-size: 11px; color: #cbd5e1;">${type} • ${distance}</span><br/>
          <span style="font-size: 11px; color: #f59e0b; font-weight: bold;">${priceRange}</span>
        </div>
      `);

      marker.on('click', () => {
        onSelectLocId(loc.id);
      });
    });

    return () => {
      map.remove();
    };
  }, [isMounted, locations, activeLocId, onSelectLocId]);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
        Memuat Peta Leaflet.js OpenStreetMap...
      </div>
    );
  }

  return <div id="leaflet-map-container" className="w-full h-full min-h-[320px] rounded-2xl z-0" />;
}
