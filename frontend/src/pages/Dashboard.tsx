import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  Users, ShieldCheck, ClipboardList, MapPin, TrendingUp, AlertTriangle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const statCards = [
  { label: "Total Relawan", value: "2,847", icon: Users, change: "+124 bulan ini", color: "gradient-navy" },
  { label: "Siap Ditugaskan", value: "1,892", icon: ShieldCheck, change: "66% dari total", color: "bg-success" },
  { label: "Misi Aktif", value: "23", icon: ClipboardList, change: "5 misi minggu ini", color: "gradient-orange" },
  { label: "Kabupaten Aktif", value: "13/13", icon: MapPin, change: "100% cakupan", color: "bg-info" },
];

const districtData = [
  { name: "Palu", count: 520 },
  { name: "Donggala", count: 380 },
  { name: "Sigi", count: 310 },
  { name: "Parimo", count: 245 },
  { name: "Poso", count: 290 },
  { name: "Tojo Una-Una", count: 180 },
  { name: "Banggai", count: 210 },
  { name: "Morowali", count: 175 },
  { name: "Toli-Toli", count: 195 },
  { name: "Buol", count: 142 },
];

const skillData = [
  { name: "SAR", value: 680, color: "hsl(215, 80%, 22%)" },
  { name: "Medis", value: 520, color: "hsl(25, 95%, 53%)" },
  { name: "Logistik", value: 440, color: "hsl(152, 60%, 42%)" },
  { name: "Psikososial", value: 380, color: "hsl(205, 80%, 56%)" },
  { name: "IT & Kominfo", value: 310, color: "hsl(38, 92%, 50%)" },
  { name: "Lainnya", value: 517, color: "hsl(215, 15%, 46%)" },
];

const recentMissions = [
  { name: "Banjir Donggala", status: "Aktif", volunteers: 45, date: "12 Feb 2025" },
  { name: "Gempa Sigi", status: "Aktif", volunteers: 82, date: "8 Feb 2025" },
  { name: "Tanah Longsor Parimo", status: "Selesai", volunteers: 30, date: "1 Feb 2025" },
  { name: "Kebakaran Hutan Poso", status: "Selesai", volunteers: 25, date: "25 Jan 2025" },
];

const Dashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">Dashboard Eksekutif</h1>
              <p className="text-muted-foreground">Ringkasan kesiapsiagaan relawan Sulawesi Tengah</p>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              Data terakhir diperbarui: Hari ini
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${s.color} mb-3`}>
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-2xl font-extrabold text-card-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{s.label}</div>
                <div className="text-[11px] text-success font-medium mt-2">{s.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold text-card-foreground mb-4">Relawan per Kabupaten/Kota</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(215, 80%, 22%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold text-card-foreground mb-4">Distribusi Keahlian</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    stroke="none"
                  >
                    {skillData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Missions */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-sm font-bold text-card-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Misi Terbaru
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-4 font-semibold text-muted-foreground">Nama Misi</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Relawan</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMissions.map((m, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="p-4 font-semibold text-card-foreground">{m.name}</td>
                      <td className="p-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                          m.status === "Aktif" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4 text-card-foreground">{m.volunteers} orang</td>
                      <td className="p-4 text-muted-foreground">{m.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Dashboard;
