'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import NotificationPopover from '@/components/ui/NotificationPopover';
import UserProfilePopover from '@/components/ui/UserProfilePopover';
import WasteUploadView from '@/components/scanner/WasteUploadView';
import ScanningModal from '@/components/scanner/ScanningModal';
import ScanResultView from '@/components/scanner/ScanResultView';
import ScanHistoryModal from '@/components/scanner/ScanHistoryModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { RotateCcw } from 'lucide-react';
import { saveScanToHistory } from '@/lib/utils/storage';
import { WasteScanResult } from '@/lib/types';
import { classifyWasteImage } from '@/lib/logic/classifyWaste';

export default function ScannerPage() {
  const isAuthorized = useAuthGuard();
  const [scanState, setScanState] = useState<'upload' | 'scanning' | 'result'>('upload');
  const [activeResult, setActiveResult] = useState<WasteScanResult | null>(null);
  const [pendingPresetId, setPendingPresetId] = useState<string>('sample-pet');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);

  if (!isAuthorized) return null;

  const handleStartScan = (presetId?: string, file?: File) => {
    if (file) {
      setUploadedFile(file);
      setUploadedFilePreview(URL.createObjectURL(file));
      setPendingPresetId('');
    } else {
      const targetPresetId = presetId || 'sample-pet';
      setPendingPresetId(targetPresetId);
      setUploadedFile(null);
      setUploadedFilePreview(null);
    }
    setScanState('scanning');
  };

  const handleScanningComplete = () => {
    const newScanResult: WasteScanResult = classifyWasteImage(
      uploadedFile?.name,
      uploadedFile ? undefined : (pendingPresetId || 'sample-pet'),
      undefined,
      uploadedFilePreview || undefined
    );

    // Save scan to user history & add points automatically in storage
    saveScanToHistory(newScanResult);

    setActiveResult(newScanResult);
    setScanState('result');
  };

  const handleScanAgain = () => {
    setActiveResult(null);
    setScanState('upload');
  };

  const handleSelectHistoricalScan = (historyScan: WasteScanResult) => {
    setActiveResult(historyScan);
    setScanState('result');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3E9] text-[#1C4D38] font-sans">
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Right Content Area */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 relative z-10 overflow-y-auto h-full">
        


        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C4D38] tracking-tight font-display">
                AI Scanner
              </h1>
              <p className="text-xs sm:text-sm text-[#1C4D38]/80 font-medium">
                Scan sampahmu dan dapatkan informasi jenis, cara pemilahan, dan estimasi nilai jualnya
              </p>
            </div>

            {/* Header Right Action Bar */}
            <div className="flex items-center gap-2.5 shrink-0">
              
              {/* Riwayat Scan Button */}
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#1C4D38]/10 shadow-sm text-xs font-extrabold text-[#1C4D38] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#1C4D38]/80" />
                <span>Riwayat Scan</span>
              </button>

              <NotificationPopover />
              <UserProfilePopover />

            </div>
          </div>

          {/* Conditional View Rendering Based on Scan State */}
          {scanState === 'upload' && (
            <WasteUploadView
              onStartScan={handleStartScan}
              onOpenHistory={() => setIsHistoryModalOpen(true)}
            />
          )}

          {scanState === 'result' && activeResult && (
            <ScanResultView
              result={activeResult}
              onScanAgain={handleScanAgain}
            />
          )}

        </div>

      </div>

      {/* 🔮 Scanning Progress Modal */}
      <ScanningModal
        isOpen={scanState === 'scanning'}
        onComplete={handleScanningComplete}
      />

      {/* 📜 Scan History Modal */}
      <ScanHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectScan={handleSelectHistoricalScan}
      />

    </div>
  );
}
