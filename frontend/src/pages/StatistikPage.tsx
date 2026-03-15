import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { mockStats, mockActivityChart } from '@/lib/mockData';
import { Users, Activity, AlertTriangle, Building, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

/**
 * Laporan & Statistik Page
 * API ENDPOINT: GET /api/statistik → Stats
 * Export: PDF, Excel
 */
const StatistikPage = () => {
  const { toast } = useToast();

  const pieData = [
    { name: 'SAR', value: 320 },
    { name: 'Medis', value: 280 },
    { name: 'Logistik', value: 210 },
    { name: 'Psikososial', value: 150 },
    { name: 'Lainnya', value: 287 },
  ];
  const COLORS = ['hsl(221,83%,53%)', 'hsl(142,76%,36%)', 'hsl(24,94%,50%)', 'hsl(38,92%,50%)', 'hsl(215,16%,47%)'];

  return (
    <div className="page-container">
      <PageHeader title="Laporan & Statistik" description="Statistik operasional dan laporan">
        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Export PDF' })}>
          <Download className="h-4 w-4 mr-1" />PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Export Excel' })}>
          <Download className="h-4 w-4 mr-1" />Excel
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Relawan" value={mockStats.relawanCount} icon={Users} />
        <StatCard title="Relawan Aktif" value={mockStats.activeRelawan} icon={Activity} variant="emergency" />
        <StatCard title="Bencana Aktif" value={mockStats.activeDisasters} icon={AlertTriangle} />
        <StatCard title="Organisasi" value={mockStats.orgCount} icon={Building} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Aktivitas per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockActivityChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="relawan_aktif" name="Relawan" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laporan" name="Laporan" fill="hsl(142,76%,36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribusi Keahlian</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatistikPage;
