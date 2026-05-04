'use client';

import { Button } from './Button';
import type { TreeDetection } from '@/types';

interface QuickControlProps {
  hasImage: boolean;
  isProcessing: boolean;
  detections: TreeDetection[];
  isPaid: boolean;
  onRunDetection: () => void;
  onExport: () => void;
}

export function QuickControl({
  hasImage,
  isProcessing,
  detections,
  isPaid,
  onRunDetection,
  onExport,
}: QuickControlProps) {
  if (!hasImage) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        {detections.length > 0 ? (
          <span>
            <span className="text-emerald-400 font-semibold">{detections.length}</span> trees detected
          </span>
        ) : (
          <span>Ready to analyze</span>
        )}
      </div>

      <Button
        variant={detections.length > 0 ? 'secondary' : 'primary'}
        size="sm"
        onClick={onRunDetection}
        isLoading={isProcessing}
      >
        {detections.length > 0 ? 'Re-run' : 'Run Detection'}
      </Button>

      {detections.length > 0 && (
        <Button
          variant={isPaid ? 'success' : 'primary'}
          size="sm"
          onClick={onExport}
        >
          {isPaid ? 'Export' : 'Unlock Export'}
        </Button>
      )}
    </div>
  );
}
