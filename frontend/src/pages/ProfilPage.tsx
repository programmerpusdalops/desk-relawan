import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import apiClient from '@/lib/api';
import { KeyRound } from 'lucide-react';

/**
 * Profil Page
 * Shows current user profile and allows password changes.
 */
const ProfilPage = () => {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const { toast } = useToast();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passData, setPassData] = useState({ password_lama: '', password_baru: '', konfirmasi: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!passData.password_lama || !passData.password_baru) {
       return toast({ title: 'Error', description: 'Harap isi password lama dan baru.', variant: 'destructive' });
    }
    if (passData.password_baru !== passData.konfirmasi) {
       return toast({ title: 'Error', description: 'Konfirmasi password baru tidak cocok.', variant: 'destructive' });
    }
    if (passData.password_baru.length < 6) {
       return toast({ title: 'Error', description: 'Password baru minimal 6 karakter.', variant: 'destructive' });
    }

    setLoading(true);
    try {
      const res = await apiClient.put('/auth/password', {
        password_lama: passData.password_lama,
        password_baru: passData.password_baru
      });
      toast({ title: 'Autentikasi Diperbarui', description: res.data.message });
      setIsPasswordDialogOpen(false);
      setPassData({ password_lama: '', password_baru: '', konfirmasi: '' });
    } catch (error: any) {
      toast({ title: 'Perubahan Ditolak', description: error.response?.data?.message || 'Gagal mengubah password.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Profil Saya" description="Pengaturan dasar identitas akun operasional Anda" />
      <div className="max-w-xl">
        <div className="stat-card">
          <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary ring-4 ring-primary/5">
                {user?.nama?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">{user?.nama || 'User'}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <span className="status-badge bg-primary/10 text-primary px-3 py-0.5">{role || 'N/A'}</span>
                   <span className="text-sm font-mono text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Nama Lengkap</Label>
              <Input defaultValue={user?.nama} readOnly className="bg-muted/30 font-medium" />
            </div>
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Alamat Email Tautkan</Label>
              <Input defaultValue={user?.email} type="email" readOnly className="bg-muted/30 font-medium font-mono" />
            </div>
            
            <div className="pt-4 flex justify-between items-center border-t border-border mt-4">
              <div className="text-sm text-muted-foreground">
                <p>Mengatur keamanan akun.</p>
              </div>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)} className="gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Ubah Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ubah Kata Sandi</DialogTitle>
            <DialogDescription>Pastikan Anda mengingat password lama untuk otorisasi keamanan.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Password Saat Ini</Label>
              <Input 
                 type="password" 
                 placeholder="Masukkan password asli..."
                 value={passData.password_lama} 
                 onChange={e => setPassData({...passData, password_lama: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Password Baru</Label>
              <Input 
                 type="password" 
                 placeholder="Minimal 6 karakter"
                 value={passData.password_baru} 
                 onChange={e => setPassData({...passData, password_baru: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Ketik Ulang Password Baru</Label>
              <Input 
                 type="password" 
                 placeholder="Konfirmasi password baru"
                 value={passData.konfirmasi} 
                 onChange={e => setPassData({...passData, konfirmasi: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPasswordDialogOpen(false)} disabled={loading}>Batal</Button>
            <Button onClick={handleUpdatePassword} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Ganti Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilPage;
