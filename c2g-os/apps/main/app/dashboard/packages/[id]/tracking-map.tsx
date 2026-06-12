'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Route Waypoints ──────────────────────────────────────────────────────────
const ROUTE_SEA = [
  { name: "Guangzhou Port", lat: 23.05, lng: 113.52 },
  { name: "Pearl River", lat: 22.10, lng: 113.80 },
  { name: "South China Sea", lat: 15.0, lng: 113.0 },
  { name: "Coast of Vietnam", lat: 10.0, lng: 110.0 },
  { name: "Natuna Sea", lat: 5.0, lng: 108.0 },
  { name: "Singapore Strait", lat: 1.25, lng: 104.2 },
  { name: "Malacca Strait (South)", lat: 1.6, lng: 103.0 },
  { name: "Malacca Strait (Mid)", lat: 3.0, lng: 100.5 },
  { name: "Malacca Strait (North)", lat: 5.5, lng: 97.5 },
  { name: "Andaman Sea", lat: 6.5, lng: 94.0 },
  { name: "Indian Ocean (East)", lat: 3.0, lng: 85.0 },
  { name: "South of Sri Lanka", lat: 4.0, lng: 80.0 },
  { name: "Arabian Sea (South)", lat: 2.0, lng: 70.0 },
  { name: "Indian Ocean (Equator)", lat: -5.0, lng: 60.0 },
  { name: "Indian Ocean (West)", lat: -15.0, lng: 55.0 },
  { name: "East of Madagascar", lat: -20.0, lng: 52.0 },
  { name: "South-East of Madagascar", lat: -27.0, lng: 50.0 },
  { name: "South of Madagascar", lat: -30.0, lng: 45.0 },
  { name: "East of South Africa", lat: -33.0, lng: 35.0 },
  { name: "South of South Africa", lat: -35.5, lng: 25.0 },
  { name: "Cape of Good Hope", lat: -35.0, lng: 19.0 },
  { name: "West of Cape Town", lat: -33.5, lng: 17.0 },
  { name: "Atlantic (Namibia Coast)", lat: -25.0, lng: 12.0 },
  { name: "Atlantic (Angola Coast)", lat: -10.0, lng: 10.0 },
  { name: "Gulf of Guinea (South)", lat: -2.0, lng: 7.0 },
  { name: "Gulf of Guinea", lat: 2.0, lng: 5.0 },
  { name: "Approaching Tema", lat: 5.0, lng: 1.5 },
  { name: "Tema Anchorage", lat: 5.58, lng: 0.1 },
  { name: "Tema Port, Ghana", lat: 5.64, lng: -0.01 }
];

