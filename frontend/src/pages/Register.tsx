import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockKeahlian, mockOrganisasi } from '@/lib/mockData';

import apiClient from '@/lib/api';

/**
 * Registrasi Relawan
 * API ENDPOINT: POST /api/relawan/register
 * REQUEST BODY: { nama_lengkap, email, password, nik, nomor_hp, alamat, organisasi_id?, keahlian_ids[], sertifikat_file?, surat_organisasi? }
 * RESPONSE: { message: string, relawan_id: string, status_verifikasi: 'pending' }
 */
const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    nama_lengkap: '', email: '', password: '', confirmPassword: '',
    nik: '', nomor_hp: '', alamat: '', organisasi_id: '',
    keahlian_ids: [] as string[],
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleKeahlian = (id: string) => {
    setForm((prev) => ({
      ...prev,
      keahlian_ids: prev.keahlian_ids.includes(id)
        ? prev.keahlian_ids.filter((k) => k !== id)
        : [...prev.keahlian_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: 'Error', description: 'Password tidak cocok', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Execute Real Backend Registration
      const response = await apiClient.post('/relawan/register', {
        nama_lengkap: form.nama_lengkap,
        email: form.email,
        password: form.password,
        nik: form.nik,
        nomor_hp: form.nomor_hp,
        alamat: form.alamat,
        organisasi_id: form.organisasi_id || undefined,
        keahlian_ids: form.keahlian_ids
      });

      toast({ 
        title: 'Registrasi Berhasil', 
        description: response.data.message || 'Akun Anda sedang menunggu verifikasi admin.' 
      });
      navigate('/login');
    } catch (error: any) {
      toast({ 
        title: 'Registrasi Gagal', 
        description: error.response?.data?.message || 'Terjadi kesalahan pada server. Coba lagi.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary mb-3">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Registrasi Relawan</h1>
          <p className="text-sm text-muted-foreground mt-1">Daftarkan diri sebagai relawan BPBD</p>
        </div>

        <div className="flex items-center gap-2 mb-6 justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {s}
              </div>
              {s < 3 && <div className={`h-0.5 w-8 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-foreground">Data Pribadi</h2>
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input value={form.nama_lengkap} onChange={(e) => updateField('nama_lengkap', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input value={form.nik} onChange={(e) => updateField('nik', e.target.value)} maxLength={16} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Konfirmasi</Label>
                    <Input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nomor HP</Label>
                  <Input value={form.nomor_hp} onChange={(e) => updateField('nomor_hp', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Textarea value={form.alamat} onChange={(e) => updateField('alamat', e.target.value)} rows={2} required />
                </div>
                <Button type="button" className="w-full" onClick={() => setStep(2)}>Lanjut</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-foreground">Keahlian & Organisasi</h2>
                <div className="space-y-2">
                  <Label>Organisasi (Opsional)</Label>
                  <Select value={form.organisasi_id} onValueChange={(v) => updateField('organisasi_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Pilih organisasi" /></SelectTrigger>
                    <SelectContent>
                      {mockOrganisasi.map((org) => (
                        <SelectItem key={org.id} value={org.id}>{org.nama_organisasi}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Keahlian (Pilih minimal 1)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mockKeahlian.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => toggleKeahlian(k.id)}
                        className={`p-2 rounded-lg border text-sm text-left transition-colors ${
                          form.keahlian_ids.includes(k.id)
                            ? 'border-primary bg-primary/5 text-primary font-medium'
                            : 'border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {k.nama}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Kembali</Button>
                  <Button type="button" className="flex-1" onClick={() => setStep(3)}>Lanjut</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-foreground">Upload Dokumen (Opsional)</h2>
                <div className="space-y-2">
                  <Label>Sertifikat Keahlian</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                  <p className="text-xs text-muted-foreground">Format: PDF, JPG, PNG. Maks 5MB</p>
                </div>
                <div className="space-y-2">
                  <Label>Surat Rekomendasi Organisasi</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>Kembali</Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => navigate('/login')} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
