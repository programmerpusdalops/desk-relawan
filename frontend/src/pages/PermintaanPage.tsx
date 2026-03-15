import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockPermintaan } from '@/lib/mockData';
import type { PermintaanRelawan } from '@/types';

/**
 * Permintaan Relawan Page
 * API ENDPOINTS:
 *   GET /api/permintaan-relawan → PermintaanRelawan[]
 *   POST /api/permintaan-relawan → { bencana_id, keahlian_id, jumlah_relawan, lokasi_penugasan, tanggal_mulai, tanggal_selesai, deskripsi_tugas }
 */
const PermintaanPage = () => {
  const columns: ColumnDef<PermintaanRelawan>[] = [
    { accessorKey: 'bencana_nama', header: 'Bencana' },
    { accessorKey: 'keahlian_nama', header: 'Keahlian' },
    { accessorKey: 'jumlah_relawan', header: 'Kebutuhan' },
    { accessorKey: 'jumlah_terpenuhi', header: 'Terpenuhi' },
    { accessorKey: 'lokasi_penugasan', header: 'Lokasi' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <span className={`status-badge ${row.original.status === 'open' ? 'bg-warning/10 text-warning' : row.original.status === 'fulfilled' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        {row.original.status === 'open' ? 'Terbuka' : row.original.status === 'fulfilled' ? 'Terpenuhi' : 'Ditutup'}
      </span>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader title="Permintaan Relawan" description="Kebutuhan relawan untuk operasi" action={{ label: 'Buat Permintaan', onClick: () => {} }} />
      <DataTable columns={columns} data={mockPermintaan} searchPlaceholder="Cari permintaan..." />
    </div>
  );
};

export default PermintaanPage;
