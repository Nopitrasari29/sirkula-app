import { NextResponse } from 'next/server';
import { extractBearerToken, verifyJwtToken } from '@/lib/utils/auth';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || request.headers.get('Cookie');
    const token = extractBearerToken(authHeader);

    let userId: string | null = null;
    if (token) {
      const payload = await verifyJwtToken(token);
      if (payload) userId = payload.userId;
    }

    if (isDatabaseConfigured() && userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            scans: {
              orderBy: { createdAt: 'desc' },
              take: 20,
            },
            bookings: {
              where: { status: 'COMPLETED' },
            },
          },
        });

        if (user) {
          const totalRecycled = user.totalRecycledKg;
          const co2Saved = user.co2SavedKg;
          const treesEquivalent = parseFloat((co2Saved * 0.05).toFixed(1));

          return NextResponse.json({
            success: true,
            stats: {
              points: user.points,
              level: user.level,
              totalRecycledKg: totalRecycled,
              co2SavedKg: co2Saved,
              treesSaved: treesEquivalent,
              totalBookings: user.bookings.length,
              totalScans: user.scans.length,
            },
          });
        }
      } catch (dbError) {
        console.warn('Database error in stats API:', dbError);
      }
    }

    // Default simulated stats for current user
    return NextResponse.json({
      success: true,
      stats: {
        points: 126,
        level: 3,
        totalRecycledKg: 14.5,
        co2SavedKg: 28.2,
        treesSaved: 1.4,
        totalBookings: 6,
        totalScans: 18,
      },
    });
  } catch (error) {
    console.error('Error in /api/user/stats:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat statistik pengguna.' },
      { status: 500 }
    );
  }
}
