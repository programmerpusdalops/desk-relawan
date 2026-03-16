import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';

/**
 * Login Page
 * API ENDPOINT: POST /api/auth/login
 * REQUEST BODY: { email: string, password: string }
 * RESPONSE: { token: string, user_id: string, role: string, user: User }
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Execute Real Backend Request
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { user, token, role } = response.data;

      // Update state
      setAuth({ user, token, role });
      
      toast({ title: 'Login Berhasil', description: `Selamat datang, ${user.nama}!` });
      navigate('/dashboard');
    } catch (error: any) {
      toast({ 
        title: 'Login Gagal', 
        description: error.response?.data?.message || 'Email atau password salah', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary mb-4">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sistem Desk Relawan</h1>
          <p className="text-sm text-muted-foreground mt-1">BPBD - Badan Penanggulangan Bencana Daerah</p>
        </div>

        <div className="form-section">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => navigate('/register')} className="text-sm text-primary hover:underline">
              Belum punya akun? Daftar sebagai Relawan
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo Login:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin@bpbd.go.id</p>
              <p><strong>Operator:</strong> operator@bpbd.go.id</p>
              <p><strong>Relawan:</strong> (email apapun)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
