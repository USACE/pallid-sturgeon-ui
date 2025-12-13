import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { connect } from 'redux-bundler-react';

/**
 * useEffect -> renders maps
 * useRef -> stores references to DOM w/o re-rendering
 * L -> Leaflet global namespace
 */
const TEST_MR_FID = '20220510-125356339-038';

const MoRiverMap = connect(
  'selectAuthToken',
  'selectApiRoot',
  // 'doFetchMoRiverDataEntry',
  // 'selectDataEntryData',
  ({ authToken, apiRoot }) => {
    const containerRef = useRef(null); // points to div that Leaflet renders map onto
    const instanceRef = useRef(null); // stores Leaflet map instance
    const markerLayerRef = useRef(null); // holds marker

    // const [markerRows, setMarkerRows] = useState([]);

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

      //tileLayer -> defines where to pull map tiles
      // {s} subdomain, {z} zoom, {x} tile row, {y} tile column placeholders
      // .addTo(map) -> places layer into map

      markerLayerRef.current = L.layerGroup().addTo(map);

      return () => {
        map.remove();
        instanceRef.current = null;
      };
    }, []);
    // remove map if component unmounts

    useEffect(() => {
      //debugger;
      fetch('/__map_probe__').catch(() => {});
      if (!authToken || !instanceRef.current || !markerLayerRef.current) return;

      if (!instanceRef.current) console.warn('[MoRiverMap] map not ready yet');
      if (!markerLayerRef.current) console.warn('[MoRiverMap] marker layer not ready yet');
      if (!authToken) console.warn('[MoRiverMap] no auth token yet');

      const base = apiRoot && typeof apiRoot === 'string' ? apiRoot : 'http://localhost:701';
      // const qs = TEST_YEAR ? `?year=${encodeURIComponent(TEST_YEAR)}` : '';
      const url = `${base}/psapi/moriverDataEntry?fieldId=${encodeURIComponent(TEST_MR_FID)}&page=0&pageSize=500`;

      const run = async () => {
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: 'application/json',
            },
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error('[MoRiverMap] marker fetch failed', {
              status: res.status,
              url,
              errText: errText.slice(0, 800),
            });
            throw new Error(`MoRiver list fetch failed: ${res.status}`);
          }

          const json = await res.json();

          const rows = json?.items ?? [];

          console.log('[MoRiverMap] rows:', rows.length);
          console.log('[MoRiverMap] sample row:', rows[0]);

          //   setMarkerRows(Array.isArray(items) ? items : []);
          // } catch (e) {
          //   console.error('[MoRiverMap] Failed to load marker rows:', e);
          //   setMarkerRows([]);
          // }

          // doFetchMoRiverDataEntry({ tableId: 240861 }, false, true, true);

          const layer = markerLayerRef.current;
          layer.clearLayers();

          // const rows = Array.isArray(dataEntryData) ? dataEntryData : [dataEntryData];

          const bounds = [];

          rows.forEach((r) => {
            const lat = r.startlatitude;
            const lng = r.startlongitude;

            if (lat == null || lng == null) {
              console.warn('[MoRiverMap] missing lat/lng for mr_id:', r.mr_id, { lat, lng });
              return;
            }
            // const mrId = r.mr_id ?? '';
            // const siteId = r.site_id ?? '';
            // const fieldOffice = r.fieldoffice ?? '';
            // const year = r.setdate ? String(r.setdate).slice(0, 4) : '';

            const marker = L.marker([Number(lat), Number(lng)], { radius: 40 });

            marker.bindTooltip(
              `mrId: ${r.mrId}<br/>siteId: ${r.siteId}<br/>office: ${r.fieldOffice}<br/>year: ${
                r.setdate ? String(r.setdate).slice(0, 4) : ''
              }`,
              { sticky: true }
            );

            marker.bindPopup(`
                <div style="min-width:220px>
                <div><b>Missouri River Location</b></div>
                <div>mrId: ${r.mrId}</div>
                <div>siteId: ${r.siteId}</div>
                <div>fieldOffice: ${r.fieldOffice}</div>
                <div>year: ${r.setdate ? String(r.setdate).slice(0, 4) : ''}</div>
                </div>`);

            marker.addTo(layer);
            bounds.push([Number(lat), Number(lng)]);
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
      <div style={{ border: '3px solid red', padding: 8 }}>
        <b>MoRiverMap mounted</b>
        <div style={{ height: '600px', width: '100%' }}>
          <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    );
  }
);

export default MoRiverMap;
