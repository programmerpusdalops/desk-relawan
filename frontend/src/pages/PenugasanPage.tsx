import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockPenugasan } from '@/lib/mockData';
import type { Penugasan } from '@/types';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Penugasan Relawan Page
 * API ENDPOINTS:
 *   GET /api/penugasan → Penugasan[]
 *   POST /api/penugasan → { bencana_id, nama_tim, lokasi_penugasan, tanggal_mulai, tanggal_selesai }
 *   GET /api/penugasan/:id/surat-tugas → PDF (Surat Tugas)
 */
const PenugasanPage = () => {
  const { toast } = useToast();

  const columns: ColumnDef<Penugasan>[] = [
    { accessorKey: 'nama_tim', header: 'Tim' },
    { accessorKey: 'bencana_nama', header: 'Bencana' },
    { accessorKey: 'lokasi_penugasan', header: 'Lokasi' },
    { id: 'anggota', header: 'Anggota', cell: ({ row }) => `${row.original.anggota.length} orang` },
    { accessorKey: 'tanggal_mulai', header: 'Mulai', cell: ({ row }) => new Date(row.original.tanggal_mulai).toLocaleDateString('id-ID') },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <span className={`status-badge ${row.original.status === 'aktif' ? 'status-badge-bertugas' : 'status-badge-selesai'}`}>
        {row.original.status}
      </span>
    )},
    { id: 'surat', header: 'Surat Tugas', cell: () => (
      <Button variant="outline" size="sm" onClick={() => toast({ title: 'Surat Tugas', description: 'PDF akan diunduh (GET /api/penugasan/:id/surat-tugas)' })}>
        <FileText className="h-3 w-3 mr-1" />PDF
      </Button>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader title="Penugasan Relawan" description="Tim penugasan relawan" action={{ label: 'Buat Penugasan', onClick: () => {} }} />
      <DataTable columns={columns} data={mockPenugasan} searchPlaceholder="Cari penugasan..." />
    </div>
  );
};

export default PenugasanPage;
