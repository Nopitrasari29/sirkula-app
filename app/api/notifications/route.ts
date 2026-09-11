import { NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import { verifyJwtToken } from '@/lib/utils/auth';

const FALLBACK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Penjemputan Sampah Dikonfirmasi',
    message: 'Pak Bambang (Mitra Pengepul) akan tiba di Kos Wisma Ganesha dalam 15 menit.',
    category: 'Booking',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Poin Daur Ulang Masuk!',
    message: 'Selamat! Kamu mendapatkan +60 Poin Sirkula dari pemilahan sampah kardus kos.',
    category: 'Poin',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'Tips Pilah Baru',
    message: 'Ketahui cara memilah kemasan tetra pak dan sachet kopi agar laku di bank sampah.',
    category: 'Edukasi',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

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
        const notifications = await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 30,
        });

        return NextResponse.json({
          success: true,
          data: notifications,
        });
      } catch (dbError) {
        console.warn('Database error fetching notifications:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      data: FALLBACK_NOTIFICATIONS,
    });
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil notifikasi' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead } = body;

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
        if (markAllRead) {
          await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
          });
        } else if (notificationId) {
          await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Status notifikasi berhasil diperbarui',
        });
      } catch (dbError) {
        console.warn('Database error updating notification:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status notifikasi berhasil diperbarui (mode offline)',
    });
  } catch (error) {
    console.error('Error in PATCH /api/notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui notifikasi' },
      { status: 500 }
    );
  }
}
