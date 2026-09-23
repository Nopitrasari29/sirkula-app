'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/utils/storage';

export function useAuthGuard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile || !profile.isLoggedIn) {
      router.replace('/login');
      return;
    }

    // Sinkronkan token dari localStorage ke cookie (untuk middleware server-side guard)
    const token = localStorage.getItem('sirkula_auth_token');
    if (token) {
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `sirkula_auth_token=${token}; path=/; SameSite=Strict${isSecure ? '; Secure' : ''}`;
    }

    setIsAuthorized(true);
  }, [router]);

  return isAuthorized;
}
