import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockLaporan } from '@/lib/mockData';
import type { LaporanKegiatan } from '@/types';

/**
 * Laporan Kegiatan Page
 * API ENDPOINTS:
 *   GET /api/laporan → LaporanKegiatan[]
 *   POST /api/laporan → { relawan_id, bencana_id, judul_laporan, deskripsi, jumlah_penerima_bantuan, kendala_lapangan, foto_kegiatan, latitude, longitude }
 */
const LaporanPage = () => {
  const columns: ColumnDef<LaporanKegiatan>[] = [
    { accessorKey: 'judul_laporan', header: 'Judul' },
    { accessorKey: 'relawan_nama', header: 'Relawan' },
    { accessorKey: 'bencana_nama', header: 'Bencana' },
    { accessorKey: 'jumlah_penerima_bantuan', header: 'Penerima Bantuan' },
    { accessorKey: 'created_at', header: 'Tanggal', cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID') },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Laporan Kegiatan" description="Laporan aktivitas relawan di lapangan" action={{ label: 'Buat Laporan', onClick: () => {} }} />
      <DataTable columns={columns} data={mockLaporan} searchPlaceholder="Cari laporan..." />
    </div>
  );
};

export default LaporanPage;
