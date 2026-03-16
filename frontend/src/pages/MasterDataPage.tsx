import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { MasterData } from '@/types';

// Standalone list of known categories we want to supply as quick templates.
const KNOWN_CATEGORIES = [
  { value: 'JENIS_BENCANA', label: 'Jenis Bencana (Banjir, Gempa...)' },
  { value: 'KATEGORI_LOGISTIK', label: 'Kategori Logistik (Tenda, Medis...)' },
  { value: 'GOLONGAN_DARAH', label: 'Golongan Darah (A, B, O...)' },
];

const MasterDataPage = () => {
  const [data, setData] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  
  // Note: Standard operations usually open to Operator/Admin
  const isAdminOrOp = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterData | null>(null);

  const [formData, setFormData] = useState({
    kategori: '',
    nilai: '',
    deskripsi: ''
  });

  // Toggle allowing user to type custom categories manually if not in list
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/master-data');
      setData(response.data.data);
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal memuat Master Data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (item?: MasterData) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        kategori: item.kategori,
        nilai: item.nilai,
        deskripsi: item.deskripsi || ''
      });
      setIsCustomCategory(!KNOWN_CATEGORIES.some(c => c.value === item.kategori));
    } else {
      setSelectedItem(null);
      setFormData({ kategori: 'JENIS_BENCANA', nilai: '', deskripsi: '' });
      setIsCustomCategory(false);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.kategori || !formData.nilai) {
      toast({ title: 'Error', description: 'Kategori dan Nilai Item wajib disi.', variant: 'destructive' });
      return;
    }

    try {
      if (selectedItem) {
        await apiClient.put(`/master-data/${selectedItem.id}`, formData);
        toast({ title: 'Sukses', description: 'Update data sinkron.' });
      } else {
        await apiClient.post('/master-data', formData);
        toast({ title: 'Sukses', description: 'Master Data baru tersimpan.' });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Gagal menyimpan / Duplikat.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await apiClient.delete(`/master-data/${selectedItem.id}`);
      toast({ title: 'Sukses', description: 'Nilai master tercabut.' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal mencabut. Item mungkin sedang dikunci rujukan.', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<MasterData>[] = [
    { accessorKey: 'kategori', header: 'Kategori Modul', cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold bg-muted py-1 px-2 rounded tracking-widest">{row.original.kategori}</span>
    )},
    { accessorKey: 'nilai', header: 'Nilai (Value)' },
    { accessorKey: 'deskripsi', header: 'Sub-Keterangan', cell: ({ row }) => <span className="text-muted-foreground">{row.original.deskripsi || '-'}</span> },
    { id: 'aksi', header: 'Manajemen', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isAdminOrOp && (
            <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}>
              <Edit className="h-4 w-4 mr-2 text-primary" /> Edit Key
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedItem(row.original); setIsDeleteDialogOpen(true); }}>
              <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Buang Master
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Pengaturan Data Master Umum" 
        description="Pusat kontrol daftar pilihan global (Dropdowns) dinamis di berbagai modul agar tidak mengetik ulang." 
        action={isAdminOrOp ? { label: 'Register Master Baru', onClick: () => handleOpenDialog() } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={data} searchPlaceholder="Cari kategori atau pilihan nilai..." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Update Terminologi Data' : 'Tambah Register Master'}</DialogTitle>
            <DialogDescription>Data terpusat ini akan mensubstitusi kolom form di modul operasional secara dinamis.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                 <Label>Pilih Induk Kategori Referensi</Label>
                 <button 
                   type="button" 
                   onClick={() => { setIsCustomCategory(!isCustomCategory); setFormData({ ...formData, kategori: '' }); }}
                   className="text-xs text-primary font-medium hover:underline"
                 >
                   {isCustomCategory ? 'Gunakan Preset' : 'Ketikan Kategori Lain'}
                 </button>
               </div>
               
               {isCustomCategory ? (
                 <Input 
                   value={formData.kategori} 
                   onChange={(e) => setFormData({ ...formData, kategori: e.target.value.toUpperCase().replace(/\s+/g, '_') })} 
                   placeholder="Contoh: TIPE_PENYAKIT" 
                   className="font-mono"
                 />
               ) : (
                 <Select value={formData.kategori} onValueChange={(val) => setFormData({ ...formData, kategori: val })}>
                   <SelectTrigger><SelectValue placeholder="Templat Terkenal" /></SelectTrigger>
                   <SelectContent>
                     {KNOWN_CATEGORIES.map(c => (
                       <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               )}
            </div>

            <div className="space-y-2">
               <Label>Judul Nilai Baru</Label>
               <Input value={formData.nilai} onChange={(e) => setFormData({ ...formData, nilai: e.target.value })} placeholder="Cth: Angin Puting Beliung" />
            </div>

            <div className="space-y-2">
               <Label>Singkatan / Penjelasan (Opsional)</Label>
               <Textarea 
                 value={formData.deskripsi} 
                 onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} 
                 placeholder="Cth: Hanya angin di atas >60kmh" 
                 rows={2} 
               />
            </div>

          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
             <Button onClick={handleSubmit}>Simpan Register Global</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Pencomotan Index Register?</AlertDialogTitle>
              <AlertDialogDescription>Variabel nilai <strong>{selectedItem?.nilai}</strong> akan dilarang dipakai di inputan Dropdown baru. Yakin?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={handleDelete}>Hapus Master Item</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default MasterDataPage;
