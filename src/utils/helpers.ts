import type { TreeDetection } from '@/types';

export function generateCSV(detections: TreeDetection[], projectName: string): string {
  const header = 'id,latitude,longitude,confidence,canopy_diameter_m,health_status';
  const rows = detections.map(
    (d) =>
      `${d.id},${d.lat},${d.lng},${d.confidence.toFixed(4)},${d.canopyDiameter ?? ''},${d.healthStatus ?? ''}`
  );
  return [header, ...rows].join('\n');
}

export function generateGeoJSON(detections: TreeDetection[], projectName: string): string {
  const features = detections.map((d) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [d.lng, d.lat],
    },
    properties: {
      id: d.id,
      confidence: d.confidence,
      canopyDiameter: d.canopyDiameter,
      healthStatus: d.healthStatus,
    },
  }));

  return JSON.stringify(
    {
      type: 'FeatureCollection',
      features,
      metadata: {
        project: projectName,
        totalTrees: detections.length,
        generatedAt: new Date().toISOString(),
      },
    },
    null,
    2
  );
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const getURL = () => {
let url = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
  : 'http://localhost:3000';
  
  // Pastikan menyertakan http/https
  url = url.includes('http') ? url : `https://${url}`;
  // Pastikan diakhiri dengan /
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};