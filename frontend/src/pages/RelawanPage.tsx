import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockRelawan } from '@/lib/mockData';
import type { Relawan } from '@/types';
import { Eye, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

/**
 * Data Relawan Page
 * API ENDPOINTS:
 *   GET /api/relawan → Relawan[]
 *   POST /api/relawan → Create relawan (Admin)
 *   PUT /api/relawan/:id → Update relawan
 *   PUT /api/relawan/:id/verify → { status_verifikasi: 'approved' | 'rejected' }
 *   POST /api/relawan/:id/upload-sertifikat → Upload file
 *   GET /api/relawan/:id/penugasan → Penugasan[]
 */
const RelawanPage = () => {
  const { toast } = useToast();

  const columns: ColumnDef<Relawan>[] = [
    { accessorKey: 'nama_lengkap', header: 'Nama' },
    { accessorKey: 'nik', header: 'NIK' },
    { accessorKey: 'organisasi_nama', header: 'Organisasi', cell: ({ row }) => row.original.organisasi_nama || '-' },
    { accessorKey: 'nomor_hp', header: 'No. HP' },
    { id: 'keahlian', header: 'Keahlian', cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.keahlian.map((k) => (
          <span key={k.id} className="status-badge bg-primary/10 text-primary">{k.nama}</span>
        ))}
      </div>
    )},
    { accessorKey: 'status_verifikasi', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status_verifikasi} type="verification" /> },
    { id: 'aksi', header: 'Aksi', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Detail</DropdownMenuItem>
          {row.original.status_verifikasi === 'pending' && (
            <>
              <DropdownMenuItem onClick={() => toast({ title: 'Relawan diverifikasi' })}>
                <CheckCircle className="h-4 w-4 mr-2" />Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: 'Relawan ditolak', variant: 'destructive' })}>
                <XCircle className="h-4 w-4 mr-2" />Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader title="Data Relawan" description="Kelola data relawan terdaftar" action={{ label: 'Tambah Relawan', onClick: () => {} }} />
      <DataTable columns={columns} data={mockRelawan} searchPlaceholder="Cari relawan..." />
    </div>
  );
};

export default RelawanPage;
