import { NextResponse } from 'next/server';
import { MOCK_SCAN_DATABASE } from '@/lib/data/mockData';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import { extractBearerToken, verifyJwtToken } from '@/lib/utils/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageType, imageUrl, itemName, category, estimatedWeightKg } = body;

    const authHeader = request.headers.get('Authorization') || request.headers.get('Cookie');
    const token = extractBearerToken(authHeader);

    let userId: string | null = null;
    if (token) {
      const payload = await verifyJwtToken(token);
      if (payload) userId = payload.userId;
    }

    // Determine result based on preset key or body
    let result = { ...MOCK_SCAN_DATABASE.botol_pet };
    if (imageType === 'kardus' || category === 'Kertas & Kardus') {
      result = { ...MOCK_SCAN_DATABASE.kardus_bekas };
    } else if (imageType === 'kaleng' || category === 'Logam & Kaleng') {
      result = { ...MOCK_SCAN_DATABASE.kaleng_minuman };
    }

    if (itemName) result.itemName = itemName;
    if (imageUrl) result.imageUrl = imageUrl;

    const weight = parseFloat(estimatedWeightKg) || result.estimatedWeightKg || 0.4;
    const points = Math.round(weight * 100);
    const co2 = parseFloat((weight * 1.5).toFixed(2));
    result.earnedPoints = points;
    result.co2SavedKg = co2;

    // If database configured, record scan in DB and increment user points & stats
    if (isDatabaseConfigured() && userId && !userId.startsWith('demo') && !userId.startsWith('guest')) {
      try {
        const dbScan = await prisma.wasteScan.create({
          data: {
            userId,
            categoryLabel: result.category || 'Plastik PET',
            itemName: result.itemName || 'Botol Plastik PET',
            confidence: result.confidence || 0.95,
            recycleability: result.recycleability || 'Tinggi',
            estimatedPricePerKg: result.estimatedPricePerKg || 3500,
            estimatedWeightKg: weight,
            earnedPoints: points,
            co2SavedKg: co2,
            imageUrl: imageUrl || '',
            sortingTips: result.instructions || [],
          },
        });

        // Update user stats
        await prisma.user.update({
          where: { id: userId },
          data: {
            points: { increment: points },
            totalRecycledKg: { increment: weight },
            co2SavedKg: { increment: co2 },
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            ...result,
            id: dbScan.id,
          },
          message: 'Pemindaian sampah dengan AI berhasil dicatat!',
        });
      } catch (dbError) {
        console.warn('Database error in POST /api/scanner, falling back:', dbError);
      }
    }

    // Fallback response
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        id: `SCAN-2026-${Date.now()}`,
      },
      message: 'Pemindaian sampah dengan AI berhasil!',
    });
  } catch (error) {
    console.error('Error in POST /api/scanner:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses pemindaian sampah' },
      { status: 500 }
    );
  }
}
