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
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  return isAuthorized;
}
