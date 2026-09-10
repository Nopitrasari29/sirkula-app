'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Crosshair } from 'lucide-react';

export interface DropPointLocation {
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

interface DropPointLeafletMapProps {
  dropPoints: DropPointLocation[];
  activeDropPoint: DropPointLocation;
  onSelectPoint: (point: DropPointLocation) => void;
  userCoords?: { lat: number; lng: number; name?: string };
}

function MapFlyToHandler({ lat, lng }: { lat: number; lng: number }) {
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

export default function DropPointLeafletMap({
  dropPoints,
  activeDropPoint,
  onSelectPoint,
  userCoords,
}: DropPointLeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leafletMod) => {
      setL(leafletMod.default || leafletMod);
    });
  }, []);

  const [targetLat, setTargetLat] = useState(activeDropPoint?.lat || -7.2840);
  const [targetLng, setTargetLng] = useState(activeDropPoint?.lng || 112.7915);

  useEffect(() => {
    if (activeDropPoint?.lat && activeDropPoint?.lng) {
      setTargetLat(activeDropPoint.lat);
      setTargetLng(activeDropPoint.lng);
    }
  }, [activeDropPoint?.id, activeDropPoint?.lat, activeDropPoint?.lng]);

  const defaultLat = activeDropPoint?.lat || -7.2840;
  const defaultLng = activeDropPoint?.lng || 112.7915;

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

  const createDropPointIcon = (isSelected: boolean, category: string, name: string) => {
    if (!L) return undefined;

    let bgColor = '#1C4D38';
    if (category === 'TPS3R Terdekat') bgColor = '#E07A5F';
    else if (category === 'Kompos Kampus') bgColor = '#2A7B54';
    else if (category === 'Bank Sampah Mitra') bgColor = '#235D43';

    const size = isSelected ? 36 : 28;
    const shortName = name.split('—')[0].trim();

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
              ">${shortName}</div>`
            : ''
        }
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${bgColor};
          border: 3px solid #FFFFFF;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="${bgColor}"></circle>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: 'custom-droppoint-pin',
      iconSize: [size, size + (isSelected ? 26 : 0)],
      iconAnchor: [size / 2, size + (isSelected ? 26 : 0)],
    });
  };

  if (!mounted || !L) {
    return (
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#E8F0EA] border border-[#1C4D38]/15 overflow-hidden flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-black text-[#1C4D38] bg-white/90 px-4 py-2 rounded-2xl shadow-sm">
          <MapPin className="w-4 h-4 text-[#1C4D38] animate-bounce" />
          <span>Memuat Peta Drop-off Surabaya...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#E8F0EA] border border-[#1C4D38]/15 overflow-hidden shadow-inner z-0">
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
      `}</style>

      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full z-0 bg-[#E8F0EA]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFlyToHandler lat={targetLat} lng={targetLng} />

        {/* User GPS Location Marker */}
        {userCoords && (
          <Marker
            position={[userCoords.lat, userCoords.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup>
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

        {dropPoints.map((pt) => {
          const isSelected = activeDropPoint?.id === pt.id;
          const customIcon = createDropPointIcon(isSelected, pt.category, pt.name);

          return (
            <Marker
              key={pt.id}
              position={[pt.lat, pt.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setTargetLat(pt.lat);
                  setTargetLng(pt.lng);
                  onSelectPoint(pt);
                },
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-center font-sans min-w-[160px]">
                  <span className="text-[9px] font-black uppercase text-[#1C4D38]/70">
                    {pt.category}
                  </span>
                  <h4 className="text-xs font-black text-[#1C4D38]">
                    {pt.name}
                  </h4>
                  <p className="text-[10px] text-gray-700 font-medium">{pt.address}</p>
                  <p className="text-[11px] font-black text-[#E07A5F]">
                    📍 {pt.distance} • {pt.hours}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Recenter / Focus Controls */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-[400]">
        <button
          type="button"
          onClick={() => {
            if (activeDropPoint) {
              setTargetLat(activeDropPoint.lat);
              setTargetLng(activeDropPoint.lng);
              onSelectPoint(activeDropPoint);
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md hover:bg-white text-[#1C4D38] text-xs font-black rounded-xl border border-[#1C4D38]/15 shadow-sm transition active:scale-95 cursor-pointer"
          title="Fokus Titik Terpilih"
        >
          <Crosshair className="w-3.5 h-3.5 text-[#1C4D38]" />
          <span>Fokus Titik</span>
        </button>

        {userCoords && (
          <button
            type="button"
            onClick={() => {
              setTargetLat(userCoords.lat);
              setTargetLng(userCoords.lng);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer"
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
