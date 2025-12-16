import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { connect } from 'redux-bundler-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * useEffect -> renders maps
 * useRef -> stores references to DOM w/o re-rendering
 * L -> Leaflet global namespace
 */

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MoRiverMap = connect(
  'selectAuthToken',
  'selectApiRoot',
  ({ authToken, apiRoot }) => {
    const containerRef = useRef(null); // points to div that Leaflet renders map onto
    const instanceRef = useRef(null); // stores Leaflet map instance
    const markerLayerRef = useRef(null); // holds marker

    useEffect(() => {
      if (!containerRef.current || instanceRef.current) return;
      // ^DOM isn't ready yet     ^prevent creating multiple map instances

      const map = L.map(containerRef.current).setView(
        [39.5, -98.35], //lat,long - standard US location
        4 //zoom
      );
      instanceRef.current = map; // ensure access/removal of this map later

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      markerLayerRef.current = L.layerGroup().addTo(map);

      return () => {
        map.remove();
        instanceRef.current = null;
        markerLayerRef.current = null;
      };
    }, []);
    // remove map if component unmounts

    useEffect(() => {
      const map = instanceRef.current;
      const layer = markerLayerRef.current;

      if (!map || !layer) return;

      const testLatitude = 35.4689;
      const testLongitude = -97.52;

      layer.clearLayers();
      L.circleMarker([testLatitude, testLongitude], { radius: 20 }).bindPopup('TEST MARKER').addTo(layer);

      if (!authToken) {
        console.warn('[MoRiverMap] no auth token yet - showing test marker only');
        return;
      }

      const base = apiRoot && typeof apiRoot === 'string' ? apiRoot : 'http://localhost:701';
      const url = `${base}/psapi/moriverLocations?page=0&pageSize=5000`;

      const run = async () => {
        try {
          console.log('[MoRiverMap] fetching:', url);

          const res = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/json',
            },
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error('[MoRiverMap] locations fetch failed', {
              status: res.status,
              url,
              errText: errText.slice(0, 800),
            });
            return;
          }

          const json = await res.json();
          const rows = json?.data?.items || json?.items || [];
          console.log('[MoRiverMap] rows:', rows.length, rows[0]);

          const bounds = [];
          let added = 0;

          (rows || [])
            .filter((r) => {
              const lat = Number(r.startlatitude);
              const lng = Number(r.startlongitude);
              return Number.isFinite(lat) && Number.isFinite(lng) && lat > 0 && lng < 0;
            })
            .slice(0, 100)
            .forEach((r) => {
              const lat = Number(r.startlatitude);
              const lng = Number(r.startlongitude);

              const mrId = r.mrId ?? '';
              const siteId = r.siteId ?? '';
              const fieldOffice = r.fieldOffice ?? r.fieldoffice ?? '';
              const year = r.setdate ? String(r.setdate).slice(0, 4) : '';

              const m = L.marker([lat, lng]);

              m.bindTooltip(
                `<div style="font-size:12px; line-height:1.3">
              <div><b>MRID: </b>${mrId}</div>
              <div><b>Site Id: </b>${siteId}</div>
              <div><b>Office: </b>${fieldOffice}</div>
              <div><b>Year: </b>${year}</div>
              </div>`,
                {
                  sticky: true,
                  direction: 'top',
                  opacity: 0.95,
                }
              );

              m.bindPopup(`
                <div style="min-width:240px; font-family: Arial, sans-serif;">
                <div style="font-size:14px; font-weight:700; margin-bottom:6px;">
                Missouri River Location
                </div>

              <div style="display:grid; grid-template-columns:90px 1fr; gap:4px 8px; font-size:12px;">
              <div style="opacity:0.7;">MRID: </div><div>${mrId}</div>
              <div style="opacity:0.7;">Site Id: </div><div>${siteId}</div>
              <div style="opacity:0.7;">Office: </div><div>${fieldOffice}</div>
              <div style="opacity:0.7;">Year: </div><div>${year}</div>
              </div>
              
              <hr style="margin:8px 0; opacity:0.3;" />
              
              <div style="font-size:11px; opacity:0.75;">
              Note: click "Download office" (coming soon) to cache markers for offline
              </div>
              </div>`);

              m.addTo(layer);
              bounds.push([lat, lng]);
              added++;
            });

          if (bounds.length === 1) {
            map.setView(bounds[0], 12);
          } else if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [30, 30] });
          }
        } catch (err) {
          console.error('Failed to load marker rows:', err);
        }
      };

      run();
    }, [authToken, apiRoot]);

    return (
      <div style={{ height: '600px', width: '100%' }}>
        <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
);

export default MoRiverMap;
