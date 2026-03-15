import { PageHeader } from '@/components/shared/PageHeader';
import { mockKeahlian } from '@/lib/mockData';
import { Wrench } from 'lucide-react';

/**
 * Data Keahlian Page
 * API ENDPOINT: GET /api/keahlian → Keahlian[]
 */
const KeahlianPage = () => {
  const categories = [...new Set(mockKeahlian.map((k) => k.kategori))];

  return (
    <div className="page-container">
      <PageHeader title="Data Keahlian" description="Kategori keahlian relawan" action={{ label: 'Tambah Keahlian', onClick: () => {} }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="stat-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">{cat}</h3>
            <div className="space-y-2">
              {mockKeahlian.filter((k) => k.kategori === cat).map((k) => (
                <div key={k.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                  <Wrench className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{k.nama}</p>
                    {k.deskripsi && <p className="text-xs text-muted-foreground">{k.deskripsi}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeahlianPage;
