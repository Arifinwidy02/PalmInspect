'use client';

import { useCallback, useRef, useState } from 'react';

interface HeroUploaderProps {
  onUpload: (file: File) => void;
  hasImage: boolean;
}

export function HeroUploader({ onUpload, hasImage }: HeroUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && isValidFile(file)) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isValidFile(file)) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  if (hasImage) return null;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        z-30 flex flex-col items-center justify-center gap-4
        w-[420px] max-w-[90vw] p-10 rounded-2xl border-2 border-dashed
        cursor-pointer transition-all duration-300 backdrop-blur-xl
        ${isDragging
          ? 'border-emerald-400 bg-emerald-500/10 scale-105'
          : 'border-muted-foreground/40 bg-card/70 hover:border-muted-foreground/60 hover:bg-card/80'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.tif,.tiff"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Drop your drone image here
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Supports JPG, PNG, and GeoTIFF
        </p>
      </div>

      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
        No account required — try it free
      </span>
    </div>
  );
}

function isValidFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/tif'];
  const validExts = ['.jpg', '.jpeg', '.png', '.tif', '.tiff'];
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return validTypes.includes(file.type) || validExts.includes(ext);
}
