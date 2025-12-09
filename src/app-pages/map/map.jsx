import React, { useEffect, useRef } from "react";
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

/**
 * useEffect -> renders maps
 * useRef -> stores references to DOM w/o re-rendering
 * L -> Leaflet global namespace
 */

const Map = () => {
const containerRef = useRef(null); // points to div that Leaflet renders map onto
const instanceRef = useRef(null); // stores Leaflet map instance 

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

    return () => {
        if (instanceRef.current) {
            instanceRef.current.remove();
            instanceRef.current = null;
        }
    }
}, []);
// remove map if component unmounts

return (
    <div style={{ height: '600px', width: '100%' }}>
        {/* height is needed or else invisible */}
        <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
)
}

export default Map;