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
import { Expand, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { LaporanKegiatan, Bencana } from '@/types';

const LaporanPage = () => {
  const [laporan, setLaporan] = useState<LaporanKegiatan[]>([]);
  const [bencanaList, setBencanaList] = useState<Bencana[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const isRelawan = hasPermission(['relawan']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LaporanKegiatan | null>(null);

  const [formData, setFormData] = useState({
    bencana_id: '',
    judul_laporan: '',
    deskripsi: '',
    jumlah_penerima_bantuan: '',
    kendala_lapangan: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lRes, bRes] = await Promise.all([
        apiClient.get('/laporan'),
        apiClient.get('/bencana')
      ]);
      setLaporan(lRes.data.data);
      setBencanaList(bRes.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data laporan', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setFormData({
      bencana_id: '',
      judul_laporan: '',
      deskripsi: '',
      jumlah_penerima_bantuan: '',
      kendala_lapangan: ''
    });
    setIsDialogOpen(true);
  };

  const handleOpenView = (item: LaporanKegiatan) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.bencana_id || !formData.judul_laporan || !formData.deskripsi) {
      toast({ title: 'Error', description: 'Harap lengkapi opsi Bencana, Judul, dan Deskripsi', variant: 'destructive' });
      return;
    }

    try {
      await apiClient.post('/laporan', formData);
      toast({ title: 'Sukses', description: 'Laporan Anda telah terekam di sistem.' });
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Gagal mengirim laporan. Pastikan Anda sudah terdaftar masuk sebagai Relawan aktif.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await apiClient.delete(`/laporan/${selectedItem.id}`);
      toast({ title: 'Sukses', description: 'Log laporan dihapus permanen.' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<LaporanKegiatan>[] = [
    { accessorKey: 'judul_laporan', header: 'Judul' },
    { accessorKey: 'relawan_nama', header: 'Pelapor' },
    { accessorKey: 'bencana_nama', header: 'Bencana Tertaut' },
    { accessorKey: 'jumlah_penerima_bantuan', header: 'Penerima Manfaat' },
    { accessorKey: 'created_at', header: 'Tanggal Submit', cell: ({ row }) => new Date(row.original.created_at).toLocaleString('id-ID') },
    { id: 'aksi', header: 'Aksi', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenView(row.original)}><Expand className="h-4 w-4 mr-2" /> Detail Teks</DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsDeleteDialogOpen(true); }}>
              <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Hapus Log
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Laporan Lapangan" 
        description="Jurnal log operasional dan eskalasi hambatan" 
        action={isRelawan ? { label: 'Tulis Laporan', onClick: handleOpenDialog } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={laporan} searchPlaceholder="Cari riwayat laporan..." />
      )}

      {/* Write Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buat Jurnal Laporan Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="space-y-2">
              <Label>Kejadian Bencana Terkait</Label>
              <Select value={formData.bencana_id} onValueChange={(val) => setFormData({ ...formData, bencana_id: val })}>
                <SelectTrigger><SelectValue placeholder="Pilih Bencana..." /></SelectTrigger>
                <SelectContent>
                  {bencanaList.map((ben) => (
                    <SelectItem key={ben.id} value={ben.id}>{ben.nama_bencana}</SelectItem>
                  ))}
                  {bencanaList.length === 0 && <SelectItem value="-" disabled>Tidak ada bencana memuat data</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
               <Label>Judul Laporan Singkat</Label>
               <Input value={formData.judul_laporan} onChange={(e) => setFormData({ ...formData, judul_laporan: e.target.value })} placeholder="Cth: Distribusi Log Posko X" />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Kegiatan Utama</Label>
              <Textarea 
                 value={formData.deskripsi} 
                 onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} 
                 placeholder="Uraikan detail pekerjaan darurat yang dilakukan..." 
                 rows={3} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimasi Jiwa Terbantu</Label>
                <Input type="number" min="0" value={formData.jumlah_penerima_bantuan} onChange={(e) => setFormData({ ...formData, jumlah_penerima_bantuan: e.target.value })} placeholder="Opsional (0)" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Kendala / Eskalasi Masalah Lapangan</Label>
              <Textarea 
                 value={formData.kendala_lapangan} 
                 onChange={(e) => setFormData({ ...formData, kendala_lapangan: e.target.value })} 
                 placeholder="Opsional - Tulis hambatan agar diketahui Admin posko induk" 
                 rows={2} 
              />
            </div>

          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>Kirim Berkas Laporan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Jadwal Piket Laporan: {selectedItem?.judul_laporan}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6 py-4">
              
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                 <div>
                   <span className="text-xs uppercase text-muted-foreground block mb-1">Pelapor</span>
                   <span className="font-semibold text-sm">{selectedItem.relawan_nama}</span>
                 </div>
                 <div>
                   <span className="text-xs uppercase text-muted-foreground block mb-1">Waktu Submit</span>
                   <span className="font-medium text-sm">
                      {new Date(selectedItem.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                   </span>
                 </div>
                 <div className="col-span-2">
                   <span className="text-xs uppercase text-muted-foreground block mb-1">Insiden Acuan Darurat</span>
                   <span className="inline-block px-2 py-0.5 mt-1 bg-destructive/10 text-destructive text-sm font-semibold rounded border border-destructive/20">{selectedItem.bencana_nama}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                   <span className="text-sm font-bold text-foreground block mb-2">Pekerjaan Lapangan:</span>
                   <div className="bg-muted/40 p-3 rounded-md border text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedItem.deskripsi}
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-md">
                      <span className="text-xs uppercase text-muted-foreground block">Penerima Manfaat</span>
                      <span className="text-xl font-bold">{selectedItem.jumlah_penerima_bantuan} <span className="text-sm font-normal text-muted-foreground">Jiwa</span></span>
                    </div>
                 </div>

                 <div>
                   <span className="text-sm font-bold text-foreground block mb-2">Kendala Terekam:</span>
                   <div className="bg-warning/10 p-3 rounded-md border border-warning/20 text-sm leading-relaxed whitespace-pre-wrap text-warning-foreground">
                      {selectedItem.kendala_lapangan || <span className="italic">Aman terkendali. Tidak ada anomali atau defisit tercatat.</span>}
                   </div>
                 </div>
              </div>

            </div>
          )}
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Tutup Buku Jurnal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Entry Log?</AlertDialogTitle>
              <AlertDialogDescription>Laporan tidak akan dapat dipulihkan. Teruskan blokir data histori?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Blank Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default LaporanPage;
