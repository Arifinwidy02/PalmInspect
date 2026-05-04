'use client';

import { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TreeDetection } from '@/types';

interface DetectionMarkersProps {
  detections: TreeDetection[];
  isPaid: boolean;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
      return '#22c55e';
    case 'stressed':
      return '#eab308';
    case 'dead':
      return '#ef4444';
    default:
      return '#22c55e';
  }
}

export function DetectionMarkers({ detections, isPaid }: DetectionMarkersProps) {
  const map = useMap();
  const markerGroup = useMemo(() => L.featureGroup(), []);

  useEffect(() => {
    markerGroup.clearLayers();

    if (detections.length === 0) return;

    detections.forEach((detection) => {
      const color = getStatusColor(detection.healthStatus ?? 'healthy');
      const icon = L.divIcon({
        className: 'custom-tree-marker',
        html: `
          <div style="
            width: ${detection.canopyDiameter ? Math.max(8, detection.canopyDiameter * 2) : 10}px;
            height: ${detection.canopyDiameter ? Math.max(8, detection.canopyDiameter * 2) : 10}px;
            border-radius: 50%;
            background: ${color};
            border: 1.5px solid ${isPaid ? color : 'rgba(255,255,255,0.3)'};
            opacity: ${isPaid ? 0.85 : 0.5};
            box-shadow: 0 0 6px ${color}44;
            cursor: pointer;
            transition: all 0.2s;
            filter: ${isPaid ? 'none' : 'blur(1px)'};
          "></div>
        `,
        iconSize: [
          detection.canopyDiameter ? Math.max(10, detection.canopyDiameter * 2 + 2) : 12,
          detection.canopyDiameter ? Math.max(10, detection.canopyDiameter * 2 + 2) : 12,
        ],
        iconAnchor: [
          (detection.canopyDiameter ? Math.max(10, detection.canopyDiameter * 2 + 2) : 12) / 2,
          (detection.canopyDiameter ? Math.max(10, detection.canopyDiameter * 2 + 2) : 12) / 2,
        ],
      });

      const marker = L.marker([detection.lat, detection.lng], { icon });

      const confidencePct = Math.round(detection.confidence * 100);
      marker.bindTooltip(
        `<div style="font-family:monospace;font-size:12px;">
          <div>ID: ${detection.id.slice(-6)}</div>
          <div>Confidence: ${confidencePct}%</div>
          ${detection.canopyDiameter ? `<div>Canopy: ${detection.canopyDiameter.toFixed(1)}m</div>` : ''}
          ${detection.healthStatus ? `<div style="color:${getStatusColor(detection.healthStatus)}">Health: ${detection.healthStatus}</div>` : ''}
          ${!isPaid ? '<div style="color:#f59e0b;">⚠ Approximate</div>' : ''}
        </div>`,
        { direction: 'top', offset: [0, -8], opacity: 0.95 }
      );

      markerGroup.addLayer(marker);
    });

    markerGroup.addTo(map);

    return () => {
      map.removeLayer(markerGroup);
    };
  }, [detections, map, markerGroup, isPaid]);

  return null;
}
