import { PageHeader } from '@/components/shared/PageHeader';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * Profil Page
 * Shows current user profile
 * API ENDPOINT: GET /api/users/me → User
 * PUT /api/users/me → Update profile
 */
const ProfilPage = () => {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const { toast } = useToast();

  return (
    <div className="page-container">
      <PageHeader title="Profil Saya" description="Informasi akun pengguna" />
      <div className="max-w-lg">
        <div className="form-section">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {user?.nama?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{user?.nama || 'User'}</h2>
              <span className="status-badge bg-primary/10 text-primary">{role || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input defaultValue={user?.nama} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email} type="email" />
            </div>
            <Button onClick={() => toast({ title: 'Profil Diperbarui' })}>Simpan Perubahan</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
