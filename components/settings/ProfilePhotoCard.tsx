'use client';

import React, { useState, useEffect } from 'react';
import { Camera, User } from 'lucide-react';
import { getCurrentLanguage, translations } from '@/lib/utils/i18n';

interface ProfilePhotoCardProps {
  initialPhoto?: string;
  onPhotoChange?: (newPhotoUrl: string) => void;
}

export default function ProfilePhotoCard({ initialPhoto, onPhotoChange }: ProfilePhotoCardProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhoto || null);
  const [imageError, setImageError] = useState(false);
  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    setPhotoUrl(initialPhoto || null);
    setImageError(false);
    setLang(getCurrentLanguage());
  }, [initialPhoto]);

  const t = translations[lang] || translations.id;

  // Compress image to 250x250 max thumbnail to prevent localStorage QuotaExceededError
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            setPhotoUrl(compressedBase64);
            setImageError(false);
            if (onPhotoChange) onPhotoChange(compressedBase64);
          }
        };
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#FAF5ED]/90 backdrop-blur-md border border-[#1C4D38]/10 rounded-[28px] p-6 text-center shadow-xs flex flex-col items-center justify-center space-y-4 h-full">
      <h3 className="text-sm font-extrabold text-[#1C4D38] font-display">
        {t.settings.profilePhoto}
      </h3>

      {/* Avatar Circle Container */}
      <div className="relative my-2">
        <div className="w-28 h-28 rounded-full bg-[#D4E8D8] border-2 border-[#1C4D38]/20 flex items-center justify-center overflow-hidden shadow-inner">
          {photoUrl && !imageError ? (
            <img
              src={photoUrl}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-14 h-14 text-[#1C4D38]/60" />
          )}
        </div>

        {/* Camera Badge Icon */}
        <label
          htmlFor="profile-photo-upload"
          className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#A8D5BA] border-2 border-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition"
        >
          <Camera className="w-4 h-4 text-[#1C4D38]" />
        </label>
        <input
          id="profile-photo-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Helper Text */}
      <div className="space-y-0.5 text-[11px] font-semibold text-[#1C4D38]/70">
        <p>{t.settings.formatNote}</p>
        <p>{t.settings.maxNote}</p>
      </div>

      {/* Ganti Foto Button */}
      <label
        htmlFor="profile-photo-upload"
        className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-gray-50 border border-[#1C4D38]/20 text-[#1C4D38] text-xs font-extrabold rounded-xl transition shadow-2xs"
      >
        <Camera className="w-3.5 h-3.5" />
        <span>{t.settings.changePhoto}</span>
      </label>
    </div>
  );
}
