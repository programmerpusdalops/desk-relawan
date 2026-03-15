import { Users, Building, AlertTriangle, Activity } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockStats, mockActivityChart, mockBencana, mockRelawan } from '@/lib/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

/**
 * Dashboard Page
 * API ENDPOINTS:
 *   GET /api/dashboard/relawan-count → { count: number }
 *   GET /api/dashboard/relawan-active → { count: number }
 *   GET /api/dashboard/organisasi-count → { count: number }
 *   GET /api/dashboard/operasi-active → { count: number }
 *   GET /api/dashboard/activity-chart → ActivityChartData[]
 */
const Dashboard = () => {
  return (
    <div className="page-container">
      <PageHeader title="Dashboard" description="Ringkasan operasional Desk Relawan BPBD" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Relawan Terdaftar" value={mockStats.relawanCount} icon={Users} />
        <StatCard title="Aktif di Lapangan" value={mockStats.activeRelawan} icon={Activity} variant="emergency" />
        <StatCard title="Bencana Aktif" value={mockStats.activeDisasters} icon={AlertTriangle} variant="emergency" />
        <StatCard title="Organisasi" value={mockStats.orgCount} icon={Building} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Aktivitas Relawan (6 Bulan Terakhir)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockActivityChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="relawan_aktif" name="Relawan Aktif" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laporan" name="Laporan" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tren Operasi Bencana</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockActivityChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
              <Line type="monotone" dataKey="operasi" name="Operasi" stroke="hsl(24, 94%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="relawan_aktif" name="Relawan Aktif" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Bencana Aktif</h3>
          <div className="space-y-3">
            {mockBencana.filter((b) => b.status !== 'selesai').map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{b.nama_bencana}</p>
                  <p className="text-xs text-muted-foreground">{b.lokasi}</p>
                </div>
                <StatusBadge status={b.status} type="disaster" />
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Relawan Terbaru</h3>
          <div className="space-y-3">
            {mockRelawan.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.nama_lengkap}</p>
                  <p className="text-xs text-muted-foreground">{r.organisasi_nama || 'Independen'}</p>
                </div>
                <StatusBadge status={r.status_verifikasi} type="verification" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
