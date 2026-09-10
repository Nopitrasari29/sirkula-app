import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '../components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'SIRKULA — Menutup Lingkaran Sampah, dari Rumah ke Pengepul',
  description:
    'Aplikasi pengelola sampah terintegrasi untuk mahasiswa kos. Fitur AI Scanner, Dashboard Gamifikasi, Peta Bank Sampah, dan Edukasi Pintar.',
  keywords: [
    'Sirkula',
    'Bank Sampah Kos',
    'Daur Ulang Mahasiswa',
    'AI Waste Scanner',
    'Smart Digital Green Solution',
    'Kos Hijau Indonesia',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F7F8F3] text-emerald-950 antialiased selection:bg-emerald-800 selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
