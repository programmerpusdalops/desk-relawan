import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { mockUsers } from '@/lib/mockData';
import type { User } from '@/types';

/**
 * Manajemen Pengguna Page (Admin Only)
 * API ENDPOINTS:
 *   GET /api/users → User[]
 *   PUT /api/users/:id → Update user role/status
 */
const PenggunaPage = () => {
  const columns: ColumnDef<User>[] = [
    { accessorKey: 'nama', header: 'Nama' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: ({ row }) => (
      <span className="status-badge bg-primary/10 text-primary">{row.original.role}</span>
    )},
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <span className={`status-badge ${row.original.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        {row.original.status}
      </span>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader title="Manajemen Pengguna" description="Kelola akun pengguna sistem" action={{ label: 'Tambah Pengguna', onClick: () => {} }} />
      <DataTable columns={columns} data={mockUsers} searchPlaceholder="Cari pengguna..." />
    </div>
  );
};

export default PenggunaPage;
