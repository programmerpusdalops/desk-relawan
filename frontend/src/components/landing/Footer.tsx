import { Shield } from "lucide-react";

export const Footer = () => (
  <footer className="bg-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Shield className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-background">
              SIGAP RELAWAN SULTENG
            </span>
            <span className="block text-[10px] text-background/50">
              BPBD Provinsi Sulawesi Tengah
            </span>
          </div>
        </div>
        <p className="text-xs text-background/40 text-center">
          © 2025 BPBD Provinsi Sulawesi Tengah. Platform Manajemen Relawan Digital.
        </p>
      </div>
    </div>
  </footer>
);
