import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Star, Phone, Mail, Calendar, Printer } from "lucide-react";

const volunteer = {
  id: "V001",
  name: "Ahmad Fauzi",
  district: "Kota Palu",
  skill: "SAR (Search and Rescue)",
  status: "Siap Ditugaskan",
  missions: 12,
  certified: true,
  email: "ahmad.fauzi@email.com",
  phone: "081234567890",
  joined: "15 Maret 2023",
  history: [
    { mission: "Banjir Donggala", date: "Feb 2025", role: "Tim SAR" },
    { mission: "Gempa Sigi", date: "Jan 2025", role: "Koordinator Lapangan" },
    { mission: "Tanah Longsor Parimo", date: "Nov 2024", role: "Tim SAR" },
  ],
};

const VolunteerProfile = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-1">
                <div className="rounded-xl border border-border bg-card p-6 text-center">
                  <div className="h-24 w-24 rounded-full gradient-navy mx-auto mb-4 flex items-center justify-center text-3xl font-extrabold text-primary-foreground">
                    {volunteer.name.charAt(0)}
                  </div>
                  <h2 className="text-lg font-bold text-card-foreground">{volunteer.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono mb-3">{id || volunteer.id}</p>
                  {volunteer.certified && (
                    <Badge className="bg-accent text-accent-foreground gap-1 mb-4">
                      <Star className="h-3 w-3" /> Tersertifikasi
                    </Badge>
                  )}

                  <div className="space-y-2 text-sm text-left mt-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {volunteer.district}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" /> {volunteer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" /> {volunteer.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> Bergabung {volunteer.joined}
                    </div>
                  </div>

                  {/* Digital ID */}
                  <div className="mt-6 p-4 rounded-lg bg-muted">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      ID Digital Relawan
                    </p>
                    <QRCodeSVG
                      value={`SIGAP-SULTENG-${id || volunteer.id}`}
                      size={120}
                      className="mx-auto"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-xs text-accent gap-1"
                      onClick={() => window.print()}
                    >
                      <Printer className="h-3 w-3" /> Cetak Kartu ID
                    </Button>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-sm font-bold text-card-foreground mb-4">Informasi Keahlian</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Keahlian Utama</p>
                      <p className="font-semibold text-card-foreground">{volunteer.skill}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <span className="inline-block mt-1 rounded-full bg-success text-success-foreground px-3 py-1 text-xs font-semibold">
                        {volunteer.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Misi</p>
                      <p className="text-2xl font-extrabold text-card-foreground">{volunteer.missions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Skor Pengalaman</p>
                      <p className="text-2xl font-extrabold text-accent">{volunteer.missions * 10}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-sm font-bold text-card-foreground mb-4">Riwayat Penugasan</h3>
                  <div className="space-y-3">
                    {volunteer.history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                        <div>
                          <p className="font-semibold text-card-foreground text-sm">{h.mission}</p>
                          <p className="text-xs text-muted-foreground">{h.role}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VolunteerProfile;
