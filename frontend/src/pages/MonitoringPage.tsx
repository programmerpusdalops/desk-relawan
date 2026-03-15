import { useEffect, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockRelawanLokasi, mockBencana } from '@/lib/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import 'leaflet/dist/leaflet.css';

/**
 * Monitoring Relawan Page - Leaflet Map
 * API ENDPOINTS:
 *   GET /api/relawan/lokasi → RelawanLokasi[]
 *   POST /api/relawan/update-location → { latitude, longitude }
 * RESPONSE: { relawan_id, nama, latitude, longitude, status }
 * Ready for WebSocket integration (socket.io-client) for live location
 */
const MonitoringPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!, { zoomControl: true }).setView([-6.2088, 106.8456], 8);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Custom icons
      const createIcon = (color: string) => L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const statusColors: Record<string, string> = {
        bertugas: 'hsl(24, 94%, 50%)',
        siaga: 'hsl(221, 83%, 53%)',
        selesai: 'hsl(215, 16%, 47%)',
      };

      // Add volunteer markers
      mockRelawanLokasi.forEach((r) => {
        const icon = createIcon(statusColors[r.status] || statusColors.siaga);
        L.marker([r.latitude, r.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:150px">
              <h4 style="margin:0 0 4px;font-weight:600;font-size:14px">${r.nama}</h4>
              <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase">${r.status}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#94a3b8">${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}</p>
            </div>
          `);
      });

      // Add disaster markers
      mockBencana.filter((b) => b.status !== 'selesai').forEach((b) => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="width:32px;height:32px;border-radius:6px;background:hsl(0,84%,60%);border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:16px;font-weight:bold">!</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        L.marker([b.latitude, b.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:180px">
              <h4 style="margin:0 0 4px;font-weight:600;font-size:14px;color:#dc2626">${b.nama_bencana}</h4>
              <p style="margin:0;font-size:12px">${b.jenis_bencana} — ${b.lokasi}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#64748b">${b.deskripsi_dampak}</p>
            </div>
          `);
      });

      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Monitoring Relawan" description="Peta lokasi relawan di lapangan" />

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: 'hsl(221, 83%, 53%)' }} />
          <span className="text-xs text-muted-foreground">Siaga</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: 'hsl(24, 94%, 50%)' }} />
          <span className="text-xs text-muted-foreground">Bertugas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Bencana Aktif</span>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-[500px] md:h-[600px] rounded-lg border border-border shadow-concentric" />

      {/* Volunteer List */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">Relawan di Lapangan ({mockRelawanLokasi.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockRelawanLokasi.map((r) => (
            <div key={r.relawan_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium text-foreground">{r.nama}</p>
                <p className="text-xs text-muted-foreground">{r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}</p>
              </div>
              <StatusBadge status={r.status} type="field" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
