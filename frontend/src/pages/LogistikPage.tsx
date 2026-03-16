import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { Logistik, MasterData } from '@/types';

const LogistikPage = () => {
  const [logistik, setLogistik] = useState<Logistik[]>([]);
  const [logistikKatOpts, setLogistikKatOpts] = useState<MasterData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Logistik | null>(null);

  const [formData, setFormData] = useState({
    nama_peralatan: '',
    kategori: '',
    stok: '0',
    lokasi_penyimpanan: '',
    kondisi: 'baik'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resData, resMaster] = await Promise.all([
         apiClient.get('/logistik'),
         apiClient.get('/master-data?kategori=KATEGORI_LOGISTIK')
      ]);
      setLogistik(resData.data.data);
      setLogistikKatOpts(resMaster.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat inventaris gudang posko berserta master', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (item?: Logistik) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        nama_peralatan: item.nama_peralatan,
        kategori: item.kategori,
        stok: String(item.stok),
        lokasi_penyimpanan: item.lokasi_penyimpanan,
        kondisi: item.kondisi
      });
    } else {
      setSelectedItem(null);
      setFormData({
        nama_peralatan: '',
        kategori: '',
        stok: '1',
        lokasi_penyimpanan: '',
        kondisi: 'baik'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nama_peralatan || !formData.kategori || !formData.lokasi_penyimpanan) {
      toast({ title: 'Error', description: 'Pastikan Nama, Kategori, dan Lokasi Barang terisi!', variant: 'destructive' });
      return;
    }

    try {
      if (selectedItem) {
        await apiClient.put(`/logistik/${selectedItem.id}`, formData);
        toast({ title: 'Sukses', description: 'Data item gudang berhasil diperbarui.' });
      } else {
        await apiClient.post('/logistik', formData);
        toast({ title: 'Sukses', description: 'Peralatan relawan berhasil disertakan di dalam Gudang.' });
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
      await apiClient.delete(`/logistik/${selectedItem.id}`);
      toast({ title: 'Sukses', description: 'Item diputuskan dan dicabut dari inventaris.' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal mencabut item', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Logistik>[] = [
    { accessorKey: 'nama_peralatan', header: 'Peralatan' },
    { accessorKey: 'kategori', header: 'Jenis / Kategori' },
    { accessorKey: 'stok', header: 'Estimasi Stok', cell: ({ row }) => (
      <span className={row.original.stok < 20 ? 'text-destructive font-bold' : 'text-foreground font-medium'}>
        {row.original.stok}
      </span>
    )},
    { accessorKey: 'lokasi_penyimpanan', header: 'Penyimpanan' },
    { accessorKey: 'kondisi', header: 'Status Kondisi', cell: ({ row }) => (
      <span className={`status-badge ${row.original.kondisi === 'baik' ? 'bg-success/10 text-success' : row.original.kondisi === 'rusak_ringan' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
        {row.original.kondisi.replace('_', ' ').toUpperCase()}
      </span>
    )},
    { id: 'aksi', header: 'Manajemen', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isAdminOrOp && (
            <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
              <Edit className="h-4 w-4 mr-2 text-primary" /> Edit Stok/Item
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsDeleteDialogOpen(true); }}>
              <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Buang Objek
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Manajemen Logistik Perlengkapan" 
        description="Pelacakan sediaan stok material yang dialokasikan bagi operasi lapangan" 
        action={isAdminOrOp ? { label: 'Register Barang Baru', onClick: () => handleOpenDialog() } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={logistik} searchPlaceholder="Cari tipe nama perlengkapan gudang..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Update Spesifikasi Material' : 'Tambahkan Tipe Material Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="space-y-2">
               <Label>Identitas Nama Peralatan</Label>
               <Input value={formData.nama_peralatan} onChange={(e) => setFormData({ ...formData, nama_peralatan: e.target.value })} placeholder="Cth: Tenda Baracuda Pleton 2.1" />
            </div>

            <div className="space-y-2">
               <Label>Kategori Tagging</Label>
               <Select value={formData.kategori} onValueChange={(val) => setFormData({ ...formData, kategori: val })}>
                 <SelectTrigger><SelectValue placeholder="Pilih Jenis Peralatan" /></SelectTrigger>
                 <SelectContent>
                   {logistikKatOpts.map(opt => (
                     <SelectItem key={opt.id} value={opt.nilai}>{opt.nilai}</SelectItem>
                   ))}
                   {logistikKatOpts.length === 0 && (
                     <SelectItem value="none" disabled>Data Master kosong</SelectItem>
                   )}
                 </SelectContent>
               </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Gudang</Label>
                <Input type="number" min="0" value={formData.stok} onChange={(e) => setFormData({ ...formData, stok: e.target.value })} placeholder="Unit Sisa" />
              </div>
              <div className="space-y-2">
                <Label>Kondisi Agregat</Label>
                <Select value={formData.kondisi} onValueChange={(val) => setFormData({ ...formData, kondisi: val })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baik">Optimal (Baik)</SelectItem>
                    <SelectItem value="rusak_ringan">Pemeliharaan Ringan</SelectItem>
                    <SelectItem value="rusak_berat">Barang Usang/Rusak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
               <Label>Rak / Ruang Lokasi</Label>
               <Input value={formData.lokasi_penyimpanan} onChange={(e) => setFormData({ ...formData, lokasi_penyimpanan: e.target.value })} placeholder="Blok C, Rak 11 Posko Utama" />
            </div>

          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>{selectedItem ? 'Validasi Stok' : 'Catat Item Masuk Gudang'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cabut Logistik Permamen?</AlertDialogTitle>
              <AlertDialogDescription>Barang <strong>{selectedItem?.nama_peralatan}</strong> tidak akan tampil kembali dalam formasi inventaris posko relawan mana pun. Yakin membuang?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal Evaluasi</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Hapus Bersih Barang</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default LogistikPage;
