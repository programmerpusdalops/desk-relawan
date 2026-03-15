/**
 * Core Types for Sistem Desk Relawan BPBD
 * All interfaces match expected backend API responses
 */

export type UserRole = 'admin' | 'operator' | 'relawan';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type VolunteerFieldStatus = 'siaga' | 'bertugas' | 'selesai';

export type DisasterScale = 'kecil' | 'sedang' | 'besar';

export type DisasterStatus = 'aktif' | 'tanggap_darurat' | 'pemulihan' | 'selesai';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
  role: UserRole;
  user: User;
}

export interface Relawan {
  id: string;
  user_id: string;
  nama_lengkap: string;
  email: string;
  nik: string;
  nomor_hp: string;
  alamat: string;
  organisasi_id?: string;
  organisasi_nama?: string;
  keahlian: Keahlian[];
  status_verifikasi: VerificationStatus;
  status_lapangan?: VolunteerFieldStatus;
  latitude?: number;
  longitude?: number;
  foto?: string;
  created_at: string;
}

export interface Organisasi {
  id: string;
  nama_organisasi: string;
  jenis_organisasi: string;
  alamat: string;
  nomor_kontak: string;
  dokumen_legalitas?: string;
  jumlah_anggota: number;
  status_verifikasi: VerificationStatus;
  created_at: string;
}

export interface Keahlian {
  id: string;
  nama: string;
  kategori: string;
  deskripsi?: string;
}

export interface Bencana {
  id: string;
  nama_bencana: string;
  jenis_bencana: string;
  lokasi: string;
  latitude: number;
  longitude: number;
  waktu_kejadian: string;
  skala_bencana: DisasterScale;
  status: DisasterStatus;
  deskripsi_dampak: string;
  created_at: string;
}

export interface PermintaanRelawan {
  id: string;
  bencana_id: string;
  bencana_nama?: string;
  keahlian_id: string;
  keahlian_nama?: string;
  jumlah_relawan: number;
  jumlah_terpenuhi: number;
  lokasi_penugasan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  deskripsi_tugas: string;
  status: 'open' | 'closed' | 'fulfilled';
  created_at: string;
}

export interface Penugasan {
  id: string;
  bencana_id: string;
  bencana_nama?: string;
  nama_tim: string;
  lokasi_penugasan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  anggota: Relawan[];
  status: 'aktif' | 'selesai' | 'dibatalkan';
  created_at: string;
}

export interface LaporanKegiatan {
  id: string;
  relawan_id: string;
  relawan_nama?: string;
  bencana_id: string;
  bencana_nama?: string;
  judul_laporan: string;
  deskripsi: string;
  jumlah_penerima_bantuan: number;
  kendala_lapangan?: string;
  foto_kegiatan?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface Logistik {
  id: string;
  nama_peralatan: string;
  kategori: string;
  stok: number;
  lokasi_penyimpanan: string;
  kondisi: 'baik' | 'rusak_ringan' | 'rusak_berat';
  created_at: string;
}

export interface Notifikasi {
  id: string;
  judul: string;
  pesan: string;
  jenis: 'pengumuman_operasi' | 'kebutuhan_relawan' | 'update_bencana' | 'briefing_relawan';
  dibaca: boolean;
  created_at: string;
}

export interface DashboardStats {
  relawanCount: number;
  activeRelawan: number;
  activeDisasters: number;
  orgCount: number;
}

export interface ActivityChartData {
  bulan: string;
  relawan_aktif: number;
  operasi: number;
  laporan: number;
}

export interface RelawanLokasi {
  relawan_id: string;
  nama: string;
  latitude: number;
  longitude: number;
  status: VolunteerFieldStatus;
}
