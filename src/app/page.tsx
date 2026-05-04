'use client';

import { useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useDetection, useMapLogic, usePayment } from '@/hooks';
import { useProjectStore, useAuthStore } from '@/store';
import { HeroUploader, QuickControl, AuthModal } from '@/components/shared';
import { generateCSV, generateGeoJSON, downloadFile } from '@/utils';

const MainMap = dynamic(() => import('@/components/map/MainMap').then((m) => m.MainMap), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export default function WorkspacePage() {
  const { handleImageUpload, startDetection, isProcessing, error: detectionError } = useDetection();
  const { currentProject, detections, isPaid, imageUrl } = useMapLogic();
  const { initiatePayment, confirmPayment } = usePayment();

  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const syncGuestProjectsToUser = useProjectStore((s) => s.syncGuestProjectsToUser);
  const user = useAuthStore((s) => s.user);

  // Handoff: sync guest projects when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      syncGuestProjectsToUser(user.id);
    }
  }, [isAuthenticated, user, syncGuestProjectsToUser]);

  // Listen for AOI events from DrawingTools
  useEffect(() => {
    const handleAOICreated = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && currentProjectId) {
        useProjectStore.getState().setAOI(currentProjectId, detail);
      }
    };

    const handleAOIEdited = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && currentProjectId) {
        useProjectStore.getState().setAOI(currentProjectId, detail);
      }
    };

    window.addEventListener('aoi-created', handleAOICreated);
    window.addEventListener('aoi-edited', handleAOIEdited);

    return () => {
      window.removeEventListener('aoi-created', handleAOICreated);
      window.removeEventListener('aoi-edited', handleAOIEdited);
    };
  }, [currentProjectId]);

  const handleUpload = useCallback(
    (file: File) => {
      handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleRunDetection = useCallback(() => {
    if (!currentProjectId || !imageUrl) return;
    const aoi = currentProject?.aoi ?? null;
    startDetection(currentProjectId, imageUrl, aoi);
  }, [currentProjectId, imageUrl, currentProject, startDetection]);

  const handleExport = useCallback(async () => {
    if (!currentProject) return;

    if (!isAuthenticated) {
      openAuthModal('login', 'export your results');
      return;
    }

    if (!isPaid) {
      const result = await initiatePayment(currentProjectId!);
      if (result) {
        await confirmPayment(currentProjectId!, result.token);
      }
      return;
    }

    const name = currentProject.name || 'palm-inspection';
    const csv = generateCSV(currentProject.detections, name);
    const geojson = generateGeoJSON(currentProject.detections, name);

    downloadFile(csv, `${name}-trees.csv`, 'text/csv');
    setTimeout(() => {
      downloadFile(geojson, `${name}-trees.geojson`, 'application/json');
    }, 200);
  }, [currentProject, isAuthenticated, isPaid, openAuthModal, initiatePayment, confirmPayment, currentProjectId]);

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden">
      {/* Full-page Map */}
      <MainMap
        center={[-2.5, 111.5]}
        zoom={15}
        detections={detections}
        isPaid={isPaid}
      />

      {/* Hero Uploader (shown when no image) */}
      <HeroUploader onUpload={handleUpload} hasImage={!!imageUrl} />

      {/* Quick Control Bar */}
      <QuickControl
        hasImage={!!imageUrl}
        isProcessing={isProcessing}
        detections={detections}
        isPaid={isPaid}
        onRunDetection={handleRunDetection}
        onExport={handleExport}
      />

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">Analyzing drone imagery...</p>
              <p className="text-sm text-muted-foreground mt-1">Running AI palm detection</p>
            </div>
          </div>
        </div>
      )}

      {/* Detection error */}
      {detectionError && (
        <div className="absolute top-4 right-4 z-40 bg-red-900/90 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm max-w-xs">
          {detectionError}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}
