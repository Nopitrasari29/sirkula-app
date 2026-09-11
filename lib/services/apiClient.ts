// SIRKULA Unified Backend API Client Service
// Bridges frontend UI components directly to Next.js Backend Endpoints (/api/...)

const TOKEN_STORAGE_KEY = 'sirkula_auth_token';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  public removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(endpoint, {
        ...options,
        headers,
      });

      const json = await res.json();
      return json;
    } catch (error) {
      console.warn(`API request to ${endpoint} failed:`, error);
      return {
        success: false,
        message: 'Koneksi ke backend terganggu. Menggunakan mode cadangan.',
      };
    }
  }

  // 1. Authentication Endpoints
  public auth = {
    register: async (userData: { fullName: string; email: string; password?: string; role?: string; campus?: string }) => {
      const res = await this.request<any>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res.success && (res as any).token) {
        this.setToken((res as any).token);
      }
      return res;
    },

    login: async (credentials: { email: string; password?: string }) => {
      const res = await this.request<any>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.success && (res as any).token) {
        this.setToken((res as any).token);
      }
      return res;
    },

    getMe: async () => {
      return this.request<any>('/api/auth/me', {
        method: 'GET',
      });
    },

    logout: () => {
      this.removeToken();
    },
  };

  // 2. Bookings Endpoints
  public bookings = {
    getAll: async () => {
      return this.request<any[]>('/api/booking', {
        method: 'GET',
      });
    },

    create: async (bookingData: any) => {
      return this.request<any>('/api/booking', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },

    updateStatus: async (id: string, status: string) => {
      return this.request<any>('/api/booking', {
        method: 'PATCH',
        body: JSON.stringify({ id, status }),
      });
    },
  };

  // 3. Scanner Endpoints
  public scanner = {
    recordScan: async (scanData: any) => {
      return this.request<any>('/api/scanner', {
        method: 'POST',
        body: JSON.stringify(scanData),
      });
    },
  };

  // 4. Locations & Drop Points Endpoints
  public lokasi = {
    getAll: async (params?: { campus?: string; category?: string; lat?: number; lng?: number }) => {
      const query = new URLSearchParams();
      if (params?.campus) query.append('campus', params.campus);
      if (params?.category) query.append('category', params.category);
      if (params?.lat) query.append('lat', params.lat.toString());
      if (params?.lng) query.append('lng', params.lng.toString());

      const url = `/api/lokasi${query.toString() ? `?${query.toString()}` : ''}`;
      return this.request<any[]>(url, {
        method: 'GET',
      });
    },
  };

  // 5. User Statistics & Profile Endpoints
  public stats = {
    get: async () => {
      return this.request<any>('/api/user/stats', {
        method: 'GET',
      });
    },
  };

  public profile = {
    get: async () => {
      return this.request<any>('/api/user/profile', {
        method: 'GET',
      });
    },
    update: async (profileData: { fullName?: string; campus?: string; kosAddress?: string; phone?: string; avatarUrl?: string }) => {
      return this.request<any>('/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });
    },
  };

  // 6. Notifications Endpoints
  public notifications = {
    getAll: async () => {
      return this.request<any[]>('/api/notifications', {
        method: 'GET',
      });
    },
    markAsRead: async (notificationId?: string, markAllRead?: boolean) => {
      return this.request<any>('/api/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ notificationId, markAllRead }),
      });
    },
  };

  // 7. Education & Quiz Endpoints
  public edu = {
    submitQuiz: async (data: { quizTopic: string; score: number; totalQuestions?: number }) => {
      return this.request<any>('/api/edu/quiz/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  };
}

export const apiClient = new ApiClient();
export default apiClient;
