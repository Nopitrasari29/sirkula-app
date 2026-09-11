import { NextResponse } from 'next/server';
import { MOCK_BANK_SAMPAH_LOCATIONS } from '@/lib/data/mockData';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campus = searchParams.get('campus');
    const category = searchParams.get('category');
    const userLat = parseFloat(searchParams.get('lat') || '');
    const userLng = parseFloat(searchParams.get('lng') || '');

    if (isDatabaseConfigured()) {
      try {
        const whereClause: any = {};
        if (campus) whereClause.campusRegion = campus;
        if (category && category !== 'Semua') whereClause.category = category;

        const points = await prisma.dropPoint.findMany({
          where: whereClause,
          orderBy: { rating: 'desc' },
        });

        if (points.length > 0) {
          const mapped = points.map((p) => {
            let distanceKm: number | undefined = undefined;
            if (!isNaN(userLat) && !isNaN(userLng)) {
              distanceKm = calculateDistanceKm(userLat, userLng, p.latitude, p.longitude);
            }

            return {
              id: p.id,
              name: p.name,
              category: p.category,
              address: p.address,
              campusRegion: p.campusRegion,
              latitude: p.latitude,
              longitude: p.longitude,
              lat: p.latitude,
              lng: p.longitude,
              phone: p.phone,
              operatingHours: p.operatingHours,
              acceptedCategories: p.acceptedCategories,
              rating: p.rating,
              distanceKm: distanceKm ? parseFloat(distanceKm.toFixed(1)) : undefined,
            };
          });

          if (!isNaN(userLat) && !isNaN(userLng)) {
            mapped.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
          }

          return NextResponse.json({
            success: true,
            data: mapped,
            total: mapped.length,
          });
        }
      } catch (dbError) {
        console.warn('Database error in GET /api/lokasi, falling back:', dbError);
      }
    }

    // Fallback using MOCK_BANK_SAMPAH_LOCATIONS
    let filtered = [...MOCK_BANK_SAMPAH_LOCATIONS];
    if (campus && campus !== 'Semua') {
      const q = campus.toLowerCase();
      filtered = filtered.filter((loc) =>
        loc.campusRegion?.toLowerCase().includes(q) ||
        loc.address?.toLowerCase().includes(q) ||
        loc.name?.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'Semua') {
      filtered = filtered.filter((loc) => loc.category === category);
    }

    if (!isNaN(userLat) && !isNaN(userLng)) {
      filtered = filtered.map((loc) => ({
        ...loc,
        distanceKm: parseFloat(calculateDistanceKm(userLat, userLng, loc.latitude, loc.longitude).toFixed(1)),
      }));
      filtered.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error in GET /api/lokasi:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat data lokasi' },
      { status: 500 }
    );
  }
}

// Haversine formula to compute great-circle distance between two points in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
