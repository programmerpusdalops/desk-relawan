import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { Bencana, MasterData } from '@/types';

const BencanaPage = () => {
  const [bencana, setBencana] = useState<Bencana[]>([]);
  const [jenisBencanaOpts, setJenisBencanaOpts] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBencana, setSelectedBencana] = useState<Bencana | null>(null);

  const [formData, setFormData] = useState({
    nama_bencana: '',
    jenis_bencana: '',
    lokasi: '',
    skala_bencana: 'sedang',
    status: 'aktif',
    waktu_kejadian: '',
    deskripsi_dampak: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resBencana, resMaster] = await Promise.all([
        apiClient.get('/bencana'),
        apiClient.get('/master-data?kategori=JENIS_BENCANA')
      ]);
      setBencana(resBencana.data.data);
      setJenisBencanaOpts(resMaster.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data kejadian bencana atau master', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (item?: Bencana) => {
    if (item) {
      setSelectedBencana(item);
      setFormData({
        nama_bencana: item.nama_bencana,
        jenis_bencana: item.jenis_bencana,
        lokasi: item.lokasi,
        skala_bencana: item.skala_bencana,
        status: item.status,
        waktu_kejadian: new Date(item.waktu_kejadian).toISOString().slice(0, 16),
        deskripsi_dampak: item.deskripsi_dampak || ''
      });
    } else {
      setSelectedBencana(null);
      setFormData({
        nama_bencana: '', jenis_bencana: '', lokasi: '',
        skala_bencana: 'sedang', status: 'aktif', waktu_kejadian: '',
        deskripsi_dampak: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenView = (item: Bencana) => {
    setSelectedBencana(item);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama_bencana || !formData.jenis_bencana || !formData.lokasi || !formData.waktu_kejadian) {
      toast({ title: 'Error', description: 'Lengkapi Nama, Jenis, Lokasi, dan Waktu kejadian.', variant: 'destructive' });
      return;
    }

    const payload = { ...formData, waktu_kejadian: new Date(formData.waktu_kejadian).toISOString() };

    try {
      if (selectedBencana) {
        await apiClient.put(`/bencana/${selectedBencana.id}`, payload);
        toast({ title: 'Sukses', description: 'Data bencana diperbarui' });
      } else {
        await apiClient.post('/bencana', payload);
        toast({ title: 'Sukses', description: 'Data bencana berhasil ditambahkan' });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Pendataan gagal', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedBencana) return;
    try {
      await apiClient.delete(`/bencana/${selectedBencana.id}`);
      toast({ title: 'Sukses', description: 'Kejadian berhasil dihapus logikal' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Bencana>[] = [
    { accessorKey: 'nama_bencana', header: 'Kejadian Bencana' },
    { accessorKey: 'jenis_bencana', header: 'Jenis' },
    { accessorKey: 'lokasi', header: 'Lokasi' },
    { accessorKey: 'skala_bencana', header: 'Skala', cell: ({ row }) => (
      <span className={`status-badge ${row.original.skala_bencana === 'besar' ? 'bg-destructive/10 text-destructive' : row.original.skala_bencana === 'sedang' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
        {(row.original.skala_bencana || '').toUpperCase()}
      </span>
    )},
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status || 'aktif'} type="disaster" /> },
    { accessorKey: 'waktu_kejadian', header: 'Waktu Kejadian', cell: ({ row }) => row.original.waktu_kejadian ? new Date(row.original.waktu_kejadian).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-' },
    { id: 'aksi', header: 'Aksi', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenView(row.original)}><Eye className="h-4 w-4 mr-2" /> Detail Teks</DropdownMenuItem>
          {isAdminOrOp && (
             <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
              <Edit className="h-4 w-4 mr-2 text-primary" /> Edit Data
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedBencana(row.original); setIsDeleteDialogOpen(true); }}>
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
        title="Kejadian Bencana" 
        description="Direktori pencatatan insiden bencana alam maupun non-alam." 
        action={isAdminOrOp ? { label: 'Catat Kejadian', onClick: () => handleOpenDialog() } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={bencana} searchPlaceholder="Cari kejadian berdasarkan lokasi atau tipe..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBencana ? 'Update Kejadian Bencana' : 'Form Data Kejadian Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Nama / Judul Kejadian</Label>
              <Input value={formData.nama_bencana} onChange={(e) => setFormData({ ...formData, nama_bencana: e.target.value })} placeholder="Cth: Banjir Bandang Parigi" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Bencana</Label>
                <Select value={formData.jenis_bencana} onValueChange={(val) => setFormData({ ...formData, jenis_bencana: val })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Jenis" /></SelectTrigger>
                  <SelectContent>
                    {jenisBencanaOpts.map(opt => (
                      <SelectItem key={opt.id} value={opt.nilai}>{opt.nilai}</SelectItem>
                    ))}
                    {jenisBencanaOpts.length === 0 && (
                      <SelectItem value="none" disabled>Data Master belum diset</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Waktu Kejadian</Label>
                <Input type="datetime-local" value={formData.waktu_kejadian} onChange={(e) => setFormData({ ...formData, waktu_kejadian: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lokasi Bencana</Label>
              <Input value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} placeholder="Kecamatan/Desa" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Skala Dampak</Label>
                <Select value={formData.skala_bencana} onValueChange={(val) => setFormData({ ...formData, skala_bencana: val })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Skala" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kecil">Kecil (Lokal)</SelectItem>
                    <SelectItem value="sedang">Sedang (Kabupaten)</SelectItem>
                    <SelectItem value="besar">Besar (Provinsi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status Operasi</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif / Awal</SelectItem>
                    <SelectItem value="tanggap_darurat">Tanggap Darurat</SelectItem>
                    <SelectItem value="pemulihan">Masa Pemulihan</SelectItem>
                    <SelectItem value="selesai">Operasi Ditutup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Keterangan / Dampak (Opsional)</Label>
              <Textarea 
                 value={formData.deskripsi_dampak} 
                 onChange={(e) => setFormData({ ...formData, deskripsi_dampak: e.target.value })} 
                 placeholder="Ringkasan kerusakan..." 
                 rows={4} 
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>Simpan Berkas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Laporan Rincian Bencana</DialogTitle>
            <DialogDescription>Status operasi darurat terkini.</DialogDescription>
          </DialogHeader>
          {selectedBencana && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start border-b pb-4">
                 <div>
                   <h3 className="text-xl font-bold">{selectedBencana.nama_bencana}</h3>
                   <span className="text-muted-foreground text-sm">{selectedBencana.jenis_bencana} - {selectedBencana.lokasi}</span>
                 </div>
                 <div className="flex gap-2">
                   <StatusBadge status={selectedBencana.status} type="disaster" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <span className="text-xs uppercase text-muted-foreground block">Waktu Kejadian</span>
                   <span className="font-medium text-sm">
                      {new Date(selectedBencana.waktu_kejadian).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                   </span>
                 </div>
                 <div>
                   <span className="text-xs uppercase text-muted-foreground block">Tingkat Bencana</span>
                   <span className={`inline-block mt-1 px-2 mb-1 py-0.5 rounded text-xs font-semibold ${selectedBencana.skala_bencana === 'besar' ? 'bg-destructive/10 text-destructive' : selectedBencana.skala_bencana === 'sedang' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                      {(selectedBencana.skala_bencana || '').toUpperCase()}
                   </span>
                 </div>
              </div>

              <div className="space-y-2 mt-4 bg-muted/30 p-4 rounded-lg border">
                 <span className="text-sm font-bold block mb-2">Penjelasan Dampak Lapangan:</span>
                 <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedBencana.deskripsi_dampak || <span className="italic text-muted-foreground">Belum ada keterangan disematkan oleh Pelapor awal.</span>}
                 </p>
              </div>

            </div>
          )}
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Tutup Info Bencana</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> Hapus Data Bencana</AlertDialogTitle>
              <AlertDialogDescription>
                Yakin ingin menghapus berkas kejadian <strong>{selectedBencana?.nama_bencana}</strong>?
                Tindakan ini akan menggeser status seluruh Penugasan (jika ada) karena referensi CASCADE. Harap pastikan operasi benar-benar kosong!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Ya, Hapus Permanen</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default BencanaPage;
