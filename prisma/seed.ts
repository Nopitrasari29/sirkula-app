import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MOCK_BANK_SAMPAH_LOCATIONS } from '../lib/data/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai seeding database SIRKULA...');

  // 1. Seed Badges
  console.log('🏅 Seeding Badges...');
  const badgesData = [
    {
      slug: 'pemula-hijau',
      title: 'Pemula Hijau',
      description: 'Lakukan pemindaian atau daur ulang sampah pertamamu.',
      iconName: 'Award',
      category: 'Pencapaian',
      requiredPoints: 50,
    },
    {
      slug: 'pahlawan-pet',
      title: 'Pahlawan Botol PET',
      description: 'Kumpulkan dan daur ulang minimal 5 kg botol plastik.',
      iconName: 'ShieldCheck',
      category: 'Kategori Sampah',
      requiredPoints: 200,
    },
    {
      slug: 'juara-kardus',
      title: 'Juara Kardus Kos',
      description: 'Kumpulkan 10 kg kardus bekas paket belanja online.',
      iconName: 'Package',
      category: 'Kategori Sampah',
      requiredPoints: 350,
    },
    {
      slug: 'eco-master',
      title: 'Eco Master ITS',
      description: 'Capai level 5 dan ajak tetangga kos hidup bersih sirkular.',
      iconName: 'Sparkles',
      category: 'Prestasi Kampus',
      requiredPoints: 1000,
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  // 2. Seed Users
  console.log('👤 Seeding Demo Users...');
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Sirkula123!', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: 'fika@sirkula.id' },
    update: {},
    create: {
      email: 'fika@sirkula.id',
      fullName: 'Rafika Az Zahra',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      campus: 'ITS Sukolilo',
      kosAddress: 'Jl. Gebang Wetan No. 12, Sukolilo, Surabaya',
      phone: '081234567890',
      points: 126,
      level: 3,
      totalRecycledKg: 14.5,
      co2SavedKg: 28.2,
    },
  });

  const collectorUser = await prisma.user.upsert({
    where: { email: 'joko@sirkula.id' },
    update: {},
    create: {
      email: 'joko@sirkula.id',
      fullName: 'Pak Joko (Pengepul Sukolilo)',
      passwordHash: defaultPasswordHash,
      role: 'COLLECTOR',
      campus: 'ITS Sukolilo',
      kosAddress: 'Gudang Pengepul Keputih Makmur No. 4',
      phone: '0812-9876-5432',
      points: 850,
      level: 5,
      totalRecycledKg: 420.0,
      co2SavedKg: 630.0,
    },
  });

  // 3. Seed Drop Points / Bank Sampah
  console.log('📍 Seeding Drop Points & Bank Sampah...');
  for (const loc of MOCK_BANK_SAMPAH_LOCATIONS) {
    await prisma.dropPoint.create({
      data: {
        name: loc.name,
        category: loc.category || 'Bank Sampah Unit',
        address: loc.address,
        campusRegion: loc.campusRegion || 'ITS Sukolilo',
        latitude: loc.latitude,
        longitude: loc.longitude,
        phone: loc.phone,
        operatingHours: loc.operatingHours || 'Senin - Sabtu, 08:00 - 16:00',
        acceptedCategories: loc.acceptedCategories || ['Plastik PET', 'Kertas & Kardus'],
        rating: loc.rating || 4.8,
      },
    });
  }

  console.log('✅ Seeding database SIRKULA selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
