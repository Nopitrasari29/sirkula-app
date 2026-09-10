'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Plus, Minus, Crosshair } from 'lucide-react';
import { BankSampahItem } from './BankSampahListTable';

// Dynamically import Leaflet components to avoid Next.js SSR window undefined issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface InteractiveMapViewProps {
  bankSampahList: BankSampahItem[];
  selectedBank: BankSampahItem;
  onSelectBank: (item: BankSampahItem) => void;
  userCoords?: { lat: number; lng: number; name?: string };
}

// Component to handle auto-center panTo when selectedBank changes
function MapRecenterHandler({ lat, lng }: { lat: number; lng: number }) {
  const [useMapHook, setUseMapHook] = useState<any>(null);

  useEffect(() => {
    import('react-leaflet').then((mod) => {
      setUseMapHook(() => mod.useMap);
    });
  }, []);

  if (!useMapHook) return null;

  return <MapControllerInner lat={lat} lng={lng} useMapHook={useMapHook} />;
}

function MapControllerInner({ lat, lng, useMapHook }: { lat: number; lng: number; useMapHook: any }) {
  const map = useMapHook();
  useEffect(() => {
    if (map && lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.2 });
    }
  }, [map, lat, lng]);
  return null;
}

export default function InteractiveMapView({
  bankSampahList,
  selectedBank,
  onSelectBank,
  userCoords,
}: InteractiveMapViewProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [showAreaOnly, setShowAreaOnly] = useState(true);

  // Focus coordinates can target either selectedBank or user location
  const [targetLat, setTargetLat] = useState(selectedBank.lat || -7.2825);
  const [targetLng, setTargetLng] = useState(selectedBank.lng || 112.7944);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leafletMod) => {
      setL(leafletMod.default || leafletMod);
    });
  }, []);

  // Update target coordinates when selectedBank changes
  useEffect(() => {
    if (selectedBank.lat && selectedBank.lng) {
      setTargetLat(selectedBank.lat);
      setTargetLng(selectedBank.lng);
    }
  }, [selectedBank.id, selectedBank.lat, selectedBank.lng]);

  // Default Center Surabaya (Sukolilo / ITS Region)
  const defaultLat = selectedBank.lat || -7.2825;
  const defaultLng = selectedBank.lng || 112.7944;

  // Custom Leaflet Pin HTML for Bank Sampah
  const createCustomIcon = (isSelected: boolean, name: string) => {
    if (!L) return undefined;

    const bgColor = isSelected ? '#1C4D38' : '#E07A5F';
    const borderColor = '#FFFFFF';
    const size = isSelected ? 36 : 28;

    const html = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        ${
          isSelected
            ? `<div style="
                background: #1C4D38;
                color: #FFFFFF;
                font-size: 11px;
                font-weight: 900;
                padding: 4px 10px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(28,77,56,0.35);
                white-space: nowrap;
                margin-bottom: 4px;
                font-family: sans-serif;
                border: 1px solid rgba(255,255,255,0.4);
              ">${name}</div>`
            : ''
        }
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${bgColor};
          border: 3px solid ${borderColor};
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="${bgColor}"></circle>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: 'custom-leaflet-pin',
      iconSize: [size, size + (isSelected ? 26 : 0)],
      iconAnchor: [size / 2, size + (isSelected ? 26 : 0)],
    });
  };

  // Custom Pulsing Leaflet Pin for User Current Location
  const createUserLocationIcon = () => {
    if (!L) return undefined;
    const html = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 44px; height: 44px;">
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(37, 99, 235, 0.25); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 20px; height: 20px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5); z-index: 10; display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
        </div>
        <div style="position: absolute; bottom: -14px; background: #1E40AF; color: white; font-size: 8px; font-weight: 900; padding: 2px 6px; border-radius: 6px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.8); letter-spacing: 0.5px;">
          LOKASI KAMU
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'user-gps-pin',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  };

  if (!mounted || !L) {
    return (
      <div className="relative bg-[#D4E8D8] rounded-[28px] border border-[#1C4D38]/10 overflow-hidden shadow-xs h-[320px] sm:h-[340px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-black text-[#1C4D38] bg-white/90 px-4 py-2 rounded-2xl shadow-sm">
          <MapPin className="w-4 h-4 text-[#1C4D38] animate-bounce" />
          <span>Memuat Peta Interaktif Surabaya...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#D4E8D8] rounded-[28px] border border-[#1C4D38]/10 overflow-hidden shadow-xs h-[320px] sm:h-[340px] z-0">
      
      {/* Explicit Popup Style Override for High Contrast Pure White Popup */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: #FFFFFF !important;
          color: #1C4D38 !important;
          border-radius: 18px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25) !important;
          padding: 6px 12px !important;
          border: 2px solid #1C4D38 !important;
        }
        .leaflet-popup-tip {
          background: #FFFFFF !important;
          border: 2px solid #1C4D38 !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #1C4D38 !important;
          font-weight: 900 !important;
          padding: 8px !important;
          font-size: 16px !important;
        }
      `}</style>

      {/* Real OpenStreetMap Container with Clean Light Tile Layer */}
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full z-0 bg-[#D4E8D8]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recenter Map Handler */}
        <MapRecenterHandler lat={targetLat} lng={targetLng} />

        {/* User GPS Location Marker */}
        {userCoords && (
          <Marker
            position={[userCoords.lat, userCoords.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-1 text-center font-sans min-w-[150px]">
                <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-black rounded-full uppercase">
                  Titik Posisimu
                </div>
                <h4 className="text-xs font-black text-[#1C4D38]">
                  {userCoords.name || 'Lokasi Kamu Saat Ini'}
                </h4>
                <p className="text-[10px] text-gray-700">
                  {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Map Markers for each Bank Sampah */}
        {showAreaOnly &&
          bankSampahList.map((item) => {
            const lat = item.lat || -7.2825;
            const lng = item.lng || 112.7944;
            const isSelected = selectedBank.id === item.id;
            const customIcon = createCustomIcon(isSelected, item.name);

            return (
              <Marker
                key={item.id}
                position={[lat, lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => onSelectBank(item),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-1.5 text-center font-sans min-w-[160px]">
                    <h4 className="text-xs font-black text-[#1C4D38] font-display border-b border-gray-100 pb-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-gray-800 font-bold leading-tight">{item.address}</p>
                    <p className="text-[11px] font-black text-[#E07A5F] pt-0.5">
                      📍 {item.distance} ({item.timeEstimate})
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Floating Checkbox: "Tampilkan area ini" Top Right */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-extrabold text-[#1C4D38] shadow-md flex items-center gap-2 z-[400]">
        <input
          type="checkbox"
          checked={showAreaOnly}
          onChange={(e) => setShowAreaOnly(e.target.checked)}
          className="w-3.5 h-3.5 accent-[#1C4D38] cursor-pointer"
        />
        <span>Tampilkan area ini</span>
      </div>

      {/* Bottom Left Map Controls: Fokus Mitra & Fokus Lokasi Saya */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-[400]">
        <button
          type="button"
          onClick={() => {
            if (selectedBank.lat && selectedBank.lng) {
              setTargetLat(selectedBank.lat);
              setTargetLng(selectedBank.lng);
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md hover:bg-white text-[#1C4D38] text-xs font-extrabold rounded-2xl border border-gray-200 shadow-md transition active:scale-95 cursor-pointer"
          title="Fokus ke Mitra Terpilih"
        >
          <Crosshair className="w-3.5 h-3.5 text-[#1C4D38]" />
          <span>Fokus Mitra</span>
        </button>

        {userCoords && (
          <button
            type="button"
            onClick={() => {
              setTargetLat(userCoords.lat);
              setTargetLng(userCoords.lng);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
            title="Fokus ke Lokasi GPS Kamu"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Lokasi Saya</span>
          </button>
        )}
      </div>

    </div>
  );
}
