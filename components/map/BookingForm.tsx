'use client';

import React, { useState } from 'react';
import { WasteLocation, BookingRequest } from '../../lib/types';
import { Calendar, Clock, MapPin, Truck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import categoriesData from '../../lib/data/wasteCategories.json';

interface BookingFormProps {
  location: WasteLocation;
  onSubmitBooking: (data: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  onClose: () => void;
}

export default function BookingForm({ location, onSubmitBooking, onClose }: BookingFormProps) {
  const [pickupDate, setPickupDate] = useState<string>('2026-08-05');
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>('14.00 - 16.00 WIB');
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [addressDetail, setAddressDetail] = useState<string>(
    'Kos Wisma Ganesha 3, Kamar 204 (Lantai 2, depan tangga utama)'
  );
  const [notes, setNotes] = useState<string>(
    'Sampah botol PET dan kardus sudah dipisahkan dalam kantong bersih.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBooking({
      locationId: location.id,
      locationName: location.name,
      pickupDate,
      pickupTimeSlot,
      wasteCategories: location.acceptedCategories,
      estimatedWeightKg: weightKg,
      addressDetail,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-emerald-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Form Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Booking Penjemputan Sampah Kos
            </span>
            <h3 className="text-xl font-black text-white mt-1">{location.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date & Time Slot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Tanggal Penjemputan
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Jam Operasional Jemput
              </label>
              <select
                value={pickupTimeSlot}
                onChange={(e) => setPickupTimeSlot(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="09.00 - 11.00 WIB">09.00 - 11.00 WIB (Pagi)</option>
                <option value="14.00 - 16.00 WIB">14.00 - 16.00 WIB (Sore Kos)</option>
                <option value="16.30 - 18.00 WIB">16.30 - 18.00 WIB (Pulang Kuliah)</option>
              </select>
            </div>
          </div>

          {/* Weight estimate */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <label className="text-emerald-400">Estimasi Berat Total Sampah Kos:</label>
              <span className="text-gold-400 font-extrabold text-sm">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Boarding House Detail Address */}
          <div>
            <label className="block text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Alamat Lengkap & No. Kamar Kos
            </label>
            <textarea
              rows={2}
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Pickup notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Catatan Tambahan untuk Kurir:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm hover:from-emerald-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/50 pt-3"
          >
            <Truck className="h-5 w-5" /> Konfirmasi & Kirim Booking Penjemputan
          </button>
        </form>
      </div>
    </div>
  );
}
