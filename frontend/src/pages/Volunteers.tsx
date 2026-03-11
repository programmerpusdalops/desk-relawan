import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockVolunteers = [
  { id: "V001", name: "Ahmad Fauzi", district: "Kota Palu", skill: "SAR", status: "Siap", missions: 12, certified: true },
  { id: "V002", name: "Siti Rahmawati", district: "Kab. Donggala", skill: "Medis", status: "Ditugaskan", missions: 8, certified: true },
  { id: "V003", name: "Budi Santoso", district: "Kab. Sigi", skill: "Logistik", status: "Siap", missions: 5, certified: false },
  { id: "V004", name: "Dewi Lestari", district: "Kota Palu", skill: "Psikososial", status: "Siap", missions: 15, certified: true },
  { id: "V005", name: "Rahman Hakim", district: "Kab. Poso", skill: "SAR", status: "Tidak Tersedia", missions: 3, certified: false },
  { id: "V006", name: "Nur Aisyah", district: "Kab. Banggai", skill: "Medis", status: "Siap", missions: 20, certified: true },
  { id: "V007", name: "Hendra Wijaya", district: "Kab. Morowali", skill: "Komunikasi & IT", status: "Siap", missions: 7, certified: true },
  { id: "V008", name: "Fitri Handayani", district: "Kab. Toli-Toli", skill: "Dapur Umum", status: "Ditugaskan", missions: 10, certified: false },
];

const statusColor: Record<string, string> = {
  "Siap": "bg-success text-success-foreground",
  "Ditugaskan": "bg-warning text-warning-foreground",
  "Tidak Tersedia": "bg-muted text-muted-foreground",
};

const Volunteers = () => {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");

  const filtered = mockVolunteers.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
    const matchSkill = skillFilter === "all" || v.skill === skillFilter;
    return matchSearch && matchSkill;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">Database Relawan</h1>
            <p className="text-muted-foreground mb-8">
              {mockVolunteers.length} relawan terdaftar di seluruh Sulawesi Tengah
            </p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau ID relawan..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter keahlian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Keahlian</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="Medis">Medis</SelectItem>
                  <SelectItem value="Logistik">Logistik</SelectItem>
                  <SelectItem value="Psikososial">Psikososial</SelectItem>
                  <SelectItem value="Komunikasi & IT">Komunikasi & IT</SelectItem>
                  <SelectItem value="Dapur Umum">Dapur Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-semibold text-muted-foreground">ID</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Nama</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Lokasi</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Keahlian</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground hidden sm:table-cell">Misi</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v) => (
                      <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">{v.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-card-foreground">{v.name}</div>
                          {v.certified && (
                            <span className="text-[10px] font-bold text-accent flex items-center gap-1 mt-0.5">
                              <Star className="h-3 w-3" /> Tersertifikasi
                            </span>
                          )}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <MapPin className="h-3 w-3" /> {v.district}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-xs">{v.skill}</Badge>
                        </td>
                        <td className="p-4 hidden sm:table-cell font-semibold text-card-foreground">{v.missions}</td>
                        <td className="p-4">
                          <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${statusColor[v.status]}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Link to={`/volunteer/${v.id}`}>
                            <Button size="sm" variant="ghost" className="text-accent">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Volunteers;
