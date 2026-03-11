import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  Database,
  ClipboardList,
  QrCode,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "Registrasi Online",
    desc: "Pendaftaran relawan digital dengan upload dokumen dan sertifikat.",
  },
  {
    icon: ShieldCheck,
    title: "Verifikasi Admin",
    desc: "Dashboard verifikasi data relawan oleh admin BPBD.",
  },
  {
    icon: Database,
    title: "Database Terpadu",
    desc: "Pencarian & filter relawan berdasarkan keahlian, lokasi, dan sertifikasi.",
  },
  {
    icon: ClipboardList,
    title: "Penugasan Cerdas",
    desc: "Manajemen misi dan penugasan relawan secara terstruktur.",
  },
  {
    icon: QrCode,
    title: "Kartu ID Digital",
    desc: "ID relawan digital dengan QR code unik yang dapat dicetak.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Eksekutif",
    desc: "Analitik kesiapsiagaan relawan untuk pengambilan keputusan.",
  },
];

export const FeaturesSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          Fitur Utama
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-foreground">
          Platform Manajemen Relawan Terintegrasi
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Sistem digital end-to-end untuk pendaftaran, verifikasi, penugasan,
          dan monitoring relawan penanggulangan bencana.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl border border-border bg-card p-7 hover:shadow-lg hover:border-accent/30 transition-all duration-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-orange mb-5">
              <f.icon className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
