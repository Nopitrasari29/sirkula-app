import { WasteScanResult, WasteCategoryType } from '../types';
import categoriesData from '../data/wasteCategories.json';
import presetsData from '../data/presets.json';

/**
 * Client-side simulation of AI Waste Classification
 * Matches preset hints, filenames, or random intelligent heuristic for uploaded images
 */
export function classifyWasteImage(
  fileName?: string,
  presetId?: string,
  customWeightKg?: number,
  customImageUrl?: string
): WasteScanResult {
  // If preset ID matches
  if (presetId) {
    const preset = presetsData.find((p) => p.id === presetId);
    if (preset) {
      const categoryObj = categoriesData.find((c) => c.id === preset.category) || categoriesData[0];
      const weight = customWeightKg || preset.estimatedWeight;
      const pricePerKg = preset.resaleValue || categoryObj.estimatedPricePerKg;
      const totalResale = Math.round(weight * pricePerKg);
      const points = Math.round(weight * categoryObj.pointsPerKg + 20); // base scanner bonus

      return {
        id: `scan-${Date.now()}`,
        timestamp: 'Baru saja',
        name: preset.name,
        itemName: preset.name,
        category: preset.category as WasteCategoryType,
        categoryName: categoryObj.name,
        confidence: 94 + Math.floor(Math.random() * 5),
        recycleability: preset.id === 'sample-baterai' ? 'Sedang' : 'Tinggi',
        estimatedWeightKg: weight,
        instructions: categoryObj.sortingTips,
        sortingTips: categoryObj.sortingTips,
        estimatedPricePerKg: pricePerKg,
        totalResaleValue: totalResale,
        earnedPoints: points,
        pointsEarned: points,
        co2SavedKg: Number((weight * categoryObj.co2SavedPerKg).toFixed(2)),
        imageUrl: customImageUrl || preset.imageUrl,
        recyclingImpact: preset.description || 'Dapat didaur ulang menjadi produk baru yang bermanfaat.',
      };
    }
  }

  // Heuristic matching based on filename or fallback
  const lowerName = (fileName || '').toLowerCase();
  let selectedCategory: WasteCategoryType = 'anorganik_daur_ulang';
  let detectedName = 'Sampah Anorganik Terpilah';
  let baseWeight = customWeightKg || 0.75;
  let customTips: string[] | undefined;

  if (lowerName.startsWith('webcam-capture') || lowerName.startsWith('image') || lowerName.startsWith('img')) {
    const liveDetections = [
      {
        name: 'Botol Plastik PET Bening (Live Camera)',
        category: 'anorganik_daur_ulang' as WasteCategoryType,
        weight: 0.5,
        tips: [
          'Bilas sisa minuman dan keringkan botol.',
          'Lepaskan tutup botol dan label plastik.',
          'Pipihkan botol untuk menghemat tempat di kantong kos.',
        ],
      },
      {
        name: 'Kardus Paket Belanja Online (Live Camera)',
        category: 'anorganik_daur_ulang' as WasteCategoryType,
        weight: 1.1,
        tips: [
          'Lepaskan selotip dan lakban perekat dari kardus.',
          'Lipat hingga rata dan simpan di tempat kering.',
          'Kumpulkan untuk ditukar poin penjemputan.',
        ],
      },
      {
        name: 'Kaleng Minuman Aluminium (Live Camera)',
        category: 'anorganik_daur_ulang' as WasteCategoryType,
        weight: 0.35,
        tips: [
          'Kuras sisa cairan dari dalam kaleng aluminium.',
          'Injak atau pipihkan kaleng agar hemat volume.',
          'Simpan bersama kaleng minuman lainnya.',
        ],
      },
    ];
    const chosen = liveDetections[Math.floor(Math.random() * liveDetections.length)];
    detectedName = chosen.name;
    selectedCategory = chosen.category;
    baseWeight = customWeightKg || chosen.weight;
    customTips = chosen.tips;
  } else if (lowerName.includes('botol') || lowerName.includes('pet') || lowerName.includes('plastik')) {
    selectedCategory = 'anorganik_daur_ulang';
    detectedName = 'Botol Plastik PET (Terdeteksi)';
  } else if (lowerName.includes('kardus') || lowerName.includes('kertas') || lowerName.includes('dus') || lowerName.includes('buku')) {
    selectedCategory = 'anorganik_daur_ulang';
    detectedName = 'Kardus Bekas Kemasan (Terdeteksi)';
    baseWeight = 1.1;
  } else if (lowerName.includes('kaleng') || lowerName.includes('logam') || lowerName.includes('besi')) {
    selectedCategory = 'anorganik_daur_ulang';
    detectedName = 'Kaleng & Logam Bekas (Terdeteksi)';
    baseWeight = 0.45;
  } else if (lowerName.includes('makanan') || lowerName.includes('sayur') || lowerName.includes('buah') || lowerName.includes('organik')) {
    selectedCategory = 'organik';
    detectedName = 'Sampah Organik Sisa Konsumsi';
    baseWeight = 0.9;
  } else if (lowerName.includes('baterai') || lowerName.includes('lampu') || lowerName.includes('elektronik') || lowerName.includes('b3')) {
    selectedCategory = 'b3';
    detectedName = 'Baterai / Perangkat E-Waste B3';
    baseWeight = 0.3;
  }

  const categoryObj = categoriesData.find((c) => c.id === selectedCategory) || categoriesData[0];
  const pricePerKg = categoryObj.estimatedPricePerKg;
  const totalResale = Math.round(baseWeight * pricePerKg);
  const points = Math.round(baseWeight * categoryObj.pointsPerKg + 25);

  return {
    id: `scan-${Date.now()}`,
    timestamp: 'Baru saja',
    name: detectedName,
    itemName: detectedName,
    category: selectedCategory,
    categoryName: categoryObj.name,
    confidence: 88 + Math.floor(Math.random() * 9),
    recycleability: selectedCategory === 'b3' ? 'Sedang' : 'Tinggi',
    estimatedWeightKg: baseWeight,
    instructions: customTips || categoryObj.sortingTips,
    sortingTips: customTips || categoryObj.sortingTips,
    estimatedPricePerKg: pricePerKg,
    totalResaleValue: totalResale,
    earnedPoints: points,
    pointsEarned: points,
    co2SavedKg: Number((baseWeight * categoryObj.co2SavedPerKg).toFixed(2)),
    imageUrl: customImageUrl || '/assets/illustrations/scan-item-bottle.png',
    recyclingImpact: 'Sampah berhasil teridentifikasi oleh Vision AI SIRKULA dan siap disalurkan ke rantai daur ulang.',
  };
}
