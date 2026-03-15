import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockBencana } from '@/lib/mockData';
import type { Bencana } from '@/types';

/**
 * Kejadian Bencana Page
 * API ENDPOINTS:
 *   GET /api/bencana → Bencana[]
 *   POST /api/bencana → { nama_bencana, jenis_bencana, lokasi, latitude, longitude, waktu_kejadian, skala_bencana, status, deskripsi_dampak }
 */
const BencanaPage = () => {
  const columns: ColumnDef<Bencana>[] = [
    { accessorKey: 'nama_bencana', header: 'Nama Bencana' },
    { accessorKey: 'jenis_bencana', header: 'Jenis' },
    { accessorKey: 'lokasi', header: 'Lokasi' },
    { accessorKey: 'skala_bencana', header: 'Skala', cell: ({ row }) => (
      <span className={`status-badge ${row.original.skala_bencana === 'besar' ? 'bg-destructive/10 text-destructive' : row.original.skala_bencana === 'sedang' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
        {row.original.skala_bencana}
      </span>
    )},
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} type="disaster" /> },
    { accessorKey: 'waktu_kejadian', header: 'Waktu', cell: ({ row }) => new Date(row.original.waktu_kejadian).toLocaleDateString('id-ID') },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Kejadian Bencana" description="Data kejadian bencana" action={{ label: 'Tambah Bencana', onClick: () => {} }} />
      <DataTable columns={columns} data={mockBencana} searchPlaceholder="Cari bencana..." />
    </div>
  );
};

export default BencanaPage;
