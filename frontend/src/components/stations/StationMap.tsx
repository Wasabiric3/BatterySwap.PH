'use client';

import { useEffect, useRef } from 'react';

interface Station {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: 'open' | 'busy' | 'full';
  availableSlots: number;
  totalSlots: number;
}

interface StationMapProps {
  stations: Station[];
  onStationSelect?: (id: number) => void;
  selectedStationId?: number | null;
  userLocation?: { lat: number; lng: number } | null;
}

const STATUS_COLOR: Record<string, string> = {
  open: '#00C48C',
  busy: '#F5C400',
  full: '#FF4757',
};

export function StationMap({ stations, onStationSelect, selectedStationId, userLocation }: StationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(containerRef.current!, {
        center: [14.5486, 121.0483],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

      mapRef.current = map;

      // Add station markers
      stations.forEach((station) => {
        const color = STATUS_COLOR[station.status];
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #080808;box-shadow:0 0 0 3px ${color}44;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([station.lat, station.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="color:#fff;min-width:160px;">
              <p style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px;">${station.name}</p>
              <p style="font-size:10px;color:#888;margin:0 0 6px;">${station.address}</p>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:9px;font-weight:700;text-transform:uppercase;color:${color};background:${color}22;padding:2px 6px;border-radius:99px;">${station.status}</span>
                <span style="font-size:10px;color:#666;">${station.availableSlots}/${station.totalSlots} slots</span>
              </div>
            </div>
          `);

        marker.on('click', () => onStationSelect?.(station.id));
        markersRef.current.push({ id: station.id, marker });
      });

      // User location marker
      if (userLocation) {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#F5C400;border:2px solid #080808;box-shadow:0 0 0 4px rgba(245,196,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(map)
          .bindPopup('<div style="color:#fff;font-size:11px;">Your location</div>');
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to selected station
  useEffect(() => {
    if (!mapRef.current || !selectedStationId) return;
    const station = stations.find((s) => s.id === selectedStationId);
    if (station) {
      mapRef.current.flyTo([station.lat, station.lng], 16, { duration: 0.8 });
      const entry = markersRef.current.find((m) => m.id === selectedStationId);
      entry?.marker.openPopup();
    }
  }, [selectedStationId, stations]);

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden border border-border">
      <style>{`
        .leaflet-popup-content-wrapper {
          background:#111 !important;border:1px solid #222 !important;
          border-radius:12px !important;box-shadow:0 4px 24px rgba(0,0,0,.6) !important;
        }
        .leaflet-popup-tip { background:#111 !important; }
        .leaflet-popup-close-button { color:#666 !important; }
        .leaflet-popup-close-button:hover { color:#fff !important; }
        .leaflet-popup-content { margin:12px !important; }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
