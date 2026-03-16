import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, CheckCircle, XCircle, MoreHorizontal, Trash2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { Organisasi } from '@/types';

const OrganisasiPage = () => {
  const [organisasi, setOrganisasi] = useState<Organisasi[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOperator = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organisasi | null>(null);

  const [formData, setFormData] = useState({
    nama_organisasi: '',
    jenis_organisasi: '',
    alamat: '',
    nomor_kontak: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/organisasi');
      setOrganisasi(response.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data organisasi', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiClient.patch(`/organisasi/${id}/verify`, { status_verifikasi: status });
      toast({ title: 'Sukses', description: `Organisasi berhasil di-${status}` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal verifikasi organisasi', variant: 'destructive' });
    }
  };

  const handleOpenDialog = (item?: Organisasi) => {
    if (item) {
      setSelectedOrg(item);
      setFormData({
        nama_organisasi: item.nama_organisasi,
        jenis_organisasi: item.jenis_organisasi,
        alamat: item.alamat,
        nomor_kontak: item.nomor_kontak
      });
    } else {
      setSelectedOrg(null);
      setFormData({ nama_organisasi: '', jenis_organisasi: '', alamat: '', nomor_kontak: '' });
    }
    setIsDialogOpen(true);
  };

  const handleOpenView = (item: Organisasi) => {
    setSelectedOrg(item);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama_organisasi || !formData.nomor_kontak) {
      toast({ title: 'Error', description: 'Nama dan Kontak wajib diisi', variant: 'destructive' });
      return;
    }
    try {
      if (selectedOrg) {
        // Edit Mode
        await apiClient.put(`/organisasi/${selectedOrg.id}`, formData);
        toast({ title: 'Sukses', description: 'Profil organisasi diperbarui.' });
      } else {
        // Create Mode
        await apiClient.post('/organisasi', formData);
        toast({ title: 'Sukses', description: 'Organisasi terdaftar' });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Gagal menyimpan data.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedOrg) return;
    try {
      await apiClient.delete(`/organisasi/${selectedOrg.id}`);
      toast({ title: 'Sukses', description: 'Organisasi dihapus' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Organisasi>[] = [
    { accessorKey: 'nama_organisasi', header: 'Nama Organisasi' },
    { accessorKey: 'jenis_organisasi', header: 'Jenis' },
    { accessorKey: 'nomor_kontak', header: 'Kontak' },
    { accessorKey: 'jumlah_anggota', header: 'Anggota' },
    { accessorKey: 'status_verifikasi', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status_verifikasi} type="verification" /> },
    { id: 'aksi', header: 'Aksi', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenView(row.original)}><Eye className="h-4 w-4 mr-2" /> Detail Info</DropdownMenuItem>
          {isAdminOrOperator && (
             <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
                <CheckCircle className="h-4 w-4 mr-2 text-primary" /> Edit Profil
             </DropdownMenuItem>
          )}
          {isAdminOrOperator && row.original.status_verifikasi === 'pending' && (
            <>
              <DropdownMenuItem onClick={() => handleVerify(row.original.id, 'approved')}>
                <CheckCircle className="h-4 w-4 mr-2 text-success" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVerify(row.original.id, 'rejected')}>
                <XCircle className="h-4 w-4 mr-2 text-destructive" /> Reject
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedOrg(row.original); setIsDeleteDialogOpen(true); }}>
              <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Hapus
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Data Organisasi" 
        description="Kelola instansi atau organisasi mitra relawan." 
        action={{ label: 'Tambah Organisasi', onClick: () => handleOpenDialog() }} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={organisasi} searchPlaceholder="Cari organisasi..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedOrg ? 'Edit Profil Organisasi' : 'Daftar Organisasi Baru'}</DialogTitle>
            <DialogDescription>Daftarkan instansi atau lembaga swadaya masyarakat untuk kemitraan relawan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nama Organisasi</Label>
              <Input value={formData.nama_organisasi} onChange={(e) => setFormData({ ...formData, nama_organisasi: e.target.value })} placeholder="Masukkan nama..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Nomor Kontak Utama</Label>
                 <Input value={formData.nomor_kontak} onChange={(e) => setFormData({ ...formData, nomor_kontak: e.target.value })} placeholder="08..." />
               </div>
               <div className="space-y-2">
                 <Label>Sektor / Jenis</Label>
                 <Input value={formData.jenis_organisasi} onChange={(e) => setFormData({ ...formData, jenis_organisasi: e.target.value })} placeholder="Pendidikan, Medis, Dll" />
               </div>
            </div>
            <div className="space-y-2">
              <Label>Alamat Lengkap</Label>
              <Input value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Profil Kemitraan Organisasi</DialogTitle>
            <DialogDescription>Rincian data lembaga afiliasi kerelawanan.</DialogDescription>
          </DialogHeader>
          {selectedOrg && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Nama Lembaga</span>
                <span className="col-span-2 text-sm font-semibold text-foreground">{selectedOrg.nama_organisasi}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Sektor / Jenis</span>
                <span className="col-span-2 text-sm text-foreground">{selectedOrg.jenis_organisasi}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Status Verifikasi</span>
                <div className="col-span-2"><StatusBadge status={selectedOrg.status_verifikasi} type="verification" /></div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Kontak Darurat</span>
                <span className="col-span-2 text-sm text-foreground">{selectedOrg.nomor_kontak}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Total Anggota</span>
                <span className="col-span-2 text-sm text-foreground">{selectedOrg.jumlah_anggota || 0} Pasukan di Sistem</span>
              </div>
              <div className="grid grid-cols-3 items-start gap-4">
                <span className="text-sm font-medium text-muted-foreground">Alamat Markas</span>
                <span className="col-span-2 text-sm text-foreground">{selectedOrg.alamat}</span>
              </div>
            </div>
          )}
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Tutup Panel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> Hapus Organisasi</AlertDialogTitle>
              <AlertDialogDescription>
                Hapus organisasi <strong>{selectedOrg?.nama_organisasi}</strong>? Aksi ini akan memutuskan kaitan organisasi dari seluruh Relawan anggotanya. Data tidak dapat dipulihkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Hapus Permanen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default OrganisasiPage;
