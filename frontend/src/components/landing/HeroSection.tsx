import { motion } from "framer-motion";
import { Shield, Users, ClipboardCheck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/BERANI_TANGGUH.png";

const stats = [
  { icon: Users, value: "2,847", label: "Total Relawan" },
  { icon: ClipboardCheck, value: "1,234", label: "Tersertifikasi" },
  { icon: MapPin, value: "13", label: "Kabupaten/Kota" },
  { icon: Shield, value: "156", label: "Misi Aktif" },
];

export const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 gradient-hero opacity-90" />
    </div>

    <div className="container relative z-10 mx-auto px-4 pt-28 pb-16">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent mb-6">
            <Shield className="h-3.5 w-3.5" />
            PUSDALOPS - PENANGGULANGAN BENCANA
          </span> */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
            DESK RELAWAN{" "}
            <br></br><span className="text-gradient-orange">SULTENG</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed mb-8 max-w-2xl">
            Desk Relawan Bpbd Sulteng — Platform digital
            untuk kesiapsiagaan dan manajemen penugasan relawan penanggulangan
            bencana Provinsi Sulawesi Tengah.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Link to="/register">
            <Button size="lg" className="gradient-orange text-accent-foreground border-0 font-bold text-base px-8 animate-pulse-glow">
              Daftar Relawan
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-black px-8"
            >
              Lihat Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-5 text-center"
          >
            <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-extrabold text-primary-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-primary-foreground/60 font-medium mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);
