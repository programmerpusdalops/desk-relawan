import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, User, FileText, CheckCircle } from "lucide-react";

const skills = [
  "SAR (Search and Rescue)",
  "Medis / Kesehatan",
  "Logistik",
  "Psikososial",
  "Komunikasi & IT",
  "Dapur Umum",
  "Shelter & Konstruksi",
  "Administrasi",
];

const districts = [
  "Kota Palu",
  "Kab. Donggala",
  "Kab. Sigi",
  "Kab. Parigi Moutong",
  "Kab. Poso",
  "Kab. Tojo Una-Una",
  "Kab. Banggai",
  "Kab. Banggai Kepulauan",
  "Kab. Banggai Laut",
  "Kab. Morowali",
  "Kab. Morowali Utara",
  "Kab. Toli-Toli",
  "Kab. Buol",
];

const Register = () => {
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Pendaftaran berhasil dikirim! Menunggu verifikasi admin.");
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              Pendaftaran Relawan
            </h1>
            <p className="text-muted-foreground mb-8">
              Daftar sebagai relawan BPBD Provinsi Sulawesi Tengah
            </p>

            {/* Steps indicator */}
            <div className="flex items-center gap-3 mb-10">
              {[
                { num: 1, label: "Data Pribadi", icon: User },
                { num: 2, label: "Keahlian", icon: FileText },
                { num: 3, label: "Dokumen", icon: Upload },
              ].map((s) => (
                <div key={s.num} className="flex-1">
                  <div
                    className={`flex items-center gap-2 rounded-lg p-3 text-sm font-semibold transition-colors ${
                      step >= s.num
                        ? "gradient-orange text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">#{s.num}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <Input placeholder="Nama sesuai KTP" required />
                    </div>
                    <div className="space-y-2">
                      <Label>NIK</Label>
                      <Input placeholder="16 digit NIK" maxLength={16} required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="email@domain.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label>No. HP</Label>
                      <Input placeholder="08xxxxxxxxxx" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Kabupaten/Kota</Label>
                    <Select required>
                      <SelectTrigger><SelectValue placeholder="Pilih lokasi" /></SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Alamat Lengkap</Label>
                    <Textarea placeholder="Alamat domisili saat ini" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label>Keahlian Utama</Label>
                    <Select required>
                      <SelectTrigger><SelectValue placeholder="Pilih keahlian" /></SelectTrigger>
                      <SelectContent>
                        {skills.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pengalaman</Label>
                    <Textarea placeholder="Jelaskan pengalaman kerelawanan Anda" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status Ketersediaan</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Siap Ditugaskan</SelectItem>
                        <SelectItem value="conditional">Bersyarat</SelectItem>
                        <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  {["Foto KTP", "Foto Profil", "Sertifikat (opsional)"].map((label) => (
                    <div key={label} className="space-y-2">
                      <Label>{label}</Label>
                      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 p-8 cursor-pointer hover:border-accent transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Klik untuk upload {label.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Kembali
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 gradient-orange text-accent-foreground border-0 font-semibold"
                >
                  {step < 3 ? "Lanjutkan" : "Kirim Pendaftaran"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
