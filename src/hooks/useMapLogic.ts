'use client';

import { useCallback } from 'react';
import { useProjectStore } from '@/store';
import type { TreeDetection, AOI } from '@/types';

export function useMapLogic() {
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const setAOI = useProjectStore((s) => s.setAOI);
  const projects = useProjectStore((s) => s.projects);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleAOICreated = useCallback(
    (aoi: AOI) => {
      if (!currentProjectId) return;
      setAOI(currentProjectId, aoi);
    },
    [currentProjectId, setAOI]
  );

  const handleAOIEdited = useCallback(
    (aoi: AOI) => {
      if (!currentProjectId) return;
      setAOI(currentProjectId, aoi);
    },
    [currentProjectId, setAOI]
  );

  const handleAOIDeleted = useCallback(() => {
    // AOI deletion is handled by Leaflet Draw internally
  }, []);

  const getStatusColor = (status: string): string => {
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
  };

  const getWatermarkOffsets = (detections: TreeDetection[]): TreeDetection[] => {
    if (currentProject?.isPaid) return detections;
    return detections.map((d) => ({
      ...d,
      lat: d.lat + (Math.random() - 0.5) * 0.0005,
      lng: d.lng + (Math.random() - 0.5) * 0.0005,
    }));
  };

  return {
    currentProject,
    detections: currentProject ? getWatermarkOffsets(currentProject.detections) : [],
    aoi: currentProject?.aoi ?? null,
    isPaid: currentProject?.isPaid ?? false,
    imageUrl: currentProject?.imageUrl ?? null,
    handleAOICreated,
    handleAOIEdited,
    handleAOIDeleted,
    getStatusColor,
  };
}
