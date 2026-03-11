import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => (
  <section className="py-24 gradient-navy relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-info blur-3xl" />
    </div>
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-6">
          Siap Menjadi Relawan?
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-10">
          Bergabunglah dengan ribuan relawan terlatih di Sulawesi Tengah.
          Bersama kita siap menghadapi bencana.
        </p>
        <Link to="/register">
          <Button size="lg" className="gradient-orange text-accent-foreground border-0 font-bold text-base px-10 gap-2">
            Daftar Sekarang
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);