const ROUTE_AIR = [
  { name: "Guangzhou Airport", lat: 23.39, lng: 113.29 },
  { name: "Over Myanmar", lat: 22.0, lng: 97.0 },
  { name: "Bay of Bengal (North)", lat: 18.0, lng: 88.0 },
  { name: "India Airspace", lat: 17.0, lng: 78.0 },
  { name: "Arabian Sea", lat: 14.0, lng: 65.0 },
  { name: "Horn of Africa", lat: 10.0, lng: 50.0 },
  { name: "Central Africa", lat: 8.0, lng: 30.0 },
  { name: "Approaching West Africa", lat: 7.0, lng: 10.0 },
  { name: "Kotoka Airport, Ghana", lat: 5.60, lng: -0.16 }
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function interpolatePosition(progress: number, route: any[]) {
  const thresholds = route.map((_, i) => i / (route.length - 1));
  if (progress <= 0) return { lat: route[0].lat, lng: route[0].lng, idx: 0 };
  if (progress >= 1) return { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng, idx: route.length - 2 };
  for (let i = 0; i < route.length - 1; i++) {
    const t1 = thresholds[i] ?? 0;
    const t2 = thresholds[i + 1] ?? 1;
    if (progress >= t1 && progress <= t2) {
      const segT = (progress - t1) / (t2 - t1);
      return { lat: lerp(route[i].lat, route[i + 1].lat, segT), lng: lerp(route[i].lng, route[i + 1].lng, segT), idx: i };
    }
  }
  return { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng, idx: route.length - 2 };
}

function calculateHeading(from: any, to: any) {
  const dLng = to.lng - from.lng; 
  const dLat = to.lat - from.lat;
  return ((Math.atan2(dLng, dLat) * (180 / Math.PI)) + 360) % 360;
}

const planeSVG = `<img src="/plane-3d.png" style="width:100%; height:100%; object-fit:contain; filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.5)); transform: scale(1.4) scaleX(-1);" />`;

const shipSVG = `<img src="/ship-3d.png" style="width:100%; height:100%; object-fit:contain; filter: drop-shadow(0px 12px 16px rgba(0,0,0,0.6)); transform: scale(-2.5, 2.5) translateY(10%);" />`;

export default function TrackingMap({ isAir, progress }: { isAir: boolean, progress: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const shipMarkerRef = useRef<L.Marker | null>(null);
  const passedPathRef = useRef<L.Polyline | null>(null);
  const remainingPathRef = useRef<L.Polyline | null>(null);
  const lastPosRef = useRef<any>(null);

  const activeRoute = isAir ? ROUTE_AIR : ROUTE_SEA;
  const glowColor = isAir ? '#3b82f6' : '#10b981';

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    
    // Using a sleek dark theme for premium feel
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    // Initial Paths
    passedPathRef.current = L.polyline([], { color: '#ef4444', weight: 4, opacity: 1.0, dashArray: '8 6', lineJoin: 'round' }).addTo(map);
    remainingPathRef.current = L.polyline([], { color: glowColor, weight: 4, opacity: 0.6, dashArray: '8 6', lineJoin: 'round' }).addTo(map);

    const maxBounds = L.latLngBounds(activeRoute.map(p => [p.lat, p.lng]));
    map.fitBounds(maxBounds, { padding: [50, 50] });

    // Custom Marker
    const iconHtml = `<div style="width:60px; height:60px; display:flex; align-items:center; justify-content:center; transition: transform 0.5s ease;" id="dynamic-transport-icon">${isAir ? planeSVG : shipSVG}</div>`;
    
    const startNode = activeRoute[0] || { lat: 0, lng: 0 };
    shipMarkerRef.current = L.marker([startNode.lat, startNode.lng], {
      icon: L.divIcon({ className: '', html: iconHtml, iconSize: [60, 60], iconAnchor: [30, 30] }),
      zIndexOffset: 1000
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [activeRoute, glowColor, isAir]);

  // Update Progress
  useEffect(() => {
    if (!leafletMapRef.current || !shipMarkerRef.current || !passedPathRef.current || !remainingPathRef.current) return;

    const posData = interpolatePosition(progress, activeRoute);
    const pos = { lat: posData.lat, lng: posData.lng };

    shipMarkerRef.current.setLatLng([pos.lat, pos.lng]);

    // Update trails
    const passedCoords = activeRoute.slice(0, posData.idx + 1).map(p => [p.lat, p.lng]);
    passedCoords.push([pos.lat, pos.lng] as any);
    passedPathRef.current.setLatLngs(passedCoords as any);

    const remainingCoords = [[pos.lat, pos.lng]];
    const remainingEnd = activeRoute.slice(posData.idx + 1).map(p => [p.lat, p.lng]);
    remainingPathRef.current.setLatLngs(remainingCoords.concat(remainingEnd as any) as any);

    // Update Heading
    if (activeRoute.length > 1) {
      const currentSegment = activeRoute[posData.idx];
      const nextSegment = activeRoute[posData.idx + 1] || activeRoute[posData.idx];
      let heading = 0;
      if (currentSegment && nextSegment && currentSegment !== nextSegment) {
        heading = calculateHeading(currentSegment, nextSegment);
      } else if (lastPosRef.current) {
        heading = calculateHeading(lastPosRef.current, pos);
      }
      
      const el = document.getElementById('dynamic-transport-icon');
      if (el) {
        // Since these are 3D isometric images, rotating them dynamically in 2D makes them look like they are banking/diving.
        // We keep them horizontally locked (0deg) so the isometric perspective remains natural as they move along the path.
        el.style.transform = `rotate(0deg)`;
      }
    }

    // Follow the marker
    leafletMapRef.current.panTo([pos.lat, pos.lng], { animate: true, duration: 1.0 });
    
    lastPosRef.current = pos;
  }, [progress, activeRoute, isAir]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
}
