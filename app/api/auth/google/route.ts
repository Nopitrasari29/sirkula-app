import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/db/prisma';

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export async function POST(request: NextRequest) {
    try {
        const { credential } = await request.json();

        if (!credential) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Google credential tidak ditemukan.',
                },
                { status: 400 }
            );
        }

        // Verifikasi ID Token dari Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Data Google tidak valid.',
                },
                { status: 401 }
            );
        }

        const googleId = payload.sub;
        const email = payload.email;
        const fullName = payload.name || 'Pengguna Google';
        const avatarUrl = payload.picture || null;

        if (!googleId || !email) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email Google tidak ditemukan.',
                },
                { status: 400 }
            );
        }

        // Cari user berdasarkan email
        let user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        // Kalau belum ada, buat user baru
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    fullName,
                    avatarUrl,
                    passwordHash: '',
                    role: 'STUDENT',
                },
            });
        }

        // Buat JWT SIRKULA
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET
        );

        if (!process.env.JWT_SECRET) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'JWT_SECRET belum dikonfigurasi.',
                },
                { status: 500 }
            );
        }

        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(secret);

        return NextResponse.json({
            success: true,
            message: 'Login Google berhasil.',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                avatarUrl: user.avatarUrl,
                points: user.points,
            },
        });
    } catch (error) {
        console.error('Google login error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Login dengan Google gagal.',
            },
            { status: 500 }
        );
    }
}