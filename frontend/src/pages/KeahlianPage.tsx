import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Wrench } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import type { Keahlian } from '@/types';

const KeahlianPage = () => {
  const [keahlian, setKeahlian] = useState<Keahlian[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const isAdmin = hasPermission(['admin']);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    deskripsi: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/keahlian');
      setKeahlian(response.data.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal memuat data keahlian', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.nama || !formData.kategori) {
      toast({ title: 'Error', description: 'Nama dan Kategori wajib diisi!', variant: 'destructive' });
      return;
    }
    
    try {
      await apiClient.post('/keahlian', formData);
      toast({ title: 'Sukses', description: 'Keahlian berhasil ditambahkan.' });
      setIsDialogOpen(false);
      setFormData({ nama: '', kategori: '', deskripsi: '' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Gagal menyimpan.', variant: 'destructive' });
    }
  };

  const categories = [...new Set(keahlian.map((k) => k.kategori))];

  return (
    <div className="page-container">
      <PageHeader 
        title="Data Keahlian" 
        description="Direktori master data kategori & spesialisasi keahlian yang dimiliki relawan." 
        action={isAdmin ? { label: 'Tambah Keahlian', onClick: () => setIsDialogOpen(true) } : undefined} 
      />

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : keahlian.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
          Belum ada data keahlian yang terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat} className="stat-card border border-border/50 bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3">{cat}</h3>
              <div className="space-y-2">
                {keahlian.filter((k) => k.kategori === cat).map((k) => (
                  <div key={k.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-transparent hover:border-border transition-colors">
                    <Wrench className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{k.nama}</p>
                      {k.deskripsi && <p className="text-xs text-muted-foreground mt-0.5">{k.deskripsi}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Add Master Data */}
      {isAdmin && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Data Keahlian</DialogTitle>
              <DialogDescription>
                Tambahkan spesialisasi baru agar dapat dipilih oleh relawan saat mendaftar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nama Keahlian/Spesialisasi</Label>
                <Input value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Evakuasi Air, Medis Darurat" />
              </div>
              <div className="space-y-2">
                <Label>Kategori Grup</Label>
                <Input value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} placeholder="Contoh: SAR & Evakuasi" />
                <p className="text-[10px] text-muted-foreground">Keahlian dengan kategori yang sama akan dikelompokkan otomatis.</p>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi (Opsional)</Label>
                <Input value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Kualifikasi singkat yang dibutuhkan..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSubmit}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default KeahlianPage;
