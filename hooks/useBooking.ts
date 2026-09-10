'use client';

import { useState, useEffect } from 'react';
import { BookingRequest } from '../lib/types';

const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'book-8821',
    createdAt: '15 Juli 2026',
    locationId: 'loc-1',
    locationName: 'Bank Sampah Bersih Bersama Kampus',
    pickupDate: '18 Juli 2026',
    pickupTimeSlot: '14.00 - 16.00 WIB',
    wasteCategories: ['anorganik_daur_ulang'],
    estimatedWeightKg: 4.5,
    addressDetail: 'Wisma Ganesha 3, Kamar 204 (Tolak ke lantai dasar saat kurir tiba)',
    notes: 'Kardus sudah dipipihkan dan botol PET sudah dibersihkan.',
    status: 'Dijemput',
    courierName: 'Mas Rian (Kurir Sirkula)',
    courierPhone: '081298765432',
  },
];

export function useBooking() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sirkula_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        setBookings(INITIAL_BOOKINGS);
      }
    } else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem('sirkula_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }
  }, []);

  const createBooking = (data: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: BookingRequest = {
      ...data,
      id: `book-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Menunggu',
      courierName: 'Penugasan Kurir...',
      courierPhone: '0812-3456-7890',
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      localStorage.setItem('sirkula_bookings', JSON.stringify(updated));
      return updated;
    });

    return newBooking;
  };

  const advanceBookingStatus = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          let nextStatus: BookingRequest['status'] = 'Dijemput';
          if (b.status === 'Menunggu') nextStatus = 'Dijemput';
          else if (b.status === 'Dijemput') nextStatus = 'Selesai';
          else nextStatus = 'Selesai';

          return {
            ...b,
            status: nextStatus,
            courierName: b.courierName === 'Penugasan Kurir...' ? 'Mas Agus (Driver Sirkula Express)' : b.courierName,
          };
        }
        return b;
      });

      localStorage.setItem('sirkula_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  return {
    bookings,
    createBooking,
    advanceBookingStatus,
  };
}
