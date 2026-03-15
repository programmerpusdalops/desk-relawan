import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockOrganisasi } from '@/lib/mockData';
import type { Organisasi } from '@/types';

/**
 * Data Organisasi Page
 * API ENDPOINTS:
 *   GET /api/organisasi → Organisasi[]
 *   POST /api/organisasi → { nama_organisasi, jenis_organisasi, alamat, nomor_kontak, dokumen_legalitas }
 */
const OrganisasiPage = () => {
  const columns: ColumnDef<Organisasi>[] = [
    { accessorKey: 'nama_organisasi', header: 'Nama Organisasi' },
    { accessorKey: 'jenis_organisasi', header: 'Jenis' },
    { accessorKey: 'nomor_kontak', header: 'Kontak' },
    { accessorKey: 'jumlah_anggota', header: 'Anggota' },
    { accessorKey: 'status_verifikasi', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status_verifikasi} type="verification" /> },
  ];

  return (
    <div className="page-container">
      <PageHeader title="Data Organisasi" description="Kelola organisasi relawan" action={{ label: 'Tambah Organisasi', onClick: () => {} }} />
      <DataTable columns={columns} data={mockOrganisasi} searchPlaceholder="Cari organisasi..." />
    </div>
  );
};

export default OrganisasiPage;
