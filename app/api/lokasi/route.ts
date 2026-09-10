import { NextResponse } from 'next/server';
import { MOCK_BANK_SAMPAH_LOCATIONS } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_BANK_SAMPAH_LOCATIONS,
  });
}
