import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api';
import 'leaflet/dist/leaflet.css';
import type { RelawanLokasi, Bencana } from '@/types';

const MonitoringPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const [relawanPts, setRelawanPts] = useState<RelawanLokasi[]>([]);
  const [bencanaPts, setBencanaPts] = useState<Bencana[]>([]);
  const { toast } = useToast();

  const fetchMonitoringData = async () => {
    try {
      const [r, b] = await Promise.all([
        apiClient.get('/monitoring/lokasi'),
        apiClient.get('/bencana')
      ]);
      setRelawanPts(r.data.data);
      setBencanaPts(b.data.data.filter((item: Bencana) => item.status !== 'selesai' && item.latitude !== 0));
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat peta monitoring secara real-time', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    const pollId = setInterval(fetchMonitoringData, 60000);
    return () => clearInterval(pollId);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    
    let L: any;

    import('leaflet').then((leaflet) => {
      L = leaflet;
      
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current!, { zoomControl: true }).setView([-0.8917, 119.8707], 6);
        mapInstanceRef.current = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
      }

      const map = mapInstanceRef.current;
      
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
           map.removeLayer(layer);
        }
      });

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

      relawanPts.forEach((r) => {
        if (r.latitude === 0 && r.longitude === 0) return;
        const icon = createIcon(statusColors[r.status] || statusColors.siaga);
        L.marker([r.latitude, r.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:150px">
              <h4 style="margin:0 0 4px;font-weight:600;font-size:14px">${r.nama}</h4>
              <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase">${r.status.replace('_', ' ')}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#94a3b8">${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}</p>
            </div>
          `);
      });

      bencanaPts.forEach((b) => {
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
              <p style="margin:4px 0 0;font-size:11px;color:#64748b">${b.deskripsi_dampak || '-'}</p>
            </div>
          `);
      });

      // Avoid UI blocking rendering
      setTimeout(() => map.invalidateSize(), 300);
    });

  }, [relawanPts, bencanaPts]);


  // -------- Admin Overrides Section --------
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<RelawanLokasi | null>(null);
  const [overrideData, setOverrideData] = useState({ latitude: '', longitude: '', status: '' });
  const { hasPermission } = useAuthStore();
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);

  const flyToLocation = (lat: number, lng: number) => {
    if (mapInstanceRef.current && lat !== 0 && lng !== 0) {
      mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.5 });
    }
  };

  const openOverrideDialog = (profile: RelawanLokasi) => {
    setSelectedProfile(profile);
    setOverrideData({
      latitude: String(profile.latitude),
      longitude: String(profile.longitude),
      status: profile.status
    });
    setIsOverrideOpen(true);
  };

  const submitOverride = async () => {
    if (!selectedProfile) return;
    try {
      await apiClient.put(`/monitoring/${selectedProfile.relawan_id}/override`, {
        latitude: overrideData.latitude,
        longitude: overrideData.longitude,
        status_lapangan: overrideData.status
      });
      toast({ title: 'Sukses', description: 'Status Lapangan relawan di-override paksa.' });
      setIsOverrideOpen(false);
      fetchMonitoringData();
    } catch (error) {
      toast({ title: 'Gagal', description: 'Gagal mengoverride lokasi data relawan.', variant: 'destructive' });
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Monitoring Relawan" description="Peta sebaran langsung titik koordinat regu lapangan darurat" />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: 'hsl(221, 83%, 53%)' }} />
          <span className="text-xs text-muted-foreground">Siaga / Kosong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: 'hsl(24, 94%, 50%)' }} />
          <span className="text-xs text-muted-foreground">Bertugas / Di Lapangan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Bencana Aktif</span>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-[500px] md:h-[600px] rounded-lg border border-border shadow-concentric mb-6 z-0" style={{ isolation: 'isolate' }} />

      {/* Volunteer List Component */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 border-b pb-2">Tracking Laporan Lapangan ({relawanPts.length})</h3>
        {relawanPts.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">Belum ada transmisi data koordinat dari relawan yang ditugaskan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {relawanPts.map((r) => (
              <div key={r.relawan_id} className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-card/50 hover:bg-muted/50 transition-colors shadow-sm relative group overflow-hidden">
                
                <div 
                  className="flex justify-between items-start cursor-pointer group-hover:opacity-80 transition-opacity"
                  onClick={() => flyToLocation(r.latitude, r.longitude)}
                  title="Klik untuk loncat melihat posisi di peta"
                >
                  <p className="font-semibold text-sm line-clamp-1 flex-1 pr-2 text-primary">{r.nama}</p>
                  <StatusBadge status={r.status} type="field" />
                </div>
                
                <div className="text-xs font-mono text-muted-foreground flex gap-4">
                  <span>Lat: {r.latitude.toFixed(4)}</span>
                  <span>Lng: {r.longitude.toFixed(4)}</span>
                </div>

                {isAdminOrOp && (
                  <button 
                    onClick={() => openOverrideDialog(r)}
                    className="mt-2 text-xs text-left text-blue-500 hover:text-blue-700 font-medium tracking-tight bg-blue-500/10 hover:bg-blue-500/20 py-1.5 px-2 rounded-md transition-colors w-max"
                  >
                    🛠 Override Letak & Status
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Override Dialog */}
      <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Override Manual Lapangan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="space-y-2">
               <Label>Ubah Status Penugasan</Label>
               <select 
                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 value={overrideData.status} 
                 onChange={(e) => setOverrideData({ ...overrideData, status: e.target.value })}
               >
                  <option value="siaga">Siaga Posko</option>
                  <option value="bertugas">Terjun Bertugas</option>
                  <option value="selesai">Misi Selesai</option>
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude Baru</Label>
                <input 
                  type="number" step="any"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={overrideData.latitude} 
                  onChange={(e) => setOverrideData({ ...overrideData, latitude: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude Baru</Label>
                <input 
                  type="number" step="any"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  value={overrideData.longitude} 
                  onChange={(e) => setOverrideData({ ...overrideData, longitude: e.target.value })} 
                />
              </div>
            </div>
            
            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-700/80 p-3 rounded-md mt-2">
              <p className="text-xs leading-relaxed"><strong>Perhatian:</strong> Tindakan ini memaksa update lokasi relawan terlepas dari posisi sinyal GPS HP miliknya. Digunakan hanya saat HP darurat mati atau koordinat nyangkut.</p>
            </div>
            
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsOverrideOpen(false)}>Batal</Button>
             <Button onClick={submitOverride}>Terapkan Override</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonitoringPage;
