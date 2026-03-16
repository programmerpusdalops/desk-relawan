import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Eye, ShieldAlert, FileText, CheckSquare, MoreHorizontal } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { Penugasan, Bencana, Relawan } from '@/types';

const PenugasanPage = () => {
  const [penugasan, setPenugasan] = useState<Penugasan[]>([]);
  const [bencanaList, setBencanaList] = useState<Bencana[]>([]);
  const [relawanList, setRelawanList] = useState<Relawan[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Penugasan | null>(null);

  const [formData, setFormData] = useState({
    bencana_id: '',
    nama_tim: '',
    lokasi_penugasan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'aktif',
    anggota_ids: [] as string[]
  });

  const fetchMasterData = async () => {
    try {
      const [b, r] = await Promise.all([
        apiClient.get('/bencana'),
        apiClient.get('/relawan')
      ]);
      setBencanaList(b.data.data.filter((i: Bencana) => i.status !== 'selesai'));
      setRelawanList(r.data.data.filter((i: Relawan) => i.status_verifikasi === 'approved'));
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal memuat master referensi', variant: 'destructive' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/penugasan');
      setPenugasan(response.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data penugasan tim relawan', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMasterData();
  }, []);

  const handleOpenDialog = (item?: Penugasan) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        bencana_id: item.bencana_id,
        nama_tim: item.nama_tim,
        lokasi_penugasan: item.lokasi_penugasan,
        tanggal_mulai: new Date(item.tanggal_mulai).toISOString().slice(0, 10),
        tanggal_selesai: new Date(item.tanggal_selesai).toISOString().slice(0, 10),
        status: item.status,
        anggota_ids: item.anggota.map(a => a.id) || []
      });
    } else {
      setSelectedItem(null);
      setFormData({
        bencana_id: '', nama_tim: '', lokasi_penugasan: '',
        tanggal_mulai: '', tanggal_selesai: '', status: 'aktif', anggota_ids: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenView = (item: Penugasan) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleRelawanToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      anggota_ids: prev.anggota_ids.includes(id) 
        ? prev.anggota_ids.filter(x => x !== id)
        : [...prev.anggota_ids, id]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.bencana_id || !formData.nama_tim || !formData.lokasi_penugasan || !formData.tanggal_mulai || !formData.tanggal_selesai) {
      toast({ title: 'Error', description: 'Harap lengkapi semua isian dasar Penugasan.', variant: 'destructive' });
      return;
    }

    const payload = {
      ...formData,
      tanggal_mulai: formData.tanggal_mulai ? new Date(formData.tanggal_mulai).toISOString() : new Date().toISOString(),
      tanggal_selesai: formData.tanggal_selesai ? new Date(formData.tanggal_selesai).toISOString() : new Date().toISOString()
    };

    try {
      if (selectedItem) {
        await apiClient.put(`/penugasan/${selectedItem.id}`, payload);
        toast({ title: 'Sukses', description: 'Penugasan diperbarui' });
      } else {
        await apiClient.post('/penugasan', payload);
        toast({ title: 'Sukses', description: 'Penugasan diterbitkan' });
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
      await apiClient.delete(`/penugasan/${selectedItem.id}`);
      toast({ title: 'Sukses', description: 'Tim penugasan dibubarkan secara paksa' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const downloadPDF = async (id: string, timName: string) => {
    try {
      const response = await apiClient.get(`/penugasan/${id}/surat-tugas`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Surat-Tugas-${timName}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast({ title: 'Unduhan Dimulai', description: 'Surat tugas sedang diunduh.' });
    } catch (error) {
      toast({ title: 'Gagal', description: 'Gagal mengunduh dokumen', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Penugasan>[] = [
    { accessorKey: 'nama_tim', header: 'Tim' },
    { accessorKey: 'bencana_nama', header: 'Bencana' },
    { accessorKey: 'lokasi_penugasan', header: 'Lokasi' },
    { id: 'anggota', header: 'Personil', cell: ({ row }) => `${row.original.anggota?.length || 0} orang` },
    { accessorKey: 'tanggal_mulai', header: 'Tanggal Mulai', cell: ({ row }) => new Date(row.original.tanggal_mulai).toLocaleDateString('id-ID') },
    { accessorKey: 'status', header: 'Status Tim', cell: ({ row }) => (
      <span className={`status-badge ${row.original.status === 'aktif' ? 'bg-primary/10 text-primary' : row.original.status === 'selesai' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        {row.original.status.toUpperCase()}
      </span>
    )},
    { id: 'surat', header: 'Dokumen', cell: ({ row }) => (
      <Button variant="outline" size="sm" onClick={() => downloadPDF(row.original.id, row.original.nama_tim)}>
        <FileText className="h-4 w-4 mr-1" />Surat Tugas
      </Button>
    )},
    { id: 'aksi', header: 'Aksi', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenView(row.original)}><Eye className="h-4 w-4 mr-2" /> Detail</DropdownMenuItem>
          {isAdminOrOp && (
            <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
              <Edit className="h-4 w-4 mr-2 text-primary" /> Edit Tim
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsDeleteDialogOpen(true); }}>
              <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Bubarkan Tim
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Penugasan Relawan" 
        description="Kelola jadwal tim penugasan relawan ke area bencana" 
        action={isAdminOrOp ? { label: 'Rakit Tim Penugasan', onClick: () => handleOpenDialog() } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={penugasan} searchPlaceholder="Cari tim..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Update Tim Operasi' : 'Rakit Tim Ekspedisi Baru'}</DialogTitle>
            <DialogDescription>Penugasan mencakup personil yang *verified* dan aktif.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 md:grid-cols-2">
            
            {/* Left Column - Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Opsi Kejadian Bencana</Label>
                <Select value={formData.bencana_id} onValueChange={(val) => setFormData({ ...formData, bencana_id: val })}>
                  <SelectTrigger><SelectValue placeholder="Pilih Bencana..." /></SelectTrigger>
                  <SelectContent>
                    {bencanaList.map((ben) => (
                      <SelectItem key={ben.id} value={ben.id}>{ben.nama_bencana}</SelectItem>
                    ))}
                    {bencanaList.length === 0 && <SelectItem value="-" disabled>Tidak ada bencana aktif</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sandi Tim Operasi (Nama)</Label>
                <Input value={formData.nama_tim} onChange={(e) => setFormData({ ...formData, nama_tim: e.target.value })} placeholder="Cth: Satgas Badai 01" />
              </div>

              <div className="space-y-2">
                 <Label>Lokasi Definitif</Label>
                 <Input value={formData.lokasi_penugasan} onChange={(e) => setFormData({ ...formData, lokasi_penugasan: e.target.value })} placeholder="Desa X, Kec Y" />
              </div>

              <div className="space-y-2">
                <Label>Status Tim</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Bertugas Aktif</SelectItem>
                    <SelectItem value="selesai">Misi Selesai</SelectItem>
                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Tanggal Mulai</Label>
                   <Input type="date" value={formData.tanggal_mulai} onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                   <Label>Tanggal Selesai</Label>
                   <Input type="date" value={formData.tanggal_selesai} onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })} />
                 </div>
              </div>
            </div>

            {/* Right Column - Members Checklist */}
            <div className="space-y-2 border rounded-md p-4 bg-muted/30">
              <Label>Komposisi Anggota (Personil Terverifikasi)</Label>
              <div className="h-[300px] overflow-y-auto space-y-2 pt-2 pr-2 border-t border-border mt-2">
                 {relawanList.length === 0 && <p className="text-sm text-muted-foreground p-2">Tidak ada relawan tersedia.</p>}
                 {relawanList.map((r) => (
                   <label key={r.id} className="flex items-center space-x-3 p-2 border rounded hover:bg-muted/50 cursor-pointer">
                     <input 
                       type="checkbox" 
                       className="w-4 h-4 rounded border-gray-300" 
                       checked={formData.anggota_ids.includes(r.id)} 
                       onChange={() => handleRelawanToggle(r.id)} 
                     />
                     <div className="flex flex-col">
                       <span className="text-sm font-medium">{r.nama_lengkap}</span>
                       <span className="text-xs text-muted-foreground overflow-x-hidden text-ellipsis whitespace-nowrap">{r.email}</span>
                     </div>
                   </label>
                 ))}
              </div>
            </div>

          </div>

          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>Simpan & Otomasi Surat Tugas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buku Ekspedisi: {selectedItem?.nama_tim}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start border-b pb-4">
                 <div>
                   <h3 className="text-xl font-bold bg-primary/10 text-primary px-3 py-1 rounded inline-block">{selectedItem.nama_tim}</h3>
                   <span className="text-muted-foreground text-sm block mt-2">Beroperasi di: <span className="font-semibold">{selectedItem.lokasi_penugasan}</span></span>
                 </div>
                 <div className="flex gap-2 text-right">
                    <div className="flex flex-col items-end">
                       <span className="text-xs uppercase text-muted-foreground block mb-1">Status Operitas</span>
                       <span className={`status-badge text-sm ${selectedItem.status === 'aktif' ? 'bg-primary/10 text-primary' : selectedItem.status === 'selesai' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                         {selectedItem.status.toUpperCase()}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 border rounded shadow-sm">
                   <span className="text-xs uppercase text-muted-foreground block mb-1">Bencana Ditangani</span>
                   <span className="font-medium text-sm text-destructive">{(selectedItem as any).bencana_nama}</span>
                 </div>
                 <div className="p-3 border rounded shadow-sm">
                   <span className="text-xs uppercase text-muted-foreground block mb-1">Durasi Bertugas</span>
                   <span className="font-medium text-sm">
                      {new Date(selectedItem.tanggal_mulai).toLocaleDateString('id-ID')} - {new Date(selectedItem.tanggal_selesai).toLocaleDateString('id-ID')}
                   </span>
                 </div>
              </div>

              <div className="space-y-3 pt-2">
                 <div className="flex items-center space-x-2 border-b pb-2">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold block">Personil Regu ({selectedItem.anggota?.length || 0} Orang)</span>
                 </div>
                 <div className="bg-muted/30 p-4 rounded-lg border max-h-[250px] overflow-y-auto">
                    {selectedItem.anggota && selectedItem.anggota.length > 0 ? (
                       <ul className="space-y-2">
                         {selectedItem.anggota.map(a => (
                           <li key={a.id} className="text-sm font-medium p-2 bg-card border rounded flex items-center justify-between">
                              {a.nama_lengkap}
                              {a.nomor_hp && <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{a.nomor_hp}</span>}
                           </li>
                         ))}
                       </ul>
                    ) : (
                       <span className="italic text-muted-foreground text-sm">Tim ini belum memiliki anggota operasional.</span>
                    )}
                 </div>
              </div>
            </div>
          )}
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Tutup Mode Baca</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> Bubarkan Tim Penugasan?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan membongkar riwayat relasional Penugasan <strong>{selectedItem?.nama_tim}</strong>. Data ini akan hilang dari riwayat penugasan masing-masing anggotanya. Lanjut?
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

export default PenugasanPage;
