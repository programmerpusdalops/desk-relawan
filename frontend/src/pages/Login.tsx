import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <div className="flex-1 flex items-center justify-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-navy mb-4">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Masuk ke SIGAP</h1>
          <p className="text-sm text-muted-foreground mt-1">Portal Relawan & Admin BPBD</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="admin@bpbd.go.id" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full gradient-orange text-accent-foreground border-0 font-semibold gap-2" type="submit">
            <Lock className="h-4 w-4" />
            Masuk
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-accent font-semibold hover:underline">
            Daftar sebagai Relawan
          </Link>
        </p>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Login;
