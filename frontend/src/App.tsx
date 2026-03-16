import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { AppLayout } from "@/components/layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RelawanPage from "./pages/RelawanPage";
import OrganisasiPage from "./pages/OrganisasiPage";
import KeahlianPage from "./pages/KeahlianPage";
import BencanaPage from "./pages/BencanaPage";
import PermintaanPage from "./pages/PermintaanPage";
import PenugasanPage from "./pages/PenugasanPage";
import MonitoringPage from "./pages/MonitoringPage";
import LaporanPage from "./pages/LaporanPage";
import LogistikPage from "./pages/LogistikPage";
import NotifikasiPage from "./pages/NotifikasiPage";
import StatistikPage from "./pages/StatistikPage";
import PenggunaPage from "./pages/PenggunaPage";
import ProfilPage from "./pages/ProfilPage";
import MasterDataPage from "./pages/MasterDataPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requiredRoles }: { children: React.ReactNode; requiredRoles?: string[] }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (requiredRoles && !hasPermission(requiredRoles as any)) {
    // Return unauthorized access to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/relawan" element={<ProtectedRoute><RelawanPage /></ProtectedRoute>} />
          <Route path="/organisasi" element={<ProtectedRoute><OrganisasiPage /></ProtectedRoute>} />
          <Route path="/keahlian" element={<ProtectedRoute><KeahlianPage /></ProtectedRoute>} />
          <Route path="/bencana" element={<ProtectedRoute><BencanaPage /></ProtectedRoute>} />
          <Route path="/permintaan" element={<ProtectedRoute><PermintaanPage /></ProtectedRoute>} />
          <Route path="/penugasan" element={<ProtectedRoute><PenugasanPage /></ProtectedRoute>} />
          <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
          <Route path="/laporan" element={<ProtectedRoute><LaporanPage /></ProtectedRoute>} />
          <Route path="/logistik" element={<ProtectedRoute><LogistikPage /></ProtectedRoute>} />
          <Route path="/notifikasi" element={<ProtectedRoute><NotifikasiPage /></ProtectedRoute>} />
          <Route path="/statistik" element={<ProtectedRoute><StatistikPage /></ProtectedRoute>} />
          <Route path="/pengguna" element={<ProtectedRoute requiredRoles={['admin']}><PenggunaPage /></ProtectedRoute>} />
          <Route path="/master-data" element={<ProtectedRoute requiredRoles={['admin', 'operator', 'pimpinan']}><MasterDataPage /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
);

export default App;
