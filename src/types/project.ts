export interface LatLng {
  lat: number;
  lng: number;
}

export interface AOI {
  type: 'Polygon';
  coordinates: LatLng[];
}

export interface TreeDetection {
  id: string;
  lat: number;
  lng: number;
  confidence: number;
  canopyDiameter?: number;
  healthStatus?: 'healthy' | 'stressed' | 'dead';
}

export interface Project {
  id: string;
  userId: string | null;
  name: string;
  imageUrl: string | null;
  imageFileName: string | null;
  aoi: AOI | null;
  detections: TreeDetection[];
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  imageFile: File | null;
  imageUrl: string | null;
}
