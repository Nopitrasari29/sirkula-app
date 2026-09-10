import { NextResponse } from 'next/server';
import { MOCK_SCAN_DATABASE } from '@/lib/data/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageType } = body;

    // Simulate AI processing delay (1.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Determine result based on preset key or default to botol_pet
    let result = MOCK_SCAN_DATABASE.botol_pet;
    if (imageType === 'kardus') {
      result = MOCK_SCAN_DATABASE.kardus_bekas;
    } else if (imageType === 'kaleng') {
      result = MOCK_SCAN_DATABASE.kaleng_minuman;
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Pemindaian sampah dengan AI berhasil!',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Gagal memproses pemindaian' },
      { status: 500 }
    );
  }
}
