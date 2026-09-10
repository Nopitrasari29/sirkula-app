'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { getScanHistory, getUserProfile } from '@/lib/utils/storage';

export default function TrenSampahChartCard() {
  const [timeframe, setTimeframe] = useState<'Mingguan' | 'Bulanan'>('Mingguan');
  const [totalRecycled, setTotalRecycled] = useState<number>(18.6);
  const [scanCount, setScanCount] = useState<number>(0);

  const loadData = () => {
    const user = getUserProfile();
    const scans = getScanHistory();
    if (user && typeof user.totalRecycledKg === 'number' && user.totalRecycledKg > 0) {
      setTotalRecycled(user.totalRecycledKg);
    }
    setScanCount(scans.length);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const chartData = useMemo(() => {
    if (timeframe === 'Bulanan') {
      const baseMonthly = totalRecycled / 3;
      return [
        { day: 'Mei', weight: Number((baseMonthly * 0.7).toFixed(1)) },
        { day: 'Jun', weight: Number((baseMonthly * 0.9).toFixed(1)) },
        { day: 'Jul', weight: Number((baseMonthly * 1.1).toFixed(1)) },
        { day: 'Ags', weight: Number(totalRecycled.toFixed(1)) },
      ];
    }

    // Mingguan
    const factor = totalRecycled > 0 ? totalRecycled / 20 : 1;
    return [
      { day: 'Sen', weight: Number((3.2 * factor).toFixed(1)) },
      { day: 'Sel', weight: Number((2.4 * factor).toFixed(1)) },
      { day: 'Rab', weight: Number((4.1 * factor).toFixed(1)) },
      { day: 'Kam', weight: Number((3.8 * factor).toFixed(1)) },
      { day: 'Jum', weight: Number((2.9 * factor).toFixed(1)) },
      { day: 'Sab', weight: Number((4.5 * factor).toFixed(1)) },
      { day: 'Min', weight: Number((1.2 * factor + scanCount * 0.4).toFixed(1)) },
    ];
  }, [timeframe, totalRecycled, scanCount]);

  const weeklyAvg = (totalRecycled / 3.2).toFixed(1);
  const totalFourWeeks = (totalRecycled * 2.8).toFixed(1);

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 shadow-xs space-y-5 h-full flex flex-col justify-between">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#1C4D38] font-display">
          Tren Sampah Terkelola
        </h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as 'Mingguan' | 'Bulanan')}
          className="px-3 py-1 bg-[#1C4D38] text-white text-xs font-extrabold rounded-xl focus:outline-none cursor-pointer shadow-2xs"
        >
          <option value="Mingguan">Mingguan</option>
          <option value="Bulanan">Bulanan</option>
        </select>
      </div>

      {/* Line Chart Area */}
      <div className="w-full h-48 sm:h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C4D38" strokeOpacity={0.1} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#1C4D38', fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: '#1C4D38', strokeOpacity: 0.2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#1C4D38', fontSize: 11, fontWeight: 700 }}
              axisLine={{ stroke: '#1C4D38', strokeOpacity: 0.2 }}
              tickLine={false}
              domain={[0, 20]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1C4D38',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 'bold',
                border: 'none',
              }}
              formatter={(val: number) => [`${val} kg`, 'Sampah']}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#1C4D38"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#1C4D38', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, fill: '#D97745' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Summary Banner Box */}
      <div className="bg-[#D6E6C5]/70 border border-[#1C4D38]/15 rounded-2xl p-4 flex items-center justify-between gap-4">
        
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Item 1 */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#1C4D38]/10 flex items-center justify-center shrink-0 text-[#1C4D38]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#1C4D38]/70">
                Rata-rata per minggu
              </p>
              <p className="text-xs font-black text-[#1C4D38] font-display">
                {weeklyAvg} kg
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/80 border border-[#1C4D38]/10 flex items-center justify-center shrink-0 text-[#1C4D38]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#1C4D38]/70">
                Total 4 minggu terakhir
              </p>
              <p className="text-xs font-black text-[#1C4D38] font-display">
                {totalFourWeeks} kg
              </p>
            </div>
          </div>
        </div>

        {/* Sprouting Plant Graphic Mascot */}
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
