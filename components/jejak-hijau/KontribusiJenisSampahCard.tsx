'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getUserProfile, getScanHistory } from '@/lib/utils/storage';

export default function KontribusiJenisSampahCard() {
  const [totalKg, setTotalKg] = useState<number>(18.6);
  const [scanCategories, setScanCategories] = useState<Record<string, number>>({});

  const loadData = () => {
    const user = getUserProfile();
    const scans = getScanHistory();

    if (user && typeof user.totalRecycledKg === 'number' && user.totalRecycledKg > 0) {
      setTotalKg(user.totalRecycledKg);
    }

    const catMap: Record<string, number> = {};
    scans.forEach((s) => {
      const cat = (s.category || s.categoryName || 'Plastik').toLowerCase();
      if (cat.includes('plastik') || cat.includes('pet')) {
        catMap['Plastik'] = (catMap['Plastik'] || 0) + (s.estimatedWeightKg || 0.4);
      } else if (cat.includes('kardus') || cat.includes('kertas')) {
        catMap['Kertas'] = (catMap['Kertas'] || 0) + (s.estimatedWeightKg || 1.2);
      } else if (cat.includes('logam') || cat.includes('kaleng')) {
        catMap['Logam'] = (catMap['Logam'] || 0) + (s.estimatedWeightKg || 0.5);
      } else if (cat.includes('kaca')) {
        catMap['Kaca'] = (catMap['Kaca'] || 0) + (s.estimatedWeightKg || 0.8);
      } else if (cat.includes('organik')) {
        catMap['Organik'] = (catMap['Organik'] || 0) + (s.estimatedWeightKg || 0.7);
      }
    });
    setScanCategories(catMap);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const pieData = useMemo(() => {
    const plastikVal = Number((totalKg * 0.35 + (scanCategories['Plastik'] || 0)).toFixed(1));
    const kertasVal = Number((totalKg * 0.25 + (scanCategories['Kertas'] || 0)).toFixed(1));
    const logamVal = Number((totalKg * 0.18 + (scanCategories['Logam'] || 0)).toFixed(1));
    const kacaVal = Number((totalKg * 0.10 + (scanCategories['Kaca'] || 0)).toFixed(1));
    const organikVal = Number((totalKg * 0.12 + (scanCategories['Organik'] || 0)).toFixed(1));

    const sum = plastikVal + kertasVal + logamVal + kacaVal + organikVal;

    return [
      { name: 'Plastik', value: plastikVal, percent: Math.round((plastikVal / sum) * 100), color: '#1C4D38' },
      { name: 'Kertas', value: kertasVal, percent: Math.round((kertasVal / sum) * 100), color: '#66B086' },
      { name: 'Logam', value: logamVal, percent: Math.round((logamVal / sum) * 100), color: '#D9A74E' },
      { name: 'Kaca', value: kacaVal, percent: Math.round((kacaVal / sum) * 100), color: '#E07A5F' },
      { name: 'Organik', value: organikVal, percent: Math.round((organikVal / sum) * 100), color: '#D4CEBC' },
    ];
  }, [totalKg, scanCategories]);

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-5 h-full flex flex-col justify-between">
      
      {/* Title */}
      <h3 className="text-sm font-black text-[#1C4D38] font-display">
        Kontribusi Berdasarkan Jenis Sampah
      </h3>

      {/* Donut Chart & Legend Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-2">
        
        {/* Left: Donut Chart with Center Text (5 Cols) */}
        <div className="sm:col-span-5 h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: 'none' }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={66}
                paddingAngle={3}
                dataKey="value"
                style={{ outline: 'none' }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                    style={{ outline: 'none' }}
                    className="focus:outline-hidden"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-base font-black text-[#1C4D38] font-display leading-none">
              {totalKg.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] font-bold text-[#1C4D38]/70 mt-0.5">
              kg
            </span>
          </div>
        </div>

        {/* Right: Legend Breakdown List (7 Cols) */}
        <div className="sm:col-span-7 space-y-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-[#1C4D38]/80">{item.name}</span>
              </div>
              <span className="font-extrabold text-[#1C4D38] text-[11px]">
                {item.value} kg <span className="font-semibold text-gray-500">({item.percent}%)</span>
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Comparison Banner */}
      <div className="bg-[#D6E6C5]/70 border border-[#1C4D38]/15 rounded-2xl p-4 flex items-center justify-between gap-3">
        <p className="text-xs text-[#1C4D38] font-extrabold leading-snug">
          Kamu sudah mengelola lebih banyak sampah dibanding <span className="text-[#D97745] font-black">67%</span> pengguna di kotamu!
        </p>
        <div className="w-12 h-12 shrink-0 flex items-center justify-center">
          <img
            src="/assets/icons/icon-sprout-plant.png"
            alt="Tanaman Kecil Sirkula"
            className="w-full h-full object-contain filter drop-shadow-xs hover:scale-105 transition-transform duration-200"
          />
        </div>
      </div>

    </div>
  );
}
