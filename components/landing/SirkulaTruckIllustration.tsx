'use client';

import React from 'react';

export default function SirkulaTruckIllustration() {
  return (
    <div className="relative w-full max-w-md bg-[#e3eed8]/50 p-6 rounded-3xl border border-[#c4dcaf]/60 shadow-sm text-center">
      <div className="mx-auto w-full h-56 flex items-center justify-center relative">
        <img
          src="/assets/illustrations/sirkula-truck.svg"
          alt="SIRKULA Truck Kos Illustration"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-xs font-black tracking-widest text-[#1B4D3E] font-display uppercase mt-2 block">
        SIRKULA TRUCK KOS
      </span>
    </div>
  );
}
