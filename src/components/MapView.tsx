import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Issue } from '../lib/supabase';

// Fix Leaflet icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  posts: Issue[];
  center?: [number, number];
  zoom?: number;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const MapView: React.FC<MapViewProps> = ({ posts, center = [1.2921, 36.8219], zoom = 7 }) => {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner bg-stone-100 relative">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {posts.map((post) => (
          <Marker key={post.issue_id} position={[post.gps_lat, post.gps_lng] as [number, number]}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[160px]">
                <div className="relative mb-3">
                  <img src={post.media_url} alt="" className="w-full h-24 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                  <span className={cn(
                    "absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/20",
                    post.status === 'verified' ? "bg-emerald-500/90 text-white" :
                    post.status === 'pending' ? "bg-amber-500/90 text-white" :
                    "bg-black/50 text-white"
                  )}>
                    {post.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-stone-900 leading-snug line-clamp-2 mb-2">{post.title || post.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">{post.ward_id}</span>
                  <span className="text-[9px] font-bold text-stone-400">{post.county_id}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <ChangeView center={center as [number, number]} zoom={zoom} />
      </MapContainer>

      {/* Bento Map Stats Overlay */}
      <div className="absolute top-6 left-6 z-[1000] pointer-events-none hidden sm:block">
        <div className="grid grid-cols-2 gap-2 w-64">
          <div className="col-span-2 bg-stone-900/90 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-white shadow-2xl pointer-events-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-1">Active Hotspots</p>
            <p className="text-2xl font-display font-black tracking-tighter">{posts.length}</p>
          </div>
          <div className="col-span-1 bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-stone-900 shadow-xl pointer-events-auto">
            <p className="text-[8px] font-black uppercase tracking-[0.1em] text-stone-400 mb-0.5">Verified</p>
            <p className="text-lg font-display font-bold">{posts.filter(p => p.status === 'verified').length}</p>
          </div>
          <div className="col-span-1 bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-white/20 text-stone-900 shadow-xl pointer-events-auto">
            <p className="text-[8px] font-black uppercase tracking-[0.1em] text-stone-400 mb-0.5">Critical</p>
            <p className="text-lg font-display font-bold text-red-600">{posts.filter(p => p.severity === 'high').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../lib/utils';
