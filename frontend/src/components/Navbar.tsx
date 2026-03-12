import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoBPBD from '../assets/bpbd.png';
import logoSulteng from '../assets/sulteng.png'

const navItems = [
  { label: "Beranda", path: "/" },
  { label: "Daftar Misi", path: "/daftar_misi" },
  { label: "Petakan Misimu", path: "/peta_misi" },
  { label: "Daftar Relawan", path: "/register" },
  { label: "Database", path: "/volunteers" },
  { label: "Dashboard", path: "/dashboard" },
];

export const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        isLanding ? "bg-navy" : "gradient-navy shadow-lg"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-1 px-1">
        <Link to="/" className="flex items-center gap-5">
          <div className="mx-auto mb-2 flex h-16 w-16 gap-2 items-center justify-center ">
            <img className="h-10 w-10" src={logoSulteng}/>
            <img className="h-10 w-10" src={logoBPBD}/>
          </div>
          <div className="leading-tight mb-2">
            <span className=" text-sm font-extrabold text-primary-foreground tracking-wide">
              DESK RELAWAN
            </span>
            <span className="block text-[10px] font-medium text-primary-foreground/70 tracking-widest uppercase">
              Bpbd Provinsi Sulawesi Tengah
            </span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/login">
            <Button size="sm" className="ml-3 gradient-orange text-accent-foreground border-0 font-semibold">
              Masuk
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-primary-foreground"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden gradient-navy border-t border-primary-foreground/10 px-4 pb-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground border-b border-primary-foreground/5"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)}>
            <Button className="mt-3 w-full gradient-orange text-accent-foreground border-0 font-semibold">
              Masuk
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};
