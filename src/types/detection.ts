import type { TreeDetection, AOI } from './project';

export interface DetectionRequest {
  imageUrl: string;
  aoi: AOI | null;
}

export interface DetectionResponse {
  success: boolean;
  projectId: string;
  detections: TreeDetection[];
  totalCount: number;
  processingTimeMs: number;
  error?: string;
}
