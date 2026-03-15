import { PageHeader } from '@/components/shared/PageHeader';
import { mockNotifikasi } from '@/lib/mockData';
import { Bell, AlertTriangle, Users, Radio } from 'lucide-react';

/**
 * Notifikasi Page
 * API ENDPOINT: GET /api/notifikasi → Notifikasi[]
 * Jenis: pengumuman_operasi, kebutuhan_relawan, update_bencana, briefing_relawan
 */
const NotifikasiPage = () => {
  const iconMap: Record<string, React.ReactNode> = {
    pengumuman_operasi: <Bell className="h-4 w-4 text-primary" />,
    kebutuhan_relawan: <Users className="h-4 w-4 text-warning" />,
    update_bencana: <AlertTriangle className="h-4 w-4 text-emergency" />,
    briefing_relawan: <Radio className="h-4 w-4 text-success" />,
  };

  return (
    <div className="page-container">
      <PageHeader title="Notifikasi" description="Pemberitahuan dan pengumuman" />
      <div className="space-y-2">
        {mockNotifikasi.map((n) => (
          <div key={n.id} className={`stat-card flex items-start gap-3 ${!n.dibaca ? 'border-l-2 border-l-primary' : ''}`}>
            <div className="rounded-lg p-2 bg-muted shrink-0 mt-0.5">{iconMap[n.jenis]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{n.judul}</h4>
                {!n.dibaca && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{n.pesan}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleString('id-ID')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotifikasiPage;
