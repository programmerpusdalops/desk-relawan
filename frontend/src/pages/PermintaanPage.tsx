import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { PermintaanRelawan, Bencana, Keahlian } from '@/types';

const PermintaanPage = () => {
  const [permintaan, setPermintaan] = useState<PermintaanRelawan[]>([]);
  const [bencanaList, setBencanaList] = useState<Bencana[]>([]);
  const [keahlianList, setKeahlianList] = useState<Keahlian[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PermintaanRelawan | null>(null);

  const [formData, setFormData] = useState({
    bencana_id: '',
    keahlian_id: '',
    jumlah_relawan: '',
    jumlah_terpenuhi: '',
    lokasi_penugasan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    deskripsi_tugas: '',
    status: 'open'
  });

  const fetchMasterData = async () => {
    try {
      const [b, k] = await Promise.all([
        apiClient.get('/bencana'),
        apiClient.get('/keahlian')
      ]);
      setBencanaList(b.data.data.filter((i: Bencana) => i.status !== 'selesai'));
      setKeahlianList(k.data.data);
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal memuat master referensi', variant: 'destructive' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/permintaan-relawan');
      setPermintaan(response.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data permintaan relawan', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMasterData();
  }, []);

  const handleOpenDialog = (item?: PermintaanRelawan) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        bencana_id: item.bencana_id,
        keahlian_id: item.keahlian_id,
        jumlah_relawan: String(item.jumlah_relawan),
        jumlah_terpenuhi: String(item.jumlah_terpenuhi),
        lokasi_penugasan: item.lokasi_penugasan,
        tanggal_mulai: new Date(item.tanggal_mulai).toISOString().slice(0, 16),
        tanggal_selesai: new Date(item.tanggal_selesai).toISOString().slice(0, 16),
        deskripsi_tugas: item.deskripsi_tugas,
        status: item.status
      });
    } else {
      setSelectedItem(null);
      setFormData({
        bencana_id: '', keahlian_id: '', jumlah_relawan: '', jumlah_terpenuhi: '0',
        lokasi_penugasan: '', tanggal_mulai: '', tanggal_selesai: '',
        deskripsi_tugas: '', status: 'open'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.bencana_id || !formData.keahlian_id || !formData.jumlah_relawan || !formData.lokasi_penugasan || !formData.tanggal_mulai || !formData.tanggal_selesai) {
      toast({ title: 'Error', description: 'Harap lengkapi instrumen Bencana, Keahlian, Jumlah, Lokasi, dan Jadwal.', variant: 'destructive' });
      return;
    }

    const payload = {
      ...formData,
      tanggal_mulai: new Date(formData.tanggal_mulai).toISOString(),
      tanggal_selesai: new Date(formData.tanggal_selesai).toISOString()
    };

    try {
      if (selectedItem) {
        await apiClient.put(`/permintaan-relawan/${selectedItem.id}`, payload);
        toast({ title: 'Sukses', description: 'Permintaan berhasil diperbarui' });
      } else {
        await apiClient.post('/permintaan-relawan', payload);
        toast({ title: 'Sukses', description: 'Permintaan berhasil disiarkan' });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Gagal menyimpan.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await apiClient.delete(`/permintaan-relawan/${selectedItem.id}`);
      toast({ title: 'Sukses', description: 'Permintaan dibatalkan/dihapus permanen' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<PermintaanRelawan>[] = [
    { accessorKey: 'bencana_nama', header: 'Bencana' },
    { accessorKey: 'keahlian_nama', header: 'Keahlian' },
    { accessorKey: 'jumlah_relawan', header: 'Kebutuhan' },
    { accessorKey: 'jumlah_terpenuhi', header: 'Terpenuhi' },
    { accessorKey: 'lokasi_penugasan', header: 'Lokasi' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <span className={`status-badge ${row.original.status === 'open' ? 'bg-warning/10 text-warning' : row.original.status === 'fulfilled' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        {row.original.status === 'open' ? 'Terbuka' : row.original.status === 'fulfilled' ? 'Terpenuhi' : 'Ditutup'}
      </span>
    )},
    { id: 'aksi', header: 'Aksi', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {}}><Eye className="h-4 w-4 mr-2" /> Detail</DropdownMenuItem>
          {isAdminOrOp && (
            <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
              <Edit className="h-4 w-4 mr-2 text-primary" /> Edit Data
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsDeleteDialogOpen(true); }}>
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
        title="Permintaan Relawan" 
        description="Publikasi dan kelola kebutuhan relawan untuk operasi spesifik" 
        action={isAdminOrOp ? { label: 'Buat Permintaan Baru', onClick: () => handleOpenDialog() } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={permintaan} searchPlaceholder="Cari kebutuhan..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Update Post Permintaan' : 'Buat Permintaan Tenaga Relawan Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="space-y-2">
              <Label>Kejadian Bencana Terkait</Label>
              <Select value={formData.bencana_id} onValueChange={(val) => setFormData({ ...formData, bencana_id: val })}>
                <SelectTrigger><SelectValue placeholder="Pilih Bencana Aktif..." /></SelectTrigger>
                <SelectContent>
                  {bencanaList.map((ben) => (
                    <SelectItem key={ben.id} value={ben.id}>{ben.nama_bencana}</SelectItem>
                  ))}
                  {bencanaList.length === 0 && <SelectItem value="-" disabled>Tidak ada bencana aktif</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Spesialisasi Keahlian yang Dibutuhkan</Label>
              <Select value={formData.keahlian_id} onValueChange={(val) => setFormData({ ...formData, keahlian_id: val })}>
                <SelectTrigger><SelectValue placeholder="Pilih Keahlian Dasar..." /></SelectTrigger>
                <SelectContent>
                  {keahlianList.map((keah) => (
                    <SelectItem key={keah.id} value={keah.id}>{keah.nama} ({keah.kategori})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jumlah Personil Dibutuhkan</Label>
                <Input type="number" min="1" value={formData.jumlah_relawan} onChange={(e) => setFormData({ ...formData, jumlah_relawan: e.target.value })} placeholder="Cth: 10" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Terbuka / Mencari</SelectItem>
                    <SelectItem value="fulfilled">Terpenuhi Lunas</SelectItem>
                    <SelectItem value="closed">Ditutup / Batal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
               <Label>Lokasi Penempatan / Lapor Pukul</Label>
               <Input value={formData.lokasi_penugasan} onChange={(e) => setFormData({ ...formData, lokasi_penugasan: e.target.value })} placeholder="Posko Utama Pemda..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Est. Tanggal / Jam Mulai</Label>
                 <Input type="datetime-local" value={formData.tanggal_mulai} onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })} />
               </div>
               <div className="space-y-2">
                 <Label>Est. Tanggal / Jam Selesai</Label>
                 <Input type="datetime-local" value={formData.tanggal_selesai} onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })} />
               </div>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Tugas & Kualifikasi Berkas Tambahan</Label>
              <Textarea 
                 value={formData.deskripsi_tugas} 
                 onChange={(e) => setFormData({ ...formData, deskripsi_tugas: e.target.value })} 
                 placeholder="Persiapan logistik dapur umum..." 
                 rows={3} 
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>Publikasikan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> Hapus Permintaan?</AlertDialogTitle>
              <AlertDialogDescription>
                Yakin ingin menghapus secara permanen pos permintaan relawan ini?
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

export default PermintaanPage;
