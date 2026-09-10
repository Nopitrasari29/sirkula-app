'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import EcoBotChatWidget from '@/components/chatbot/EcoBotChatWidget';
import LocationPermissionModal from '@/components/map/LocationPermissionModal';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show Landing Navbar & Footer ONLY on public landing page ('/')
  const isLandingPage = pathname === '/';

  return (
    <>
      {isLandingPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {isLandingPage && <Footer />}
      <EcoBotChatWidget />
      <LocationPermissionModal />
    </>
  );
}
