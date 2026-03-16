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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Eye, CheckCircle, XCircle, MoreHorizontal, Trash2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { Relawan, Organisasi, Keahlian } from '@/types';

const RelawanPage = () => {
  const [relawans, setRelawans] = useState<Relawan[]>([]);
  const [organisasiList, setOrganisasiList] = useState<Organisasi[]>([]);
  const [keahlianList, setKeahlianList] = useState<Keahlian[]>([]);
  
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdminOrOperator = hasPermission(['admin', 'operator', 'pimpinan']);
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRelawan, setSelectedRelawan] = useState<Relawan | null>(null);

  const [formData, setFormData] = useState({
    nama_lengkap: '', email: '', password: '', nik: '',
    nomor_hp: '', alamat: '', organisasi_id: '', keahlian_ids: [] as string[]
  });

  const fetchDeps = async () => {
    try {
      const [o, k] = await Promise.all([apiClient.get('/organisasi'), apiClient.get('/keahlian')]);
      setOrganisasiList(o.data.data);
      setKeahlianList(k.data.data);
    } catch {
       toast({ title: 'Warning', description: 'Gagal memuat depedensi filter master', variant: 'destructive' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/relawan');
      setRelawans(response.data.data);
    } catch (error) {
       toast({ title: 'Error', description: 'Gagal memuat data relawan', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDeps();
  }, []);

  const handleOpenDialog = (item?: Relawan) => {
    if (item) {
      setSelectedRelawan(item);
      setFormData({
        nama_lengkap: item.nama_lengkap, email: item.email, password: '', // Password intentionally empty on edit
        nik: item.nik, nomor_hp: item.nomor_hp, alamat: item.alamat,
        organisasi_id: item.organisasi_id || 'unaffiliated',
        keahlian_ids: item.keahlian.map(k => k.id) || []
      });
    } else {
      setSelectedRelawan(null);
      setFormData({
        nama_lengkap: '', email: '', password: '', nik: '',
        nomor_hp: '', alamat: '', organisasi_id: 'unaffiliated', keahlian_ids: []
      });
    }
    setIsDialogOpen(true);
  };

  const handleOpenView = (item: Relawan) => {
    setSelectedRelawan(item);
    setIsViewDialogOpen(true);
  };

  const handleKeahlianToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      keahlian_ids: prev.keahlian_ids.includes(id) ? prev.keahlian_ids.filter(x => x !== id) : [...prev.keahlian_ids, id]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nama_lengkap || !formData.email || !formData.nik || !formData.nomor_hp || formData.keahlian_ids.length === 0) {
      toast({ title: 'Error', description: 'Pastikan Nama, Email, NIK, No HP, dan minim 1 Keahlian terisi!', variant: 'destructive' });
      return;
    }

    const payload: any = { ...formData };
    if (payload.organisasi_id === 'unaffiliated') delete payload.organisasi_id;

    try {
      if (selectedRelawan) {
        // Edit mode (password not needed)
        delete payload.email; delete payload.password; delete payload.nik; // Deny editing core identity roots to prevent sync orphans
        await apiClient.put(`/relawan/${selectedRelawan.id}`, payload);
        toast({ title: 'Sukses', description: 'Update profil relawan berhasil disimpan.' });
      } else {
        // Add mode (Admin forces register bypassing open-signup queue natively returning logic)
        if (!formData.password) {
           toast({ title: 'Sandi Hilang', description: 'Pendaftaran relawan baru wajib menyertakan Password Login awal', variant: 'destructive' });
           return;
        }
        await apiClient.post('/relawan/register', payload);
        toast({ title: 'Sukses', description: 'Relawan baru berhasil didaftarkan. Anda perlu memverifikasi manual jika statusnya masih Pending.' });
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Gagal', description: error.response?.data?.message || 'Validasi Error Server.', variant: 'destructive' });
    }
  };

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await apiClient.patch(`/relawan/${id}/verify`, { status_verifikasi: status });
      toast({ title: 'Sukses', description: `Relawan berhasil di-${status}` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memverifikasi', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedRelawan) return;
    try {
      await apiClient.delete(`/relawan/${selectedRelawan.id}`);
      toast({ title: 'Sukses', description: 'Atribut relawan terhapus permanen.' });
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Relawan>[] = [
    { accessorKey: 'nama_lengkap', header: 'Nama' },
    { accessorKey: 'nik', header: 'NIK' },
    { id: 'organisasi_nama', header: 'Organisasi', cell: ({ row }) => row.original.organisasi ? row.original.organisasi.nama_organisasi : '-' },
    { accessorKey: 'nomor_hp', header: 'No. HP' },
    { id: 'keahlian', header: 'Keahlian Dasar', cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.keahlian?.map((k) => (
          <span key={k.id} className="status-badge bg-primary/10 text-primary">{k.nama}</span>
        ))}
      </div>
    )},
    { accessorKey: 'status_verifikasi', header: 'Access Tiers', cell: ({ row }) => <StatusBadge status={row.original.status_verifikasi} type="verification" /> },
    { id: 'aksi', header: 'Manajemen', cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleOpenView(row.original)}><Eye className="h-4 w-4 mr-2" /> Detail Info</DropdownMenuItem>
          {isAdminOrOperator && (
             <DropdownMenuItem onClick={() => handleOpenDialog(row.original)}><Edit className="h-4 w-4 mr-2 text-primary" /> Edit Profil</DropdownMenuItem>
          )}
          {isAdminOrOperator && row.original.status_verifikasi === 'pending' && (
             <DropdownMenuItem onClick={() => handleVerify(row.original.id, 'approved')}><CheckCircle className="h-4 w-4 mr-2 text-success" /> Approve Verifikasi</DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => { setSelectedRelawan(row.original); setIsDeleteDialogOpen(true); }}>
              <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Suspend Akun
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="page-container">
      <PageHeader 
        title="Buku Induk Relawan" 
        description="Pengelolaan sentral verifikasi identitas dan akun akses pelayan kemanusiaan" 
        action={isAdmin ? { label: 'Register Relawan Baru', onClick: () => handleOpenDialog() } : undefined} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <DataTable columns={columns} data={relawans} searchPlaceholder="Cari registrasi berdasarkan subjek..." />
      )}

      {/* Add / Edit Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[750px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRelawan ? `Edit Kredensial Lapangan: ${selectedRelawan.nama_lengkap}` : 'Form Pendaftaran Identitas Volunter'}</DialogTitle>
            <DialogDescription>Pengaturan ini bersifat sensitif karena mempengaruhi Auth Gate pengguna mobile dan riwayat logistik.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-4">
             
             {/* Kiri - Identitas Inti */}
             <div className="space-y-4">
               {!selectedRelawan && (
                 <div className="space-y-2 p-3 border rounded-md bg-muted/30">
                   <Label className="text-primary font-semibold">Tugas Admin: Setup Akun Awal</Label>
                   <div className="grid gap-2 mt-2">
                     <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email Logins..." />
                     <Input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Default Password awal..." />
                   </div>
                 </div>
               )}
               
               <div className="space-y-2">
                 <Label>Nomor Induk Kependudukan (NIK)</Label>
                 <Input value={formData.nik} disabled={!!selectedRelawan} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} placeholder="16 Digit NIK valid" />
               </div>

               <div className="space-y-2">
                 <Label>Nama Sesuai KTP</Label>
                 <Input value={formData.nama_lengkap} onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })} placeholder="John Doe" />
               </div>

               <div className="space-y-2">
                 <Label>Nomor Kontak Seluler (HP/WA)</Label>
                 <Input value={formData.nomor_hp} onChange={(e) => setFormData({ ...formData, nomor_hp: e.target.value })} placeholder="0812..." />
               </div>

               <div className="space-y-2">
                 <Label>Alamat Definitif</Label>
                 <Textarea value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} rows={2} />
               </div>
             </div>

             {/* Kanan - Profesionalisme */}
             <div className="space-y-4">
               <div className="space-y-2">
                  <Label>Afiliasi Organisasi Induk</Label>
                  <Select value={formData.organisasi_id} onValueChange={(val) => setFormData({ ...formData, organisasi_id: val })}>
                    <SelectTrigger><SelectValue placeholder="Pilih Entitas Induk..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unaffiliated">Independen (Tidak Berorganisasi)</SelectItem>
                      {organisasiList.map((o) => (
                        <SelectItem key={o.id} value={o.id}>{o.nama_organisasi}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2 border rounded-md p-3 bg-card h-[280px] flex flex-col">
                  <Label className="mb-2 shrink-0">Bakat dan Keahlian Tersertifikasi (Pilih ≥1)</Label>
                  <div className="overflow-y-auto space-y-2 pr-2">
                     {keahlianList.map((k) => (
                       <label key={k.id} className="flex items-start space-x-3 p-2 border rounded hover:bg-muted/50 cursor-pointer">
                         <input 
                           type="checkbox" 
                           className="mt-1"
                           checked={formData.keahlian_ids.includes(k.id)}
                           onChange={() => handleKeahlianToggle(k.id)}
                         />
                         <div className="flex flex-col">
                           <span className="text-sm font-semibold">{k.nama}</span>
                           <span className="text-xs text-muted-foreground line-clamp-1">{k.kategori} - {k.deskripsi}</span>
                         </div>
                       </label>
                     ))}
                  </div>
               </div>
             </div>

          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Tutup</Button>
             <Button onClick={handleSubmit}>{selectedRelawan ? 'Mutasi Data Tersimpan' : 'Force Insert Master Data'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buku Profil Relawan</DialogTitle>
            <DialogDescription>Rincian biografi dan riwayat sertifikasi unit lapangan.</DialogDescription>
          </DialogHeader>
          {selectedRelawan && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-6">
                 <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center border-4 border-primary/20 shrink-0">
                    <span className="text-3xl font-bold text-primary">{selectedRelawan.nama_lengkap.charAt(0)}</span>
                 </div>
                 <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-bold">{selectedRelawan.nama_lengkap}</h3>
                    <div className="flex items-center gap-2">
                       <StatusBadge status={selectedRelawan.status_verifikasi} type="verification" />
                       <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border">
                         {selectedRelawan.organisasi ? selectedRelawan.organisasi.nama_organisasi : 'Relawan Independen'}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Grid 2 Columns */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">Identitas Kependudukan</h4>
                  <div className="space-y-3 shrink-0">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase block mb-1">NIK (KTP)</span>
                      <span className="font-medium font-mono text-sm">{selectedRelawan.nik}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase block mb-1">Email (Kontak Sistem)</span>
                      <span className="font-medium text-sm">{selectedRelawan.email}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase block mb-1">No. Seluler (WhatsApp)</span>
                      <span className="font-medium text-sm">{selectedRelawan.nomor_hp}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground uppercase block mb-1">Alamat Tinggal</span>
                      <span className="text-sm block leading-relaxed">{selectedRelawan.alamat}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">Keahlian & Tagging Regu</h4>
                  {selectedRelawan.keahlian && selectedRelawan.keahlian.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {selectedRelawan.keahlian.map((k) => (
                        <div key={k.id} className="p-3 border rounded-lg bg-card shadow-sm flex flex-col">
                           <span className="text-sm font-bold text-primary">{k.nama}</span>
                           <span className="text-xs text-muted-foreground mt-1">{k.kategori} - {k.deskripsi}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-sm">
                       Belum ada klasifikasi keahlian terdaftar.
                    </div>
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

      {/* Delete Alert */}
      {isAdmin && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> Penangguhan Identitas?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan memborgol profil relawan <strong>{selectedRelawan?.nama_lengkap}</strong> beserta akses login akun pengguna yang bersangkutan. Tindakan ini memusnahkan historis penugasan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mundur</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Hapus Paksa Profil</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RelawanPage;
