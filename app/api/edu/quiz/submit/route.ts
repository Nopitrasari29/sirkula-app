import { NextResponse } from 'next/server';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';
import { verifyJwtToken } from '@/lib/utils/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizTopic, score, totalQuestions = 5 } = body;

    if (!quizTopic || score === undefined) {
      return NextResponse.json(
        { success: false, message: 'Topik kuis dan skor wajib disertakan.' },
        { status: 400 }
      );
    }

    const calculatedPoints = Math.round((score / totalQuestions) * 50);

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
        const submission = await prisma.quizSubmission.create({
          data: {
            userId,
            quizTopic,
            score: Number(score),
            pointsAdded: calculatedPoints,
          },
        });

        // Award points to user profile
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            points: { increment: calculatedPoints },
          },
          select: {
            id: true,
            fullName: true,
            points: true,
            level: true,
          },
        });

        // Add a notification about the earned points
        await prisma.notification.create({
          data: {
            userId,
            title: `Kuis ${quizTopic} Selesai!`,
            message: `Kamu mendapatkan +${calculatedPoints} Poin Sirkula dari kuis edukasi.`,
            category: 'Edukasi',
          },
        });

        return NextResponse.json({
          success: true,
          message: `Selamat! Kamu mendapatkan +${calculatedPoints} Poin Sirkula!`,
          data: {
            submissionId: submission.id,
            pointsAdded: calculatedPoints,
            user: updatedUser,
          },
        });
      } catch (dbError) {
        console.warn('Database error recording quiz submission:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Selamat! Kamu mendapatkan +${calculatedPoints} Poin Sirkula! (Mode Fallback)`,
      data: {
        pointsAdded: calculatedPoints,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/edu/quiz/submit:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses hasil kuis.' },
      { status: 500 }
    );
  }
}
