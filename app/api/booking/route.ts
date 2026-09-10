import { NextResponse } from 'next/server';
import { INITIAL_BOOKINGS } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_BOOKINGS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simulate API network latency (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newBooking = {
      id: `BOOK-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleString('id-ID'),
      status: 'Dibuat',
      ...body,
    };

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: 'Booking penjemputan sampah berhasil dikirim!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal membuat booking' },
      { status: 500 }
    );
  }
}
