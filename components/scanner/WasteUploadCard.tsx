'use client';

import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import presetsData from '../../lib/data/presets.json';

interface WasteUploadCardProps {
  onScanComplete: (presetId?: string, customFileName?: string, weightKg?: number) => void;
  isAnalyzing: boolean;
}

export default function WasteUploadCard({ onScanComplete, isAnalyzing }: WasteUploadCardProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sample-pet');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(presetsData[0].imageUrl);
  const [weight, setWeight] = useState<number>(0.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedPresetId('');
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = presetsData.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setSelectedFile(null);
      setPreviewUrl(preset.imageUrl);
      setWeight(preset.estimatedWeight);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScanComplete(selectedPresetId, selectedFile?.name, weight);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Classifier Engine v2.4 (Simulasi)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Upload atau Ambil Foto Sampah Kos</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Box / Dropzone */}
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-600/40 hover:border-emerald-400 rounded-2xl p-6 sm:p-8 text-center bg-slate-950/60 cursor-pointer transition-all hover:bg-emerald-950/30 flex flex-col items-center justify-center min-h-[220px]"
          >
            {previewUrl ? (
              <div className="relative w-full max-w-xs h-44 rounded-xl overflow-hidden shadow-xl border border-emerald-500/30">
                <img src={previewUrl} alt="Preview Sampah" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Camera className="h-6 w-6 text-white" />
                  <span className="text-xs font-bold text-white">Ganti Foto</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Klik untuk ambil foto kamera / upload gambar</p>
                  <p className="text-xs text-slate-400 mt-1">Mendukung JPG, PNG, WEBP dari smartphone / HP kos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preset Sample Fast Select */}
        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
            Atau Pilih Sampel Pengujian Cepat:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {presetsData.map((preset) => (
              <button
                type="button"
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col items-center gap-1.5 ${
                  selectedPresetId === preset.id
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-900/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-700 hover:bg-emerald-950/40'
                }`}
              >
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="truncate w-full text-center text-[11px]">{preset.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weight Estimator Slider */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Estimasi Berat Sampah Kos:</span>
            <span className="text-emerald-400 font-extrabold text-sm">{weight} kg</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            Geser slider sesuai perkiraan timbangan sampah yang kamu kumpulkan di kos.
          </p>
        </div>

        {/* Submit Scan Button */}
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-900/50 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Memindai Gambar Sampah...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 fill-slate-950" /> Pindai & Analisis Sampah Sekarang
            </>
          )}
        </button>
      </form>
    </div>
  );
}
