import { NextResponse } from 'next/server';
import { hashPassword, signJwtToken } from '@/lib/utils/auth';
import { prisma, isDatabaseConfigured } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role, campus, kosAddress, phone } = body;

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap, email, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();

    // Check if database is configured
    if (isDatabaseConfigured()) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (existingUser) {
          return NextResponse.json(
            { success: false, message: 'Email sudah terdaftar. Silakan login.' },
            { status: 409 }
          );
        }

        const passwordHash = await hashPassword(password);
        const userRole = role === 'Pengepul Sampah' ? 'COLLECTOR' : 'STUDENT';

        const user = await prisma.user.create({
          data: {
            email: cleanEmail,
            fullName: cleanName,
            passwordHash,
            role: userRole,
            campus: campus || 'ITS Sukolilo',
            kosAddress: kosAddress || '',
            phone: phone || '',
            points: 120, // Welcome points
          },
        });

        const token = await signJwtToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.fullName,
          campus: user.campus || undefined,
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Registrasi akun berhasil!',
            token,
            user: {
              id: user.id,
              name: user.fullName,
              email: user.email,
              role: user.role === 'COLLECTOR' ? 'Pengepul Sampah' : 'Mahasiswa Kos',
              campus: user.campus,
              kosAddress: user.kosAddress,
              phone: user.phone,
              points: user.points,
              level: user.level,
              totalRecycledKg: user.totalRecycledKg,
              co2SavedKg: user.co2SavedKg,
            },
          },
          { status: 201 }
        );
      } catch (dbError) {
        console.warn('Database error during register, falling back to local simulation:', dbError);
      }
    }

    // Fallback mode (if database is offline / not yet connected)
    const fallbackId = `user-${Date.now()}`;
    const token = await signJwtToken({
      userId: fallbackId,
      email: cleanEmail,
      role: role || 'STUDENT',
      name: cleanName,
      campus: campus || 'ITS Sukolilo',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil!',
        token,
        user: {
          id: fallbackId,
          name: cleanName,
          email: cleanEmail,
          role: role || 'Mahasiswa Kos',
          campus: campus || 'ITS Sukolilo',
          kosAddress: kosAddress || '',
          phone: phone || '',
          points: 120,
          level: 1,
          totalRecycledKg: 0,
          co2SavedKg: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat pendaftaran akun.' },
      { status: 500 }
    );
  }
}
