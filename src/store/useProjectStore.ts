import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, TreeDetection, AOI } from '@/types';

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  isGuest: boolean;

  createProject: (name: string) => string;
  setCurrentProject: (projectId: string) => void;
  uploadImage: (projectId: string, imageUrl: string, fileName: string) => void;
  setAOI: (projectId: string, aoi: AOI) => void;
  setDetections: (projectId: string, detections: TreeDetection[]) => void;
  setProjectStatus: (projectId: string, status: Project['status']) => void;
  markProjectAsPaid: (projectId: string) => void;
  assignProjectToUser: (projectId: string, userId: string) => void;
  getCurrentProject: () => Project | undefined;
  deleteProject: (projectId: string) => void;
  syncGuestProjectsToUser: (userId: string) => void;
}

function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      isGuest: true,

      createProject: (name: string) => {
        const id = generateId();
        const project: Project = {
          id,
          userId: null,
          name,
          imageUrl: null,
          imageFileName: null,
          aoi: null,
          detections: [],
          status: 'idle',
          isPaid: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          projects: [...state.projects, project],
          currentProjectId: id,
        }));
        return id;
      },

      setCurrentProject: (projectId) =>
        set({ currentProjectId: projectId }),

      uploadImage: (projectId, imageUrl, fileName) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, imageUrl, imageFileName: fileName, status: 'uploading' as const, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      setAOI: (projectId, aoi) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, aoi, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      setDetections: (projectId, detections) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, detections, status: 'completed' as const, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      setProjectStatus: (projectId, status) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p
          ),
        })),

      markProjectAsPaid: (projectId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, isPaid: true, updatedAt: new Date().toISOString() } : p
          ),
        })),

      assignProjectToUser: (projectId, userId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, userId, updatedAt: new Date().toISOString() } : p
          ),
        })),

      getCurrentProject: () => {
        const state = get();
        return state.projects.find((p) => p.id === state.currentProjectId);
      },

      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProjectId: state.currentProjectId === projectId ? null : state.currentProjectId,
        })),

      syncGuestProjectsToUser: (userId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            !p.userId ? { ...p, userId, updatedAt: new Date().toISOString() } : p
          ),
          isGuest: false,
        })),
    }),
    {
      name: 'palminspect-projects',
    }
  )
);
