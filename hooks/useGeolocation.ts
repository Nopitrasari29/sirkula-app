'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GeoCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  name?: string;
}

// Default fallback to Sukolilo, Surabaya (Kampus ITS student area)
export const DEFAULT_SURABAYA_COORDS: GeoCoordinates = {
  lat: -7.2825,
  lng: 112.7944,
  name: 'Sukolilo, Surabaya (Default)',
};

export const GPS_STORAGE_KEY = 'sirkula_user_gps_coords';
export const GPS_PERMISSION_KEY = 'sirkula_gps_permission_asked';

/**
 * Haversine formula to compute distance between two coordinates in kilometers
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

/**
 * Helper to estimate travel duration in minutes based on distance
 */
export function estimateTravelTime(distanceKm: number): string {
  if (distanceKm <= 0.5) return '2-3 menit (jalan)';
  if (distanceKm <= 1.5) return `${Math.round(distanceKm * 4 + 2)} menit`;
  if (distanceKm <= 5.0) return `${Math.round(distanceKm * 3 + 3)} menit`;
  return `${Math.round(distanceKm * 2.5 + 5)} menit`;
}

/**
 * Fast reverse geocoding to human-readable district/city via Nominatim OpenStreetMap with BigDataCloud fallback
 */
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<string> {
  // 1. Primary: Nominatim OpenStreetMap
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'id' },
      }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      const district = addr?.suburb || addr?.village || addr?.city_district || addr?.county;
      const city = addr?.city || addr?.town || addr?.regency || addr?.state;
      if (district && city) return `${district}, ${city}`;
      if (city) return city;
      if (data.display_name) {
        return data.display_name.split(',').slice(0, 2).join(', ');
      }
    }
  } catch (e) {}

  // 2. Secondary Fallback: BigDataCloud Client Reverse Geocode API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      const locality = data.locality || data.city;
      const admin = data.principalSubdivision;
      if (locality && admin) return `${locality}, ${admin}`;
      if (locality) return locality;
      if (admin) return admin;
    }
  } catch (e) {}

  return `Lokasi GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}

/**
 * Dynamically adapts bank sampah / drop points to user's real or selected location.
 * Replaces hardcoded Sukolilo landmark names and addresses with the user's localized district and city,
 * and realistically projects local markers around the user's coordinates on the map.
 */
export function adaptLocationsToUser<
  T extends { lat?: number; lng?: number; address?: string; name: string; description?: string }
>(items: T[], userCoords: GeoCoordinates): T[] {
  // If userCoords is literally the default Sukolilo mock coordinates with no active GPS
  const isDefaultSukolilo =
    (!userCoords.accuracy && userCoords.name?.includes('(Default)')) ||
    (Math.abs(userCoords.lat - DEFAULT_SURABAYA_COORDS.lat) < 0.001 &&
      Math.abs(userCoords.lng - DEFAULT_SURABAYA_COORDS.lng) < 0.001 &&
      !userCoords.name?.includes('Real-Time') &&
      !userCoords.name?.includes('GPS'));

  if (isDefaultSukolilo) {
    return items;
  }

  const cleanAreaName = userCoords.name
    ? userCoords.name.replace(' (GPS Real-Time)', '').replace(' (Default)', '').replace(' (Simulasi)', '').trim()
    : 'Wilayah Sekitar';

  const cleanDistrict = cleanAreaName.split(',')[0].trim();

  // Realistic neighborhood offsets in ~0.5km - 2.8km radius
  const OFFSETS = [
    { dLat: 0.0055, dLng: 0.0042 },
    { dLat: -0.0072, dLng: 0.0068 },
    { dLat: 0.0115, dLng: -0.0079 },
    { dLat: -0.0048, dLng: -0.0102 },
    { dLat: 0.0168, dLng: 0.0121 },
    { dLat: -0.0135, dLng: 0.0146 },
  ];

  return items.map((item, idx) => {
    const offset = OFFSETS[idx % OFFSETS.length];
    const newLat = Number((userCoords.lat + offset.dLat).toFixed(5));
    const newLng = Number((userCoords.lng + offset.dLng).toFixed(5));

    // Localize address: replace 'Sukolilo, Surabaya' or 'Sukolilo' with cleanAreaName
    let localizedAddress = item.address || '';
    if (localizedAddress.toLowerCase().includes('sukolilo')) {
      localizedAddress = localizedAddress.replace(/,\s*Sukolilo,\s*Surabaya/gi, `, ${cleanAreaName}`);
      localizedAddress = localizedAddress.replace(/Sukolilo,\s*Surabaya/gi, cleanAreaName);
      localizedAddress = localizedAddress.replace(/Sukolilo/gi, cleanDistrict);
    } else if (item.address) {
      const streetPart = item.address.split(',')[0];
      localizedAddress = `${streetPart}, ${cleanAreaName}`;
    } else {
      localizedAddress = `${item.name}, ${cleanAreaName}`;
    }

    // Localize name: replace 'Sukolilo' in name with cleanDistrict
    let localizedName = item.name;
    if (localizedName.toLowerCase().includes('sukolilo')) {
      localizedName = localizedName.replace(/Sukolilo/gi, cleanDistrict);
    }

    // Localize description if present
    let localizedDesc = item.description;
    if (localizedDesc && localizedDesc.toLowerCase().includes('sukolilo')) {
      localizedDesc = localizedDesc.replace(/warga Sukolilo & Keputih/gi, `warga ${cleanDistrict} & sekitarnya`);
      localizedDesc = localizedDesc.replace(/Sukolilo/gi, cleanDistrict);
    }

    return {
      ...item,
      name: localizedName,
      lat: newLat,
      lng: newLng,
      address: localizedAddress,
      ...(localizedDesc !== undefined ? { description: localizedDesc } : {}),
    };
  });
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeoCoordinates | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state from localStorage
  const syncFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(GPS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
            setCoords(parsed);
            setIsGpsActive(true);
            return;
          }
        }
      } catch (e) {}
    }
  }, []);

  // Initialize and listen for storage & custom locationChange events
  useEffect(() => {
    syncFromStorage();
    const handleLocationUpdate = () => syncFromStorage();
    window.addEventListener('storage', handleLocationUpdate);
    window.addEventListener('sirkula:locationChange', handleLocationUpdate);
    return () => {
      window.removeEventListener('storage', handleLocationUpdate);
      window.removeEventListener('sirkula:locationChange', handleLocationUpdate);
    };
  }, [syncFromStorage]);

  /**
   * Trigger real browser GPS geolocation
   */
  const requestGpsLocation = useCallback(async (): Promise<GeoCoordinates | null> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        setErrorMsg('Fitur Geolocation tidak didukung di peramban ini.');
        resolve(null);
        return;
      }

      setIsDetecting(true);
      setErrorMsg(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = Number(position.coords.latitude.toFixed(5));
          const lng = Number(position.coords.longitude.toFixed(5));
          const accuracy = position.coords.accuracy;

          // Attempt fast reverse geocode for actual city/suburb name
          const areaName = await reverseGeocodeCoords(lat, lng);

          const newCoords: GeoCoordinates = {
            lat,
            lng,
            accuracy,
            name: `${areaName} (GPS Real-Time)`,
          };

          setCoords(newCoords);
          setIsGpsActive(true);
          setIsDetecting(false);

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(GPS_STORAGE_KEY, JSON.stringify(newCoords));
              localStorage.setItem(GPS_PERMISSION_KEY, 'true');
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(
                new CustomEvent('sirkula:locationChange', { detail: newCoords })
              );
            } catch (e) {}
          }

          resolve(newCoords);
        },
        (error) => {
          setIsDetecting(false);
          let message = 'Gagal mengakses GPS perangkat.';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Izin lokasi ditolak oleh peramban. Menggunakan lokasi default Sukolilo, Surabaya.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Informasi lokasi perangkat tidak tersedia saat ini.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Permintaan lokasi GPS melebihi batas waktu (timeout).';
          }
          setErrorMsg(message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  /**
   * Set simulated / predefined student area location
   */
  const setSimulatedLocation = useCallback((custom: GeoCoordinates) => {
    setCoords(custom);
    setIsGpsActive(true);
    setErrorMsg(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GPS_STORAGE_KEY, JSON.stringify(custom));
        localStorage.setItem(GPS_PERMISSION_KEY, 'true');
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(
          new CustomEvent('sirkula:locationChange', { detail: custom })
        );
      } catch (e) {}
    }
  }, []);

  /**
   * Reset to default Sukolilo
   */
  const resetToDefault = useCallback(() => {
    setCoords(null);
    setIsGpsActive(false);
    setErrorMsg(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(GPS_STORAGE_KEY);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(
          new CustomEvent('sirkula:locationChange', { detail: DEFAULT_SURABAYA_COORDS })
        );
      } catch (e) {}
    }
  }, []);

  /**
   * Calculate distance from active coordinates (or default Sukolilo) to a target point
   */
  const getDistanceTo = useCallback(
    (targetLat: number, targetLng: number) => {
      const current = coords || DEFAULT_SURABAYA_COORDS;
      const km = calculateDistanceKm(current.lat, current.lng, targetLat, targetLng);
      return {
        km,
        formatted: `${km.toString().replace('.', ',')} km`,
        timeEstimate: estimateTravelTime(km),
      };
    },
    [coords]
  );

  return {
    coords: coords || DEFAULT_SURABAYA_COORDS,
    isRealGps: isGpsActive && !!coords,
    isDetecting,
    errorMsg,
    requestGpsLocation,
    setSimulatedLocation,
    resetToDefault,
    getDistanceTo,
  };
}
