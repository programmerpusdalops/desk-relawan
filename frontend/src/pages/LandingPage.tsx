import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, Users, Activity, Package, MapPin, PhoneCall } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">BPBD Desk Relawan</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('fitur')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fitur Utama</button>
            <button onClick={() => scrollToSection('tentang')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Tentang Kami</button>
            <button onClick={() => scrollToSection('kontak')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pusdalops</button>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
              Masuk
            </Button>
            <Button onClick={() => navigate('/register')}>
              Daftar Relawan
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-36 bg-slate-900 min-h-[600px] flex items-center">
           {/* Background Image Banner */}
           <div className="absolute inset-0 z-0">
              <img src="/bpbd_hero_banner.png" alt="Rescue Operations" className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
           </div>

           <div className="container mx-auto px-4 relative z-10 text-center">
             <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold bg-primary text-primary-foreground mb-8 shadow-lg shadow-primary/20">
               <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse"></span>
               Sistem Informasi Penanggulangan Bencana
             </div>
             
             <h1 className="mx-auto max-w-5xl font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight text-white mb-8 drop-shadow-md">
               Satu Komando untuk <br className="hidden sm:block" /> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">Kemanusiaan & Penyelamatan</span>
             </h1>
             
             <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-light">
               Platform terpadu Pusat Pengendalian Operasi (PUSDALOPS) BPBD untuk manajemen relawan, orkestrasi penugasan darurat, dan rantai pasok logistik bencana alam secara seketika (*real-time*).
             </p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-primary/30" onClick={() => navigate('/register')}>
                 Bergabung Sebagai Relawan <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
               <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur" onClick={() => navigate('/login')}>
                 Akses Dashboard Portal
               </Button>
             </div>
           </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Pilar Utama Operasional</h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">Infrastruktur digital penunjang percepatan repson dan komando darurat bencana di tingkat daerah.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="relative group p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-xl transition-all hover:border-primary/50">
                 <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                   <Users className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Registrasi & Verifikasi Relawan</h3>
                 <p className="text-muted-foreground leading-relaxed">Penyaringan dan pemetaan kompetensi relawan lapangan bersertifikat (SAR, Medis, Logistik) untuk penempatan yang presisi.</p>
              </div>

               {/* Feature 2 */}
               <div className="relative group p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-xl transition-all hover:border-primary/50">
                 <div className="h-12 w-12 rounded-xl bg-orange-600/10 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                   <Activity className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Orkestrasi Penugasan Darurat</h3>
                 <p className="text-muted-foreground leading-relaxed">Pembentukan regu penyelamatan instan, rotasi jadwal, dan penerbitan Surat Tugas Kemanusiaan secara digital (PDF).</p>
              </div>

               {/* Feature 3 */}
               <div className="relative group p-8 rounded-2xl border bg-card text-card-foreground hover:shadow-xl transition-all hover:border-primary/50">
                 <div className="h-12 w-12 rounded-xl bg-orange-400/10 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                   <Package className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">Gudang & Rantai Logistik</h3>
                 <p className="text-muted-foreground leading-relaxed">Sistem pencatatan persediaan bantuan, pelacakan masuk/keluar, serta penyaluran logistik kepada para korban terdampak.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action (CTA) / Tentang Kami */}
        <section id="tentang" className="py-20 border-t bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Aksi Nyata Membutuhkan Anda</h2>
            <p className="text-lg text-muted-foreground mb-8">Daftar sekarang, lengkapi profil, uji kualifikasi keahlianmu, dan jadilah baris terdepan dalam merespon tanggap darurat bencana bersama regu operasional BPBD.</p>
            <Button size="lg" className="h-12 px-8 text-base shadow-lg" onClick={() => navigate('/register')}>
              Mulai Langkah Kemanusiaan
            </Button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="kontak" className="py-10 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
             <Shield className="h-6 w-6 text-muted-foreground" />
             <span className="font-semibold text-muted-foreground">PUSDALOPS BPBD</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-muted-foreground">
             <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pos Komando Utama (PUSDALOPS)</span>
             <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Layanan Darurat/Call Center: 112</span>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 text-center text-xs text-muted-foreground/60 border-t pt-8">
           &copy; {new Date().getFullYear()} Desk Relawan - Badan Penanggulangan Bencana Daerah. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
