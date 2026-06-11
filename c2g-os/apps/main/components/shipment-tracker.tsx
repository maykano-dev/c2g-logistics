"use client";

import { useEffect, useRef, useState } from "react";
import { Plane, Ship, CheckCircle2, MapPin, X } from "lucide-react";

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

const STAGES_SEA = [
    { min: 0.00, max: 0.05, label: "In transit to Guangzhou Port" },
    { min: 0.05, max: 0.15, label: "Guangzhou Port" },
    { min: 0.15, max: 0.40, label: "Indian Ocean Transit" },
    { min: 0.40, max: 0.70, label: "Rounding Cape" },
    { min: 0.70, max: 0.95, label: "Atlantic Ocean" },
    { min: 0.95, max: 1.01, label: "Arrived at Port" },
];

const STAGES_AIR = [
    { min: 0.00, max: 0.20, label: "Flight Departure" },
    { min: 0.20, max: 0.80, label: "In Air Transit" },
    { min: 0.80, max: 0.95, label: "Approaching Accra" },
    { min: 0.95, max: 1.01, label: "Landed in Ghana" },
];

function calculateProgress(startDateISO: string, durationDays: number) {
  if (!startDateISO) return 0;
  const start = new Date(startDateISO).getTime();
  const totalMs = durationDays * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - start;
  return Math.min(1, Math.max(0, elapsed / totalMs));
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function interpolatePosition(progress: number, route: any[]) {
  const thresholds = route.map((_, i) => i / (route.length - 1));
  if (progress <= 0) return { lat: route[0].lat, lng: route[0].lng, idx: 0 };
  if (progress >= 1) return { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng, idx: route.length - 2 };
  for (let i = 0; i < route.length - 1; i++) {
      const t1 = thresholds[i] || 0;
      const t2 = thresholds[i + 1] || 1;
      if (progress >= t1 && progress <= t2) {
          const segT = (progress - t1) / (t2 - t1);
          return { lat: lerp(route[i].lat, route[i + 1].lat, segT), lng: lerp(route[i].lng, route[i + 1].lng, segT), idx: i };
      }
  }
  return { lat: route[route.length - 1].lat, lng: route[route.length - 1].lng, idx: route.length - 2 };
}

function calculateHeading(from: any, to: any) {
  const dLng = to.lng - from.lng; const dLat = to.lat - from.lat;
  return ((Math.atan2(dLng, dLat) * (180 / Math.PI)) + 360) % 360;
}

function getLocationName(progress: number, route: any[]) {
  const thresholds = route.map((_, i) => i / (route.length - 1));
  for (let i = 0; i < route.length - 1; i++) {
      const t1 = thresholds[i] || 0;
      const t2 = thresholds[i + 1] || 1;
      if (progress >= t1 && progress <= t2) {
          return (progress - t1) / (t2 - t1) < 0.5 ? route[i].name : route[i + 1].name;
      }
  }
  return route[route.length - 1].name;
}

function getCountdown(startDateISO: string, durationDays: number) {
  const start = new Date(startDateISO).getTime();
  const arrivalMs = start + (durationDays * 24 * 60 * 60 * 1000);
  const remaining = arrivalMs - Date.now();
  if (remaining <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, arrived: true };
  const totalSecs = Math.floor(remaining / 1000);
  return { days: Math.floor(totalSecs / 86400), hours: Math.floor((totalSecs % 86400) / 3600), mins: Math.floor((totalSecs % 3600) / 60), secs: totalSecs % 60, arrived: false };
}

function pad2(n: number) { return String(n).padStart(2, '0'); }

export function ShipmentTracker({
  trackingId,
  shippingModeStr,
  shipmentStartDate,
  onClose
}: {
  trackingId: string,
  shippingModeStr: string,
  shipmentStartDate: string,
  onClose: () => void
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapObj, setMapObj] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Calculating...");
  const [locationName, setLocationName] = useState("...");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0, arrived: false });

  const modeLower = shippingModeStr.toLowerCase();
  const isAir = modeLower.includes('air') || modeLower.includes('express') || modeLower.includes('normal');
  let duration = isAir ? (modeLower.includes('express') ? 7 : 14) : 60; 
  let formattedMode = shippingModeStr;
  if (modeLower === 'express') formattedMode = 'Air Express';
  else if (modeLower === 'normal') formattedMode = 'Air Normal';
  else if (modeLower === 'sea') formattedMode = 'Sea Shipping';
  else if (!formattedMode) formattedMode = isAir ? 'Air Freight' : 'Sea Freight';
  
  const match = shippingModeStr.match(/(\d+)\s*(?:-|to)?\s*(\d*)\s*day/i);
  if (match) duration = parseInt(match[2] || match[1] || "14");

  const activeRoute = isAir ? ROUTE_AIR : ROUTE_SEA;
  const activeStages = isAir ? STAGES_AIR : STAGES_SEA;
  const glowColor = isAir ? '#3b82f6' : '#10b981';

  // Format Dates
  const startDateStr = new Date(shipmentStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const arrivalDateStr = new Date(new Date(shipmentStartDate).getTime() + duration * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    // Dynamically load Leaflet specifically for this component to avoid SSR errors
    let mapInstance: any = null;
    let shipMarker: any = null;
    let passedPath: any = null;
    let remainingPath: any = null;
    let animInterval: any = null;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current) return;

      // Dark theme map tiles by default for our design
      const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      
      mapInstance = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: true, dragging: true });
      L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(mapInstance);

      passedPath = L.polyline([], { color: '#ef4444', weight: 4, opacity: 1.0, dashArray: '10 8', lineJoin: 'round' }).addTo(mapInstance);
      remainingPath = L.polyline([], { color: glowColor, weight: 4, opacity: 0.8, dashArray: '10 8', lineJoin: 'round' }).addTo(mapInstance);
      
      const maxBounds = L.latLngBounds(activeRoute.map(p => [p.lat, p.lng]));
      mapInstance.fitBounds(maxBounds, { paddingTopLeft: [50, 100], paddingBottomRight: [50, 50] });

      const d3PlaneSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.5)); transform: scale(1.3);"><defs><linearGradient id="planeGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#93c5fd;stop-opacity:1" /><stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" /></linearGradient></defs><path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" fill="url(#planeGrad)" stroke="#1e3a8a" stroke-width="0.3" stroke-linejoin="round"/></svg>`;
      const shipSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:100%; height:100%; filter: drop-shadow(0px 6px 8px rgba(0,0,0,0.5)); transform: scale(1.3); color: #10b981;"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 10v4M12 2v3"/></svg>`;

      const markerEl = `
        <div style="display: flex; align-items: center; justify-content: center; width: 80px; height: 80px;">
           <div id="ship-icon-el" style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; z-index: 2;">
              ${isAir ? `<div style="width:50px; height:50px;">${d3PlaneSVG}</div>` : `<div style="width:50px; height:50px;">${shipSVG}</div>`}
           </div>
        </div>
      `;

      const startNode = activeRoute[0] || { lat: 0, lng: 0 };
      shipMarker = L.marker([startNode.lat, startNode.lng], {
          icon: L.divIcon({ className: '', html: markerEl, iconSize: [80, 80], iconAnchor: [40, 40] }),
          zIndexOffset: 1000
      }).addTo(mapInstance);

      setMapObj(mapInstance);

      let lastPos: any = null;

      animInterval = setInterval(() => {
        const p = calculateProgress(shipmentStartDate, duration);
        setProgress(p);
        
        const posData = interpolatePosition(p, activeRoute);
        const pos = { lat: posData.lat, lng: posData.lng };
        
        const stage = activeStages.find(s => p >= s.min && p < s.max) || activeStages[activeStages.length - 1];
        setStatus(stage?.label || "Unknown");
        setLocationName(getLocationName(p, activeRoute));
        setCountdown(getCountdown(shipmentStartDate, duration));

        if (p >= 1) {
          clearInterval(animInterval);
          const finalNode = activeRoute[activeRoute.length - 1] || { lat: 0, lng: 0 };
        const finalLatLng: [number, number] = [finalNode.lat, finalNode.lng];
          shipMarker.setLatLng(finalLatLng);
          passedPath.setLatLngs(activeRoute.map(pt => [pt.lat, pt.lng]));
          remainingPath.setLatLngs([]);
          mapInstance.setView(finalLatLng, 8, {animate:true});
          setStatus("Arrived at Destination");
          return;
        }

        shipMarker.setLatLng([pos.lat, pos.lng]);
        const passedCoords = activeRoute.slice(0, posData.idx + 1).map(pt => [pt.lat, pt.lng]);
        passedCoords.push([pos.lat, pos.lng]);
        passedPath.setLatLngs(passedCoords);

        const remainingCoords = [[pos.lat, pos.lng]];
        const remainingEnd = activeRoute.slice(posData.idx + 1).map(pt => [pt.lat, pt.lng]);
        remainingPath.setLatLngs(remainingCoords.concat(remainingEnd));

        if (activeRoute.length > 1) {
            const currentSegment = activeRoute[posData.idx];
            const nextSegment = activeRoute[posData.idx + 1] || activeRoute[posData.idx];
            let heading = 0;
            if (currentSegment && nextSegment && currentSegment !== nextSegment) {
                heading = calculateHeading(currentSegment, nextSegment);
            } else if (lastPos) {
                heading = calculateHeading(lastPos, pos);
            }
            const el = document.getElementById('ship-icon-el');
            if (el && isAir) { 
                el.style.transform = `rotate(${heading}deg)`; 
                el.style.transition = 'transform 1s ease'; 
            }
        }
        lastPos = pos;

      }, 100);
    };

    initMap();

    return () => {
      if (animInterval) clearInterval(animInterval);
      if (mapInstance) mapInstance.remove();
    };
  }, [shipmentStartDate, duration, isAir, activeRoute, activeStages]);

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-4xl bg-black border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isAir ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
              {isAir ? <Plane className="w-6 h-6" /> : <Ship className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground leading-none mb-1">Live Tracking</h3>
              <p className="text-sm font-mono text-muted-foreground">{trackingId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="p-4 sm:p-6 border-b border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAir ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isAir ? 'bg-blue-500' : 'bg-green-500'}`}></span>
              </div>
              <span className="font-bold text-lg">{status}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium border border-border shrink-0">
              <MapPin className={`w-4 h-4 ${isAir ? 'text-blue-500' : 'text-green-500'}`} />
              {locationName}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-[400px] sm:h-[500px] relative bg-secondary/50">
          <div ref={mapRef} className="w-full h-full z-0" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {/* Progress Card */}
          <div className="bg-card p-6">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Journey Progress</p>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-3">
              <div className={`h-full transition-all duration-1000 ${isAir ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Departed</span>
              <span className="font-bold text-2xl">{Math.round(progress * 100)}%</span>
              <span className="font-medium text-muted-foreground">Arrival</span>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="bg-card p-6">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Estimated Arrival In</p>
            {countdown.arrived ? (
              <div className="flex items-center gap-3 text-green-500 py-2">
                <CheckCircle2 className="w-8 h-8" />
                <span className="text-2xl font-bold">Shipment Arrived!</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-secondary/50 border border-border rounded-lg p-2">
                  <span className="block text-2xl font-bold">{pad2(countdown.days)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Days</span>
                </div>
                <div className="bg-secondary/50 border border-border rounded-lg p-2">
                  <span className="block text-2xl font-bold">{pad2(countdown.hours)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Hours</span>
                </div>
                <div className="bg-secondary/50 border border-border rounded-lg p-2">
                  <span className="block text-2xl font-bold">{pad2(countdown.mins)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mins</span>
                </div>
                <div className="bg-secondary/50 border border-border rounded-lg p-2">
                  <span className="block text-2xl font-bold">{pad2(countdown.secs)}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Secs</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Meta */}
        <div className="bg-card p-4 border-t border-border flex flex-col sm:flex-row justify-between text-xs text-muted-foreground">
           <span>Started: <strong className="text-foreground">{startDateStr}</strong></span>
           <span>ETA: <strong className="text-foreground">{arrivalDateStr}</strong></span>
        </div>
      </div>
    </div>
  );
}
