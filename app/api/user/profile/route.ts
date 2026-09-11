import { NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import { verifyJwtToken } from '@/lib/utils/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifyJwtToken(token);
      if (payload) {
        userId = payload.userId as string;
      }
    }

    if (isDatabaseConfigured() && userId && !userId.startsWith('demo-')) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            campus: true,
            kosAddress: true,
            phone: true,
            avatarUrl: true,
            points: true,
            level: true,
            totalRecycledKg: true,
            co2SavedKg: true,
            createdAt: true,
          },
        });

        if (user) {
          return NextResponse.json({
            success: true,
            data: user,
          });
        }
      } catch (dbError) {
        console.warn('Database error fetching user profile:', dbError);
      }
    }

    // Default fallback demo profile
    return NextResponse.json({
      success: true,
      data: {
        id: 'demo-fika',
        email: 'fika@sirkula.id',
        fullName: 'Rafika Az Zahra',
        role: 'STUDENT',
        campus: 'ITS Sukolilo',
        kosAddress: 'Jl. Gebang Wetan No. 12, Sukolilo, Surabaya',
        phone: '081234567890',
        points: 126,
        level: 2,
        totalRecycledKg: 14.5,
        co2SavedKg: 28.2,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/user/profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil profil pengguna' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { fullName, campus, kosAddress, phone, avatarUrl } = body;

    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifyJwtToken(token);
      if (payload) {
        userId = payload.userId as string;
      }
    }

    if (isDatabaseConfigured() && userId && !userId.startsWith('demo-')) {
      try {
        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            ...(fullName && { fullName: fullName.trim() }),
            ...(campus && { campus: campus.trim() }),
            ...(kosAddress !== undefined && { kosAddress: kosAddress.trim() }),
            ...(phone !== undefined && { phone: phone.trim() }),
            ...(avatarUrl !== undefined && { avatarUrl }),
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            campus: true,
            kosAddress: true,
            phone: true,
            avatarUrl: true,
            points: true,
            level: true,
            totalRecycledKg: true,
            co2SavedKg: true,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Profil berhasil diperbarui!',
          data: updated,
        });
      } catch (dbError) {
        console.warn('Database error updating user profile:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui (mode offline)',
      data: {
        fullName,
        campus,
        kosAddress,
        phone,
      },
    });
  } catch (error) {
    console.error('Error in PATCH /api/user/profile:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui profil pengguna' },
      { status: 500 }
    );
  }
}
