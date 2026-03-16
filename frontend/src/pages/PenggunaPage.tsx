import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ShieldAlert, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { User } from '@/types';

const PenggunaPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    role: 'operator',
    status: 'active',
    password: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data.data);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Gagal memuat data pengguna', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        nama: user.nama,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '' // Don't prefill password on edit
      });
    } else {
      setSelectedUser(null);
      setFormData({ nama: '', email: '', role: 'operator', status: 'active', password: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.email || (!selectedUser && !formData.password)) {
      toast({ title: 'Error', description: 'Harap lengkapi semua field yang diwajibkan', variant: 'destructive' });
      return;
    }

    try {
      if (selectedUser) {
        // Edit
        await apiClient.put(`/users/${selectedUser.id}`, {
          nama: formData.nama,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          ...(formData.password && { password: formData.password }) // Send only if changed
        });
        toast({ title: 'Sukses', description: 'Data pengguna berhasil diperbarui' });
      } else {
        // Create
        await apiClient.post('/users', formData);
        toast({ title: 'Sukses', description: 'Pengguna baru berhasil ditambahkan' });
      }
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Gagal menyimpan pengguna', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await apiClient.patch(`/users/${user.id}/status`, { status: newStatus });
      toast({ title: 'Sukses', description: `Status pengguna diubah menjadi ${newStatus}` });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal mengubah status', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await apiClient.delete(`/users/${selectedUser.id}`);
      toast({ title: 'Sukses', description: 'Pengguna berhasil dihapus' });
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({ title: 'Error', description: 'Gagal menghapus pengguna', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'nama', header: 'Nama' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: ({ row }) => {
      const role = row.original.role;
      const colorMap: Record<string, string> = {
        admin: 'bg-destructive/10 text-destructive border-destructive/20',
        pimpinan: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        operator: 'bg-primary/10 text-primary border-primary/20',
        relawan: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      };
      return <span className={`status-badge border ${colorMap[role] || 'bg-muted text-muted-foreground'}`}>{role}</span>;
    }},
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Switch 
          checked={row.original.status === 'active'} 
          onCheckedChange={() => handleToggleStatus(row.original)}
        />
        <span className={`text-xs font-medium ${row.original.status === 'active' ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {row.original.status === 'active' ? 'Aktif' : 'Inaktif'}
        </span>
      </div>
    )},
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(row.original)} title="Edit Profil">
             <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          {row.original.role !== 'admin' && (
            <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(row.original); setIsDeleteDialogOpen(true); }} title="Hapus Pengguna">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Manajemen Pengguna" 
        description="Kelola akun hak akses lintas platform (Admin, Operator, Pimpinan, Relawan)." 
        action={{ label: 'Tambah Pengguna', onClick: () => handleOpenDialog() }} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={users} searchPlaceholder="Cari berdasarkan email atau nama..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Masukkan nama" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@bpbd.go.id" type="email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="pimpinan">Pimpinan</SelectItem>
                    <SelectItem value="relawan">Relawan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status Awal</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Inaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password {selectedUser && <span className="text-muted-foreground font-normal text-xs">(Kosongkan jika tidak ingin mengubah)</span>}</Label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="********" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedUser?.nama}</strong> secara permanen?
              Akun ini tidak akan dapat dipulihkan. Jika ini adalah akun Relawan, data profil dan laporan lapangan mungkin ikut terhapus atau akan kehilangan akses tautannya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Hapus Permanen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default PenggunaPage;
