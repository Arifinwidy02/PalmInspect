'use client';

import dynamic from 'next/dynamic';
import { useMemo, useSyncExternalStore } from 'react';
import { useThemeStore } from '@/store';
import type { TreeDetection } from '@/types';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((m) => m.ZoomControl),
  { ssr: false }
);

import { DrawingTools } from './DrawingTools';
import { DetectionMarkers } from './DetectionMarkers';

interface MainMapProps {
  center?: [number, number];
  zoom?: number;
  detections: TreeDetection[];
  isPaid: boolean;
}

const DEFAULT_CENTER: [number, number] = [-2.5, 111.5];
const DEFAULT_ZOOM = 15;

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

function useResolvedTheme() {
  const theme = useThemeStore((s) => s.theme);

  const systemDark = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false
  );

  return useMemo(() => {
    if (theme === 'dark') return 'dark' as const;
    if (theme === 'light') return 'light' as const;
    return systemDark ? ('dark' as const) : ('light' as const);
  }, [theme, systemDark]);
}

export function MainMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  detections,
  isPaid,
}: MainMapProps) {
  const resolvedTheme = useResolvedTheme();
  const tileUrl = resolvedTheme === 'dark' ? DARK_TILES : LIGHT_TILES;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full z-10"
        zoomControl={false}
        key={tileUrl}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
        <ZoomControl position="bottomright" />
        <DrawingTools />
        <DetectionMarkers detections={detections} isPaid={isPaid} />
      </MapContainer>

      {!isPaid && detections.length > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-yellow-600/90 text-yellow-100 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-yellow-500/50">
          Preview mode — positions are approximate
        </div>
      )}
    </div>
  );
}
