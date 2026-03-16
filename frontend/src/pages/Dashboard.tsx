import { useState, useEffect } from 'react';
import { Users, Building, AlertTriangle, Activity } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import apiClient from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { DashboardStats, ActivityChartData, Bencana, Relawan } from '@/types';

const Dashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    relawanCount: 0,
    activeRelawan: 0,
    activeDisasters: 0,
    orgCount: 0
  });
  const [chartData, setChartData] = useState<ActivityChartData[]>([]);
  const [recentBencana, setRecentBencana] = useState<Bencana[]>([]);
  const [recentRelawan, setRecentRelawan] = useState<Relawan[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes, bencanaRes, relawanRes] = await Promise.all([
          apiClient.get('/dashboard/stats'),
          apiClient.get('/dashboard/chart-activity'),
          apiClient.get('/bencana'),
          apiClient.get('/relawan')
        ]);

        setStats(statsRes.data.data);
        setChartData(chartRes.data.data);
        // Only take the first few items for the "Recent" lists
        setRecentBencana(bencanaRes.data.data.slice(0, 5));
        setRecentRelawan(relawanRes.data.data.slice(0, 5));

      } catch (error) {
        toast({ title: 'ErrorSinkronisasi', description: 'Gagal memuat data live dashboard.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader title="Dashboard" description="Ringkasan operasional Desk Relawan BPBD" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Relawan Terverifikasi" value={stats.relawanCount} icon={Users} />
        <StatCard title="BKO di Lapangan" value={stats.activeRelawan} icon={Activity} variant="emergency" />
        <StatCard title="Bencana Aktif" value={stats.activeDisasters} icon={AlertTriangle} variant="emergency" />
        <StatCard title="Organisasi Mitra" value={stats.orgCount} icon={Building} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Aktivitas Operasional (6 Bulan Terakhir)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="relawan_aktif" name="Proyeksi Relawan Bertugas" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laporan" name="Buku Jurnal Diterima" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tren Bencana & Pengerahan Regu BKO</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
              <Line type="monotone" dataKey="operasi" name="SPPT / Grup Operasi Aktif" stroke="hsl(24, 94%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="laporan" name="Serah Terima Laporan" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Insiden / Bencana Berlangsung</h3>
          <div className="space-y-3">
            {recentBencana.filter((b) => b.status !== 'selesai').map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.nama_bencana}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{b.lokasi}</p>
                </div>
                <StatusBadge status={b.status} type="disaster" />
              </div>
            ))}
            {recentBencana.filter((b) => b.status !== 'selesai').length === 0 && (
               <p className="text-sm text-muted-foreground italic">Tidak ada status darurat bencana aktif saat ini.</p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Identitas Pendaftar Baru</h3>
          <div className="space-y-3">
            {recentRelawan.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.nama_lengkap}</p>
                  <p className="text-xs text-muted-foreground">{r.organisasi_nama || 'Independen - Menunggu Review'}</p>
                </div>
                <StatusBadge status={r.status_verifikasi} type="verification" />
              </div>
            ))}
            {recentRelawan.length === 0 && (
               <p className="text-sm text-muted-foreground italic">Arus pendaftaran kosong.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
