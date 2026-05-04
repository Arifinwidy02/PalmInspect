'use client';

import { useState, useCallback } from 'react';
import { useProjectStore } from '@/store';
import { runDetection } from '@/services/ai-api';
import type { AOI } from '@/types';

export function useDetection() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useProjectStore((s) => s.createProject);
  const uploadImage = useProjectStore((s) => s.uploadImage);
  const setProjectStatus = useProjectStore((s) => s.setProjectStatus);
  const setDetections = useProjectStore((s) => s.setDetections);
  const setAOI = useProjectStore((s) => s.setAOI);

  const handleImageUpload = useCallback(
    (file: File): string => {
      const projectName = file.name.replace(/\.[^/.]+$/, '');
      const projectId = createProject(projectName);

      const imageUrl = URL.createObjectURL(file);
      uploadImage(projectId, imageUrl, file.name);

      return projectId;
    },
    [createProject, uploadImage]
  );

  const startDetection = useCallback(
    async (projectId: string, imageUrl: string, aoi: AOI | null) => {
      setIsProcessing(true);
      setError(null);
      setProjectStatus(projectId, 'processing');

      try {
        const result = await runDetection(imageUrl, aoi, projectId);
        if (result.success) {
          setDetections(projectId, result.detections);
        } else {
          setError(result.error ?? 'Detection failed');
          setProjectStatus(projectId, 'error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProjectStatus(projectId, 'error');
      } finally {
        setIsProcessing(false);
      }
    },
    [setProjectStatus, setDetections]
  );

  return {
    isProcessing,
    error,
    setError,
    handleImageUpload,
    startDetection,
  };
}
