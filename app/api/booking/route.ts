import { NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import { extractBearerToken, verifyJwtToken } from '@/lib/utils/auth';
import { INITIAL_BOOKINGS } from '@/lib/data/mockData';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('Cookie');
    const token = extractBearerToken(authHeader);

    let userId: string | null = null;
    if (token) {
      const payload = await verifyJwtToken(token);
      if (payload) userId = payload.userId;
    }

    if (isDatabaseConfigured()) {
      try {
        const whereClause = userId ? { userId } : {};
        const bookings = await prisma.booking.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { fullName: true, phone: true },
            },
            collector: {
              select: { fullName: true, phone: true },
            },
          },
        });

        if (bookings.length > 0) {
          const formatted = bookings.map((b) => ({
            id: b.bookingCode,
            userId: b.userId,
            userName: b.user.fullName,
            userPhone: b.user.phone || '',
            userAddress: b.userAddress,
            wasteType: b.wasteType,
            wasteCategories: b.wasteCategories,
            estimatedWeightKg: b.estimatedWeightKg,
            pickupDate: b.pickupDate,
            pickupTime: b.pickupTime,
            notes: b.notes || '',
            status: mapStatusToIndonesian(b.status),
            collectorName: b.collector?.fullName || 'Pak Joko (Mitra Pengepul)',
            collectorPhone: b.collector?.phone || '0812-9876-5432',
            pointsEarned: b.pointsEarned,
            resaleValue: b.resaleValue,
            createdAt: b.createdAt.toISOString(),
          }));

          return NextResponse.json({
            success: true,
            data: formatted,
          });
        }
      } catch (dbError) {
        console.warn('Database error in GET /api/booking, falling back:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: INITIAL_BOOKINGS,
    });
  } catch (error) {
    console.error('Error in GET /api/booking:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data booking' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      wasteType,
      wasteCategories = [],
      estimatedWeightKg = 1.0,
      pickupDate,
      pickupTime,
      userAddress,
      addressDetail,
      notes,
    } = body;

    const authHeader = request.headers.get('Authorization') || request.headers.get('Cookie');
    const token = extractBearerToken(authHeader);

    let userId = 'guest-user';
    if (token) {
      const payload = await verifyJwtToken(token);
      if (payload) userId = payload.userId;
    }

    const bookingCode = `BOOK-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (isDatabaseConfigured() && userId && !userId.startsWith('guest')) {
      try {
        const newDbBooking = await prisma.booking.create({
          data: {
            bookingCode,
            userId,
            wasteType: wasteType || 'Campuran Daur Ulang',
            wasteCategories: Array.isArray(wasteCategories) ? wasteCategories : [wasteType],
            estimatedWeightKg: parseFloat(estimatedWeightKg) || 1.0,
            pickupDate: pickupDate || new Date().toISOString().split('T')[0],
            pickupTime: pickupTime || '10:00 - 12:00',
            userAddress: userAddress || 'Jl. Raya ITS, Sukolilo, Surabaya',
            addressDetail: addressDetail || '',
            notes: notes || '',
            status: 'CREATED',
            pointsEarned: Math.round((parseFloat(estimatedWeightKg) || 1.0) * 50),
            resaleValue: Math.round((parseFloat(estimatedWeightKg) || 1.0) * 3500),
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            id: newDbBooking.bookingCode,
            ...body,
            status: 'Dibuat',
            createdAt: newDbBooking.createdAt.toISOString(),
          },
          message: 'Booking penjemputan sampah berhasil dikirim!',
        });
      } catch (dbError) {
        console.warn('Database error in POST /api/booking, falling back:', dbError);
      }
    }

    // Fallback mode
    const newBooking = {
      id: bookingCode,
      createdAt: new Date().toLocaleString('id-ID'),
      status: 'Dibuat',
      collectorName: 'Pak Joko (Mitra Pengepul ITS)',
      collectorPhone: '0812-9876-5432',
      pointsEarned: Math.round((parseFloat(estimatedWeightKg) || 1.0) * 50),
      resaleValue: Math.round((parseFloat(estimatedWeightKg) || 1.0) * 3500),
      ...body,
    };

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking penjemputan sampah berhasil dikirim!',
    });
  } catch (error) {
    console.error('Error in POST /api/booking:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal membuat booking penjemputan' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID booking dan status wajib disertakan.' },
        { status: 400 }
      );
    }

    if (isDatabaseConfigured()) {
      try {
        const updated = await prisma.booking.update({
          where: { bookingCode: id },
          data: { status: mapStatusToPrismaEnum(status) },
        });

        return NextResponse.json({
          success: true,
          data: updated,
          message: `Status booking berhasil diperbarui menjadi ${status}`,
        });
      } catch (dbError) {
        console.warn('Database error in PATCH /api/booking, falling back:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Status booking ${id} berhasil diperbarui menjadi ${status}`,
      data: { id, status },
    });
  } catch (error) {
    console.error('Error in PATCH /api/booking:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status booking' },
      { status: 500 }
    );
  }
}

function mapStatusToIndonesian(status: string): string {
  switch (status) {
    case 'CREATED':
      return 'Dibuat';
    case 'CONFIRMED':
      return 'Dikonfirmasi';
    case 'EN_ROUTE':
      return 'Pengepul Menuju Kos';
    case 'COMPLETED':
      return 'Selesai';
    case 'CANCELLED':
      return 'Dibatalkan';
    default:
      return status;
  }
}

function mapStatusToPrismaEnum(status: string): any {
  switch (status.toLowerCase()) {
    case 'dibuat':
      return 'CREATED';
    case 'dikonfirmasi':
      return 'CONFIRMED';
    case 'pengepul menuju kos':
    case 'en_route':
      return 'EN_ROUTE';
    case 'selesai':
      return 'COMPLETED';
    case 'dibatalkan':
      return 'CANCELLED';
    default:
      return 'CREATED';
  }
}
