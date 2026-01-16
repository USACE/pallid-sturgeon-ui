import React, { useEffect, useRef, useState, useMemo } from 'react';
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

const MoRiverMap = connect('selectAuthToken', 'selectApiRoot', ({ authToken, apiRoot }) => {
  const containerRef = useRef(null); // points to div that Leaflet renders map onto
  const instanceRef = useRef(null); // stores Leaflet map instance
  const markerLayerRef = useRef(null); // holds marker

  const [allRows, setAllRows] = useState([]);
  const [selectedOffices, setSelectedOffices] = useState([]);

  const normalizedOffice = (v) =>
    String(v ?? '')
      .trim()
      .toUpperCase();

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
      setAllRows([]);
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
          setAllRows([]);
          return;
        }

        const json = await res.json();
        const rows = json?.data?.items || json?.items || [];
        const arr = Array.isArray(rows) ? rows : [];
        setAllRows(arr);

        console.log('[MoRiverMap] rows:', arr.length, arr[0]);
      } catch (err) {
        console.error('Failed to load marker rows:', err);
        setAllRows([]);
      }
    };

    run();
  }, [authToken, apiRoot]);

  const officeCounts = useMemo(() => {
    const counts = {};
    for (const r of allRows) {
      const office = (r.fieldOffice || '').trim();
      if (!office) continue;
      counts[office] = (counts[office] || 0) + 1;
    }
    return counts;
  }, [allRows]);

  const officeList = useMemo(() => {
    return Object.keys(officeCounts).sort();
  }, [officeCounts]);

  const filteredRows = useMemo(() => {
    const selectedSet = new Set(selectedOffices.map(normalizedOffice));

    return (allRows || [])
      .filter((r) => {
        const lat = Number(r.startlatitude);
        const lng = Number(r.startlongitude);
        return lat > 0 && lng < 0;
      })
      .filter((r) => {
        if (selectedSet.size === 0) return true;
        return selectedSet.has(normalizedOffice(r.fieldOffice));
      });
  }, [allRows, selectedOffices]);

  useEffect(() => {
    const map = instanceRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    const testLatitude = 35.4689;
    const testLongitude = -97.52;

    layer.clearLayers();
    L.circleMarker([testLatitude, testLongitude], { radius: 20 }).bindPopup('TEST MARKER').addTo(layer);

    const bounds = [];
    let added = 0;

    filteredRows.slice(0, 100).forEach((r) => {
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

    console.log('[MoRiverMap] rendered markers:', added);

    if (bounds.length === 1) {
      map.setView(bounds[0], 12);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [filteredRows]);

  const toggleOffice = (office) => {
    const norm = normalizedOffice(office);
    setSelectedOffices((prev) => {
      const set = new Set(prev.map(normalizedOffice));
      if (set.has(norm)) set.delete(norm);
      else set.add(norm);
      return Array.from(set);
    });
  };

  const clearOffices = () => setSelectedOffices([]);

  useEffect(() => {
    if (!allRows.length) return;
    console.log('[MoRiverMap] offices:', officeList);
    console.log('[MoRiverMap] officeCounts sample:', officeCounts[officeList[0]]);
  }, [allRows, officeList, officeCounts]);

  return (
    <div style={{ display: 'flex', height: '700px' }}>
      {/* Left Filter Panel */}
      <div style={{ width: 320, padding: 16, borderRight: '1px solid #ddd', overflowY: 'auto', background: '#fff' }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Missouri River Locations</div>

        {/* <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Filter</div>
        </div> */}

        <div style={{ margin: '10px 0', fontSize: 14 }}>
          <b>Results Count:</b> {filteredRows.length}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Field Offices</div>
          {selectedOffices.length > 0 && (
            <button
              onClick={clearOffices}
              style={{
                marginLeft: 'auto',
                border: 'none',
                background: 'transparent',
                color: '#0066cc',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          {officeList.length === 0 && (
            <div style={{ fontSize: 12, color: '#667' }}>No offices found.</div>
          )}

          {officeList.map((office) => {
            const count = officeCounts[office] || 0;
            const checked = selectedOffices.map(normalizedOffice).includes(normalizedOffice(office));

            return (
              <label
                key={office}
                style={{ display: 'flex', alignItems: 'center', padding: '6px 0', cursor: 'pointer', fontSize: 13 }}
              >
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => toggleOffice(office)}
                  style={{ marginRight: 10 }}
                />
                <span>{office}</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 12,
                    color: '#444',
                    background: '#f2f2f2',
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ height: '600px', width: '100%' }}>
          <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
});

export default MoRiverMap;
