import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  Download,
  Trash2,
  Image as ImageIcon,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FileArchive,
  ArrowRight,
  Plus,
  RefreshCw,
  Zap,
  Sliders,
  Eye,
  X
} from 'lucide-react';

import {
  type ResizeMode,
  type OutputFormat,
  type ResizeSettings,
  type ImageItem,
  PRESET_OPTIONS,
  readImageMetadata,
  computeTargetDimensions,
  processBatchQueue
} from '../utils/imageEngine';
import { formatBytes, formatPercentageReduction } from '../utils/formatters';
import { createAndDownloadZip, downloadSingleFile } from '../utils/zipEngine';
import { translations, defaultLocale, type SupportedLocale } from '../i18n/ui';

interface BulkResizerProps {
  locale?: SupportedLocale;
}

export default function BulkResizer({ locale = defaultLocale }: BulkResizerProps) {
  const t = translations[locale] || translations[defaultLocale];

  // Batch settings state
  const [settings, setSettings] = useState<ResizeSettings>({
    mode: 'percentage',
    percentage: 50,
    exactWidth: 1920,
    exactHeight: 1080,
    lockAspectRatio: true,
    presetId: 'ig-square',
    fitMode: 'contain',
    format: 'webp',
    quality: 85,
    prefix: 'resized_',
  });

  // Images state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File loading helper
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const newItems: ImageItem[] = [];

    for (const file of validFiles) {
      try {
        const meta = await readImageMetadata(file);
        newItems.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          originalSize: file.size,
          originalWidth: meta.width,
          originalHeight: meta.height,
          aspectRatio: meta.width / meta.height,
          previewUrl: meta.previewUrl,
          status: 'idle',
        });
      } catch (err) {
        console.error('Error loading image file:', err);
      }
    }

    setImages((prev) => [...prev, ...newItems]);
  }, []);

  // Drag and drop listeners
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Clipboard paste support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        handleFiles(e.clipboardData.files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  // Clean up object URLs when items removed
  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.processedUrl) URL.revokeObjectURL(target.processedUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
    });
    setImages([]);
  };

  // Process Batch
  const runBatchProcessing = async () => {
    if (images.length === 0 || isProcessing) return;
    setIsProcessing(true);

    try {
      await processBatchQueue(
        images,
        settings,
        (updatedItem) => {
          setImages((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
          );
        },
        4
      );

      // Trigger small celebratory confetti using palette colors
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F2C46A', '#AEAC78', '#4C4541', '#FCF0DA'],
      });
    } catch (err) {
      console.error('Batch processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const doneImages = images.filter((img) => img.status === 'done' && img.processedBlob);
  const totalOriginalBytes = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalProcessedBytes = doneImages.reduce((acc, img) => acc + (img.processedSize || 0), 0);
  const overallSavings = formatPercentageReduction(totalOriginalBytes, totalProcessedBytes);

  // Batch ZIP Download
  const handleDownloadAllZip = async () => {
    if (doneImages.length === 0 || isZipping) return;
    setIsZipping(true);
    setZipProgress(0);

    try {
      const zipItems = doneImages.map((img) => ({
        filename: img.outputFilename || img.name,
        blob: img.processedBlob!,
      }));

      await createAndDownloadZip(zipItems, 'bulkresize_images.zip', (percent) => {
        setZipProgress(percent);
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F2C46A', '#AEAC78', '#4C4541', '#FCF0DA'],
      });
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  // Percentage preset quick clicks
  const setPercentageQuick = (pct: number) => {
    setSettings((s) => ({ ...s, percentage: pct }));
  };

  // Swap exact dimensions
  const swapDimensions = () => {
    setSettings((s) => ({
      ...s,
      exactWidth: s.exactHeight,
      exactHeight: s.exactWidth,
    }));
  };

  return (
    <div id="workspace" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Banner / Callout in Palette Colors */}
      <div className="mb-8 p-4 rounded-2xl bg-[#f5e5c9]/80 dark:bg-[#342e2b]/80 border border-[#4C4541]/15 dark:border-[#FCF0DA]/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-[#4C4541] dark:text-[#FCF0DA]">
          <span className="p-2 rounded-xl bg-[#4C4541] dark:bg-[#F2C46A] text-[#FCF0DA] dark:text-[#4C4541] shadow-sm shrink-0">
            <Zap className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-[#4C4541] dark:text-[#FCF0DA]">100% Client-Side Engine:</span>{' '}
            Your images are processed directly in browser RAM with zero server latency or data collection.
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#AEAC78]/25 text-[#4C4541] dark:text-[#FCF0DA] border border-[#AEAC78]/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#AEAC78]" />
            Hardware Accelerated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Drag & Drop Zone + Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dropzone with Palette Styling */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-8 md:p-10 text-center transition-all duration-200 select-none group ${
              isDragging
                ? 'border-[#F2C46A] bg-[#f5e5c9] dark:bg-[#3d3632] scale-[1.01]'
                : 'border-[#4C4541]/25 dark:border-[#FCF0DA]/25 bg-[#f8ebd5]/50 dark:bg-[#2b2523]/50 hover:border-[#AEAC78] hover:bg-[#f5e5c9]/60 dark:hover:bg-[#342e2b]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
                e.target.value = '';
              }}
            />

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F2C46A]/25 text-[#4C4541] dark:text-[#F2C46A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Upload className="w-8 h-8 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FCF0DA] mb-1">
                {t.resizer.dropzoneTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#4C4541]/70 dark:text-[#FCF0DA]/70 mb-4 max-w-sm">
                {t.resizer.dropzoneSubtitle}
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FCF0DA] dark:bg-[#342e2b] border border-[#4C4541]/20 dark:border-[#FCF0DA]/20 text-xs font-bold text-[#4C4541] dark:text-[#F2C46A] shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>Select Photos or Paste (Ctrl+V)</span>
              </div>
              <p className="text-[11px] text-[#4C4541]/60 dark:text-[#FCF0DA]/50 mt-4">
                {t.resizer.dropzoneSupport}
              </p>
            </div>
          </div>

          {/* Resizing & Compression Settings Panel */}
          <div className="rounded-3xl border border-[#4C4541]/15 dark:border-[#FCF0DA]/15 bg-[#FCF0DA] dark:bg-[#2c2624] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#4C4541]/15 dark:border-[#FCF0DA]/15">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#c68a25] dark:text-[#F2C46A]" />
                <h3 className="font-bold text-[#4C4541] dark:text-[#FCF0DA] text-base">
                  {t.resizer.settingsTitle}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#AEAC78]/25 text-[#4C4541] dark:text-[#FCF0DA]">
                {images.length} {images.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            {/* Mode Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4C4541]/70 dark:text-[#FCF0DA]/70">
                {t.resizer.modeLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#ebdcc0] dark:bg-[#201c1b]">
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, mode: 'percentage' }))}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
                    settings.mode === 'percentage'
                      ? 'bg-[#FCF0DA] dark:bg-[#342e2b] text-[#4C4541] dark:text-[#F2C46A] shadow-sm'
                      : 'text-[#4C4541]/70 dark:text-[#FCF0DA]/70 hover:text-[#4C4541] dark:hover:text-[#FCF0DA]'
                  }`}
                >
                  {t.resizer.modePercentage}
                </button>
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, mode: 'exact' }))}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
                    settings.mode === 'exact'
                      ? 'bg-[#FCF0DA] dark:bg-[#342e2b] text-[#4C4541] dark:text-[#F2C46A] shadow-sm'
                      : 'text-[#4C4541]/70 dark:text-[#FCF0DA]/70 hover:text-[#4C4541] dark:hover:text-[#FCF0DA]'
                  }`}
                >
                  {t.resizer.modeExact}
                </button>
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, mode: 'preset' }))}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
                    settings.mode === 'preset'
                      ? 'bg-[#FCF0DA] dark:bg-[#342e2b] text-[#4C4541] dark:text-[#F2C46A] shadow-sm'
                      : 'text-[#4C4541]/70 dark:text-[#FCF0DA]/70 hover:text-[#4C4541] dark:hover:text-[#FCF0DA]'
                  }`}
                >
                  {t.resizer.modePresets}
                </button>
              </div>
            </div>

            {/* Mode 1: Percentage */}
            {settings.mode === 'percentage' && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#f5e5c9]/60 dark:bg-[#342e2b]/60 border border-[#4C4541]/10 dark:border-[#FCF0DA]/10">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#4C4541] dark:text-[#FCF0DA]">{t.resizer.scalePercent}</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#F2C46A] text-[#4C4541] font-mono text-sm font-bold">
                    {settings.percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={settings.percentage}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, percentage: parseInt(e.target.value) || 50 }))
                  }
                  className="w-full"
                />
                <div className="flex items-center justify-between gap-2 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPercentageQuick(pct)}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                        settings.percentage === pct
                          ? 'border-[#4C4541] dark:border-[#F2C46A] bg-[#4C4541] dark:bg-[#F2C46A] text-[#FCF0DA] dark:text-[#4C4541]'
                          : 'border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] hover:border-[#AEAC78]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 2: Exact Dimensions */}
            {settings.mode === 'exact' && (
              <div className="space-y-4 p-4 rounded-2xl bg-[#f5e5c9]/60 dark:bg-[#342e2b]/60 border border-[#4C4541]/10 dark:border-[#FCF0DA]/10">
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4C4541]/80 dark:text-[#FCF0DA]/80 mb-1">
                      {t.resizer.width}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={settings.exactWidth}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          exactWidth: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] focus:outline-none focus:ring-2 focus:ring-[#F2C46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#4C4541]/80 dark:text-[#FCF0DA]/80 mb-1">
                      {t.resizer.height}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={settings.exactHeight}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          exactHeight: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] focus:outline-none focus:ring-2 focus:ring-[#F2C46A]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((s) => ({ ...s, lockAspectRatio: !s.lockAspectRatio }))
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      settings.lockAspectRatio
                        ? 'bg-[#AEAC78]/30 border-[#AEAC78] text-[#4C4541] dark:text-[#FCF0DA]'
                        : 'bg-[#FCF0DA] dark:bg-[#25211f] border-[#4C4541]/20 dark:border-[#FCF0DA]/20 text-[#4C4541]/70 dark:text-[#FCF0DA]/70'
                    }`}
                  >
                    {settings.lockAspectRatio ? (
                      <Lock className="w-3.5 h-3.5 text-[#AEAC78]" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-[#4C4541]/40 dark:text-[#FCF0DA]/40" />
                    )}
                    <span>{t.resizer.lockAspectRatio}</span>
                  </button>

                  <button
                    type="button"
                    onClick={swapDimensions}
                    title="Swap Width and Height"
                    className="p-2 rounded-xl border border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] hover:border-[#F2C46A] hover:text-[#c68a25] dark:hover:text-[#F2C46A] transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Mode 3: Presets */}
            {settings.mode === 'preset' && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#f5e5c9]/60 dark:bg-[#342e2b]/60 border border-[#4C4541]/10 dark:border-[#FCF0DA]/10">
                <label className="block text-[11px] font-bold text-[#4C4541]/80 dark:text-[#FCF0DA]/80">
                  {t.resizer.selectPreset}
                </label>
                <select
                  value={settings.presetId}
                  onChange={(e) => setSettings((s) => ({ ...s, presetId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] focus:outline-none focus:ring-2 focus:ring-[#F2C46A] font-medium"
                >
                  <optgroup label="Social Media Presets">
                    {PRESET_OPTIONS.filter((p) => p.category === 'social').map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Web & Display Presets">
                    {PRESET_OPTIONS.filter((p) => p.category === 'web').map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

            {/* Format & Quality Controls */}
            <div className="space-y-4 pt-2 border-t border-[#4C4541]/15 dark:border-[#FCF0DA]/15">
              {/* Output Format */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4C4541]/70 dark:text-[#FCF0DA]/70">
                  {t.resizer.formatLabel}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'webp', label: 'WebP', badge: 'Best' },
                    { id: 'jpeg', label: 'JPEG', badge: null },
                    { id: 'png', label: 'PNG', badge: null },
                    { id: 'original', label: 'Original', badge: null },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, format: fmt.id as OutputFormat }))}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition relative ${
                        settings.format === fmt.id
                          ? 'border-[#F2C46A] bg-[#F2C46A]/25 text-[#4C4541] dark:text-[#FCF0DA] ring-2 ring-[#F2C46A]/40'
                          : 'border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] hover:border-[#AEAC78]'
                      }`}
                    >
                      {fmt.label}
                      {fmt.badge && (
                        <span className="absolute -top-2 right-1 px-1 py-0.2 rounded text-[9px] font-bold bg-[#AEAC78] text-[#FCF0DA] leading-tight">
                          {fmt.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compression Quality Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#4C4541] dark:text-[#FCF0DA]">{t.resizer.qualityLabel}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#AEAC78]/30 text-[#4C4541] dark:text-[#FCF0DA] font-mono text-xs font-bold">
                    {settings.quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={settings.quality}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, quality: parseInt(e.target.value) || 85 }))
                  }
                  className="w-full"
                />
                <p className="text-[11px] text-[#4C4541]/60 dark:text-[#FCF0DA]/50">
                  {t.resizer.qualityHint}
                </p>
              </div>

              {/* Custom Filename Prefix */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4C4541]/80 dark:text-[#FCF0DA]/80">
                  {t.resizer.fileNamingLabel}
                </label>
                <input
                  type="text"
                  value={settings.prefix}
                  placeholder={t.resizer.fileNamingPlaceholder}
                  onChange={(e) => setSettings((s) => ({ ...s, prefix: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#FCF0DA] dark:bg-[#25211f] text-[#4C4541] dark:text-[#FCF0DA] focus:outline-none focus:ring-2 focus:ring-[#F2C46A]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#4C4541]/15 dark:border-[#FCF0DA]/15 space-y-3">
              <button
                type="button"
                disabled={images.length === 0 || isProcessing}
                onClick={runBatchProcessing}
                className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 ${
                  images.length === 0
                    ? 'bg-[#ebdcc0] dark:bg-[#342e2b] text-[#4C4541]/40 dark:text-[#FCF0DA]/40 cursor-not-allowed'
                    : isProcessing
                    ? 'bg-[#e5ab3f] text-[#4C4541] cursor-wait'
                    : 'bg-[#F2C46A] hover:bg-[#e5ab3f] active:scale-[0.99] text-[#4C4541] shadow-[#F2C46A]/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.resizer.processingBatchBtn}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>{t.resizer.startBatchBtn} ({images.length})</span>
                  </>
                )}
              </button>

              {images.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl border border-[#4C4541]/15 dark:border-[#FCF0DA]/15 bg-[#f5e5c9] dark:bg-[#342e2b] text-[#4C4541] dark:text-[#FCF0DA] hover:bg-[#edd9b9] dark:hover:bg-[#443c38] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.resizer.addMoreBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-100/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.resizer.clearAllBtn}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Processed Queue & Stats & 1-Click ZIP Download */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Stats & Download All Bar */}
          <div className="rounded-3xl border border-[#4C4541]/15 dark:border-[#FCF0DA]/15 bg-[#FCF0DA] dark:bg-[#2c2624] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#4C4541] dark:text-[#FCF0DA] flex items-center gap-2">
                  <FileArchive className="w-5 h-5 text-[#c68a25] dark:text-[#F2C46A]" />
                  <span>{t.resizer.queueTitle}</span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#ebdcc0] dark:bg-[#38312e] text-[#4C4541] dark:text-[#FCF0DA]">
                    {images.length}
                  </span>
                </h3>
                {doneImages.length > 0 && (
                  <p className="text-xs text-[#4C4541]/80 dark:text-[#FCF0DA]/80 mt-1">
                    {doneImages.length} processed • {formatBytes(totalOriginalBytes)} ➔ {formatBytes(totalProcessedBytes)}{' '}
                    <span className="font-extrabold text-[#7c7a4d] dark:text-[#F2C46A]">
                      ({overallSavings.label} saved)
                    </span>
                  </p>
                )}
              </div>

              {/* 1-Click ZIP Download Button in Sage Olive (#AEAC78) */}
              <button
                type="button"
                disabled={doneImages.length === 0 || isZipping}
                onClick={handleDownloadAllZip}
                className={`py-3 px-5 rounded-2xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 ${
                  doneImages.length === 0
                    ? 'bg-[#ebdcc0] dark:bg-[#342e2b] text-[#4C4541]/40 dark:text-[#FCF0DA]/40 cursor-not-allowed border border-[#4C4541]/15 dark:border-[#FCF0DA]/15'
                    : isZipping
                    ? 'bg-[#95935f] text-[#FCF0DA] cursor-wait'
                    : 'bg-[#AEAC78] hover:bg-[#95935f] active:scale-[0.99] text-[#FCF0DA] shadow-[#AEAC78]/25'
                }`}
              >
                {isZipping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Packing ZIP ({zipProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t.resizer.downloadAllBtn} ({doneImages.length})</span>
                  </>
                )}
              </button>
            </div>

            {/* ZIP Progress Bar when actively archiving */}
            {isZipping && (
              <div className="mt-4 pt-3 border-t border-[#4C4541]/15 dark:border-[#FCF0DA]/15">
                <div className="w-full bg-[#ebdcc0] dark:bg-[#38312e] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#AEAC78] h-2.5 rounded-full transition-all duration-200"
                    style={{ width: `${zipProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {images.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#4C4541]/20 dark:border-[#FCF0DA]/20 bg-[#f8ebd5]/40 dark:bg-[#2b2523]/40 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#ebdcc0] dark:bg-[#342e2b] flex items-center justify-center mx-auto text-[#4C4541]/60 dark:text-[#FCF0DA]/60 mb-4">
                <ImageIcon className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-[#4C4541] dark:text-[#FCF0DA] mb-1">
                Queue is Empty
              </h4>
              <p className="text-xs sm:text-sm text-[#4C4541]/70 dark:text-[#FCF0DA]/70 max-w-sm mx-auto">
                {t.resizer.emptyQueue}
              </p>
            </div>
          )}

          {/* Processed Queue Cards */}
          {images.length > 0 && (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {images.map((item) => {
                const savings =
                  item.processedSize !== undefined
                    ? formatPercentageReduction(item.originalSize, item.processedSize)
                    : null;

                const { targetW, targetH } = computeTargetDimensions(
                  item.originalWidth,
                  item.originalHeight,
                  settings
                );

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-[#4C4541]/15 dark:border-[#FCF0DA]/15 bg-[#FCF0DA] dark:bg-[#2c2624] shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:border-[#AEAC78] transition"
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#ebdcc0] dark:bg-[#201c1b] shrink-0 border border-[#4C4541]/15 dark:border-[#FCF0DA]/15 cursor-pointer group"
                      onClick={() => setPreviewModalUrl(item.processedUrl || item.previewUrl)}
                    >
                      <img
                        src={item.processedUrl || item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[#4C4541]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[#FCF0DA]">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Metadata & Transitions */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-sm font-bold text-[#4C4541] dark:text-[#FCF0DA] truncate max-w-[200px] sm:max-w-xs">
                          {item.outputFilename || item.name}
                        </span>
                        {item.status === 'done' && (
                          <span className="p-0.5 rounded-full bg-[#AEAC78]/30 text-[#AEAC78]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.status === 'processing' && (
                          <RefreshCw className="w-3.5 h-3.5 text-[#F2C46A] animate-spin" />
                        )}
                        {item.status === 'error' && (
                          <span className="p-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Dimensions Comparison */}
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#4C4541]/70 dark:text-[#FCF0DA]/70 mt-1 font-mono">
                        <span>
                          {item.originalWidth} × {item.originalHeight}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#AEAC78]" />
                        <span className="font-bold text-[#c68a25] dark:text-[#F2C46A]">
                          {item.targetWidth || targetW} × {item.targetHeight || targetH}
                        </span>
                      </div>

                      {/* File Size Comparison & Savings Badge */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-xs mt-1.5">
                        <span className="text-[#4C4541]/70 dark:text-[#FCF0DA]/70">
                          {formatBytes(item.originalSize)}
                        </span>
                        {item.processedSize !== undefined && (
                          <>
                            <span className="text-[#4C4541]/40 dark:text-[#FCF0DA]/40">➔</span>
                            <span className="font-bold text-[#4C4541] dark:text-[#FCF0DA]">
                              {formatBytes(item.processedSize)}
                            </span>
                            {savings && (
                              <span
                                className={`px-1.5 py-0.5 rounded-md font-bold text-[10px] ${
                                  savings.isReduction
                                    ? 'bg-[#AEAC78]/30 text-[#4C4541] dark:text-[#FCF0DA]'
                                    : 'bg-[#F2C46A]/30 text-[#4C4541] dark:text-[#FCF0DA]'
                                }`}
                              >
                                {savings.label}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'done' && item.processedBlob && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadSingleFile(item.processedBlob!, item.outputFilename || item.name)
                          }
                          title="Download Image"
                          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#f5e5c9] dark:bg-[#38312e] hover:bg-[#F2C46A] hover:text-[#4C4541] text-[#4C4541] dark:text-[#FCF0DA] text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t.resizer.singleDownload}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(item.id)}
                        title="Remove Image"
                        className="p-2 rounded-xl text-[#4C4541]/50 dark:text-[#FCF0DA]/50 hover:text-rose-600 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Lightbox Preview */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-[#4C4541]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden bg-[#2c2624] border border-[#FCF0DA]/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#4C4541]/80 text-[#FCF0DA] hover:bg-[#4C4541] transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Enlarged Preview"
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
