'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export function DrawingTools() {
  const map = useMap();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let L: typeof import('leaflet') | null = null;
    let drawControl: import('leaflet').Control.Draw | null = null;

    const init = async () => {
      // Dynamic import of leaflet and leaflet-draw for SSR safety
      const leafletModule = await import('leaflet');
      L = leafletModule.default ?? leafletModule;
      await import('leaflet-draw');
      await import('leaflet-draw/dist/leaflet.draw.css');

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const DrawControl = L.Control.Draw as new (options: L.Control.DrawConstructorOptions) => L.Control.Draw;
      drawControl = new DrawControl({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: '#10b981',
              weight: 2,
              fillOpacity: 0.15,
              fillColor: '#10b981',
            },
          },
          rectangle: {
            shapeOptions: {
              color: '#10b981',
              weight: 2,
              fillOpacity: 0.15,
              fillColor: '#10b981',
            },
          },
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems,
          edit: {
            selectedPathOptions: {
              color: '#f59e0b',
              weight: 3,
            } as L.PathOptions,
          },
        },
      });

      map.addControl(drawControl);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on((L.Draw as any).Event.CREATED, (e: any) => {
        const layer = e.layer as L.Polygon;
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);

        const latlngs = layer.getLatLngs();
        const coordinates = extractCoordinates(latlngs);

        window.dispatchEvent(
          new CustomEvent('aoi-created', {
            detail: { type: 'Polygon' as const, coordinates },
          })
        );
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on((L.Draw as any).Event.EDITED, (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: L.Layer) => {
          const latlngs = (layer as L.Polygon).getLatLngs();
          const coordinates = extractCoordinates(latlngs);

          window.dispatchEvent(
            new CustomEvent('aoi-edited', {
              detail: { type: 'Polygon' as const, coordinates },
            })
          );
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on((L.Draw as any).Event.DELETED, () => {
        window.dispatchEvent(new CustomEvent('aoi-deleted', { detail: null }));
      });
    };

    init();

    return () => {
      if (drawControl) {
        map.removeControl(drawControl);
      }
    };
  }, [map]);

  return null;
}

function extractCoordinates(latlngs: unknown): { lat: number; lng: number }[] {
  const flatten = (arr: unknown): { lat: number; lng: number }[] => {
    if (!Array.isArray(arr)) return [];
    if (arr.length > 0 && typeof (arr[0] as Record<string, unknown>)?.lat === 'number') {
      return (arr as Array<{ lat: number; lng: number }>).map((ll) => ({ lat: ll.lat, lng: ll.lng }));
    }
    return arr.flatMap(flatten);
  };
  return flatten(latlngs);
}
