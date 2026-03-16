import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Users, Activity, AlertTriangle, Building, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { DashboardStats, ActivityChartData } from '@/types';

const COLORS = ['hsl(221,83%,53%)', 'hsl(142,76%,36%)', 'hsl(24,94%,50%)', 'hsl(38,92%,50%)', 'hsl(215,16%,47%)', 'hsl(280,65%,50%)', 'hsl(0,0%,50%)'];

const StatistikPage = () => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    relawanCount: 0,
    activeRelawan: 0,
    activeDisasters: 0,
    orgCount: 0
  });
  const [activityData, setActivityData] = useState<ActivityChartData[]>([]);
  const [pieData, setPieData] = useState<{name: string, value: number}[]>([]);

  useEffect(() => {
    const fetchStatistik = async () => {
      try {
        const [statsRes, activityRes, skillsRes] = await Promise.all([
          apiClient.get('/dashboard/stats'),
          apiClient.get('/dashboard/chart-activity'),
          apiClient.get('/dashboard/chart-skills')
        ]);

        setStats(statsRes.data.data);
        setActivityData(activityRes.data.data);
        setPieData(skillsRes.data.data);
      } catch (error) {
        toast({ title: 'ErrorSinkronisasi', description: 'Gagal menarik laporan analitik dari server.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchStatistik();
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
      <PageHeader title="Laporan & Statistik" description="Statistik operasional dan audit log lapangan">
        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Export PDF', description: 'Fitur Unduh PDF Opsional' })}>
          <Download className="h-4 w-4 mr-1" />PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Export Excel', description: 'Fitur Unduh Excel Opsional' })}>
          <Download className="h-4 w-4 mr-1" />Excel
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Relawan Terdata" value={stats.relawanCount} icon={Users} />
        <StatCard title="Unit Aktif Lapangan" value={stats.activeRelawan} icon={Activity} variant="emergency" />
        <StatCard title="Bencana Berlangsung" value={stats.activeDisasters} icon={AlertTriangle} variant="emergency" />
        <StatCard title="Organisasi Induk" value={stats.orgCount} icon={Building} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Aktivitas & Log Laporan per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="relawan_aktif" name="Proyeksi Relawan Bertugas" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laporan" name="Buku Jurnal Laporan" fill="hsl(142,76%,36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribusi Komposisi Keahlian Relawan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                 data={pieData} 
                 cx="50%" cy="50%" 
                 outerRadius={100} 
                 dataKey="value" 
                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                 labelLine={true}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatistikPage;
