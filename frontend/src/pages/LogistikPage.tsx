import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockLogistik } from '@/lib/mockData';
import type { Logistik } from '@/types';

/**
 * Manajemen Logistik Page
 * API ENDPOINT: GET /api/logistik → Logistik[]
 */
const LogistikPage = () => {
  const columns: ColumnDef<Logistik>[] = [
    { accessorKey: 'nama_peralatan', header: 'Peralatan' },
    { accessorKey: 'kategori', header: 'Kategori' },
    { accessorKey: 'stok', header: 'Stok', cell: ({ row }) => (
      <span className={row.original.stok < 20 ? 'text-destructive font-medium' : 'text-foreground'}>
        {row.original.stok}
      </span>
    )},
    { accessorKey: 'lokasi_penyimpanan', header: 'Lokasi' },
    { accessorKey: 'kondisi', header: 'Kondisi', cell: ({ row }) => (
      <span className={`status-badge ${row.original.kondisi === 'baik' ? 'bg-success/10 text-success' : row.original.kondisi === 'rusak_ringan' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
        {row.original.kondisi.replace('_', ' ')}
      </span>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader title="Manajemen Logistik" description="Data peralatan dan logistik relawan" action={{ label: 'Tambah Item', onClick: () => {} }} />
      <DataTable columns={columns} data={mockLogistik} searchPlaceholder="Cari peralatan..." />
    </div>
  );
};

export default LogistikPage;
