import type { DetectionResponse, TreeDetection, AOI } from '@/types';

function generateMockDetections(aoi: AOI | null, count: number = 42): TreeDetection[] {
  if (!aoi || aoi.coordinates.length === 0) {
    const lat = -2.5 + Math.random() * 0.1;
    const lng = 111.5 + Math.random() * 0.1;
    return Array.from({ length: count }, (_, i) => ({
      id: `tree_${Date.now()}_${i}`,
      lat: lat + (Math.random() - 0.5) * 0.05,
      lng: lng + (Math.random() - 0.5) * 0.05,
      confidence: 0.75 + Math.random() * 0.25,
      canopyDiameter: 3 + Math.random() * 8,
      healthStatus: (['healthy', 'healthy', 'healthy', 'stressed', 'dead'] as const)[
        Math.floor(Math.random() * 5)
      ],
    }));
  }

  const lats = aoi.coordinates.map((c) => c.lat);
  const lngs = aoi.coordinates.map((c) => c.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const detections: TreeDetection[] = [];
  const gridSize = Math.ceil(Math.sqrt(count));
  const latStep = (maxLat - minLat) / (gridSize + 1);
  const lngStep = (maxLng - minLng) / (gridSize + 1);

  let idx = 0;
  for (let row = 1; row <= gridSize && idx < count; row++) {
    for (let col = 1; col <= gridSize && idx < count; col++) {
      const inAoi = Math.random() > 0.15;
      if (!inAoi) continue;

      detections.push({
        id: `tree_${Date.now()}_${idx}`,
        lat: minLat + row * latStep + (Math.random() - 0.5) * latStep * 0.6,
        lng: minLng + col * lngStep + (Math.random() - 0.5) * lngStep * 0.6,
        confidence: 0.75 + Math.random() * 0.25,
        canopyDiameter: 3 + Math.random() * 8,
        healthStatus: (['healthy', 'healthy', 'healthy', 'stressed', 'dead'] as const)[
          Math.floor(Math.random() * 5)
        ],
      });
      idx++;
    }
  }

  return detections;
}

export async function runDetection(
  imageUrl: string,
  aoi: AOI | null,
  projectId: string
): Promise<DetectionResponse> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000));

  const detections = generateMockDetections(aoi, aoi ? 35 + Math.floor(Math.random() * 30) : 42);

  return {
    success: true,
    projectId,
    detections,
    totalCount: detections.length,
    processingTimeMs: 1200 + Math.floor(Math.random() * 800),
  };
}
