/**
 * Mock data untuk development sebelum backend tersedia
 */
import type {
  DashboardStats, ActivityChartData, Relawan, Organisasi,
  Keahlian, Bencana, PermintaanRelawan, Penugasan, LaporanKegiatan,
  Logistik, Notifikasi, RelawanLokasi, User
} from '@/types';

export const mockStats: DashboardStats = {
  relawanCount: 1247,
  activeRelawan: 89,
  activeDisasters: 3,
  orgCount: 42,
};

export const mockActivityChart: ActivityChartData[] = [
  { bulan: 'Jan', relawan_aktif: 45, operasi: 2, laporan: 34 },
  { bulan: 'Feb', relawan_aktif: 52, operasi: 1, laporan: 28 },
  { bulan: 'Mar', relawan_aktif: 61, operasi: 3, laporan: 45 },
  { bulan: 'Apr', relawan_aktif: 78, operasi: 2, laporan: 52 },
  { bulan: 'Mei', relawan_aktif: 89, operasi: 4, laporan: 67 },
  { bulan: 'Jun', relawan_aktif: 95, operasi: 3, laporan: 71 },
];

export const mockKeahlian: Keahlian[] = [
  { id: '1', nama: 'SAR', kategori: 'Penyelamatan', deskripsi: 'Search and Rescue' },
  { id: '2', nama: 'Medis', kategori: 'Kesehatan', deskripsi: 'Pertolongan medis darurat' },
  { id: '3', nama: 'Logistik', kategori: 'Operasional', deskripsi: 'Manajemen logistik bencana' },
  { id: '4', nama: 'Dapur Umum', kategori: 'Operasional', deskripsi: 'Pengelolaan dapur umum' },
  { id: '5', nama: 'Assessment', kategori: 'Analisis', deskripsi: 'Kaji cepat dampak bencana' },
  { id: '6', nama: 'Psikososial', kategori: 'Kesehatan', deskripsi: 'Dukungan psikologis korban' },
  { id: '7', nama: 'Komunikasi Radio', kategori: 'Komunikasi', deskripsi: 'Operasi radio komunikasi' },
  { id: '8', nama: 'Manajemen Pengungsian', kategori: 'Operasional', deskripsi: 'Pengelolaan lokasi pengungsian' },
];

export const mockRelawan: Relawan[] = [
  { id: '1', user_id: 'u1', nama_lengkap: 'Ahmad Fauzi', email: 'ahmad@email.com', nik: '3201010101010001', nomor_hp: '08123456789', alamat: 'Jakarta Selatan', organisasi_id: '1', organisasi_nama: 'PMI Jakarta', keahlian: [mockKeahlian[0], mockKeahlian[1]], status_verifikasi: 'approved', status_lapangan: 'bertugas', latitude: -6.2088, longitude: 106.8456, created_at: '2024-01-15' },
  { id: '2', user_id: 'u2', nama_lengkap: 'Siti Nurhaliza', email: 'siti@email.com', nik: '3201010101010002', nomor_hp: '08123456790', alamat: 'Bandung', organisasi_nama: 'TAGANA Jabar', keahlian: [mockKeahlian[1], mockKeahlian[5]], status_verifikasi: 'approved', status_lapangan: 'siaga', latitude: -6.9175, longitude: 107.6191, created_at: '2024-02-20' },
  { id: '3', user_id: 'u3', nama_lengkap: 'Budi Santoso', email: 'budi@email.com', nik: '3201010101010003', nomor_hp: '08123456791', alamat: 'Surabaya', keahlian: [mockKeahlian[2]], status_verifikasi: 'pending', created_at: '2024-03-10' },
  { id: '4', user_id: 'u4', nama_lengkap: 'Dewi Lestari', email: 'dewi@email.com', nik: '3201010101010004', nomor_hp: '08123456792', alamat: 'Yogyakarta', organisasi_nama: 'MDMC DIY', keahlian: [mockKeahlian[3], mockKeahlian[7]], status_verifikasi: 'approved', status_lapangan: 'bertugas', latitude: -7.7956, longitude: 110.3695, created_at: '2024-01-05' },
  { id: '5', user_id: 'u5', nama_lengkap: 'Reza Pratama', email: 'reza@email.com', nik: '3201010101010005', nomor_hp: '08123456793', alamat: 'Semarang', keahlian: [mockKeahlian[6]], status_verifikasi: 'rejected', created_at: '2024-04-01' },
];

export const mockOrganisasi: Organisasi[] = [
  { id: '1', nama_organisasi: 'PMI DKI Jakarta', jenis_organisasi: 'Kemanusiaan', alamat: 'Jakarta Pusat', nomor_kontak: '021-1234567', jumlah_anggota: 250, status_verifikasi: 'approved', created_at: '2023-01-01' },
  { id: '2', nama_organisasi: 'TAGANA Jawa Barat', jenis_organisasi: 'Pemerintah', alamat: 'Bandung', nomor_kontak: '022-7654321', jumlah_anggota: 180, status_verifikasi: 'approved', created_at: '2023-03-15' },
  { id: '3', nama_organisasi: 'MDMC DIY', jenis_organisasi: 'Keagamaan', alamat: 'Yogyakarta', nomor_kontak: '0274-567890', jumlah_anggota: 120, status_verifikasi: 'pending', created_at: '2024-01-20' },
];

export const mockBencana: Bencana[] = [
  { id: '1', nama_bencana: 'Banjir Jakarta Selatan', jenis_bencana: 'Banjir', lokasi: 'Jakarta Selatan', latitude: -6.2615, longitude: 106.8106, waktu_kejadian: '2024-02-15T08:00:00', skala_bencana: 'besar', status: 'tanggap_darurat', deskripsi_dampak: '5000 KK terdampak, 12 kelurahan terendam', created_at: '2024-02-15' },
  { id: '2', nama_bencana: 'Gempa Cianjur', jenis_bencana: 'Gempa Bumi', lokasi: 'Cianjur, Jawa Barat', latitude: -6.8204, longitude: 107.1408, waktu_kejadian: '2024-03-01T14:30:00', skala_bencana: 'besar', status: 'aktif', deskripsi_dampak: '200 rumah rusak, 3 korban jiwa', created_at: '2024-03-01' },
  { id: '3', nama_bencana: 'Tanah Longsor Bogor', jenis_bencana: 'Tanah Longsor', lokasi: 'Bogor, Jawa Barat', latitude: -6.5971, longitude: 106.8060, waktu_kejadian: '2024-03-10T06:00:00', skala_bencana: 'sedang', status: 'pemulihan', deskripsi_dampak: '15 rumah tertimbun, evakuasi selesai', created_at: '2024-03-10' },
];

export const mockPermintaan: PermintaanRelawan[] = [
  { id: '1', bencana_id: '1', bencana_nama: 'Banjir Jakarta Selatan', keahlian_id: '1', keahlian_nama: 'SAR', jumlah_relawan: 20, jumlah_terpenuhi: 15, lokasi_penugasan: 'Kelurahan Tebet', tanggal_mulai: '2024-02-15', tanggal_selesai: '2024-02-22', deskripsi_tugas: 'Evakuasi warga terdampak', status: 'open', created_at: '2024-02-15' },
  { id: '2', bencana_id: '1', bencana_nama: 'Banjir Jakarta Selatan', keahlian_id: '2', keahlian_nama: 'Medis', jumlah_relawan: 10, jumlah_terpenuhi: 10, lokasi_penugasan: 'Posko Kesehatan Tebet', tanggal_mulai: '2024-02-15', tanggal_selesai: '2024-02-28', deskripsi_tugas: 'Pelayanan kesehatan pengungsi', status: 'fulfilled', created_at: '2024-02-15' },
];

export const mockPenugasan: Penugasan[] = [
  { id: '1', bencana_id: '1', bencana_nama: 'Banjir Jakarta Selatan', nama_tim: 'Tim Evakuasi Alpha', lokasi_penugasan: 'Kelurahan Tebet', tanggal_mulai: '2024-02-15', tanggal_selesai: '2024-02-22', anggota: [mockRelawan[0], mockRelawan[3]], status: 'aktif', created_at: '2024-02-15' },
  { id: '2', bencana_id: '2', bencana_nama: 'Gempa Cianjur', nama_tim: 'Tim Medis Bravo', lokasi_penugasan: 'Posko Cianjur', tanggal_mulai: '2024-03-01', tanggal_selesai: '2024-03-15', anggota: [mockRelawan[1]], status: 'aktif', created_at: '2024-03-01' },
];

export const mockLaporan: LaporanKegiatan[] = [
  { id: '1', relawan_id: '1', relawan_nama: 'Ahmad Fauzi', bencana_id: '1', bencana_nama: 'Banjir Jakarta Selatan', judul_laporan: 'Evakuasi Warga RT 05', deskripsi: 'Berhasil mengevakuasi 45 warga dari area banjir setinggi 1.5 meter', jumlah_penerima_bantuan: 45, kendala_lapangan: 'Akses jalan terputus', latitude: -6.2088, longitude: 106.8456, created_at: '2024-02-16' },
  { id: '2', relawan_id: '4', relawan_nama: 'Dewi Lestari', bencana_id: '1', bencana_nama: 'Banjir Jakarta Selatan', judul_laporan: 'Distribusi Makanan Pengungsi', deskripsi: 'Distribusi 200 paket makanan ke 3 titik pengungsian', jumlah_penerima_bantuan: 200, created_at: '2024-02-17' },
];

export const mockLogistik: Logistik[] = [
  { id: '1', nama_peralatan: 'APD Set Lengkap', kategori: 'APD', stok: 150, lokasi_penyimpanan: 'Gudang BPBD Jakarta', kondisi: 'baik', created_at: '2024-01-01' },
  { id: '2', nama_peralatan: 'Radio HT Motorola', kategori: 'Radio HT', stok: 45, lokasi_penyimpanan: 'Gudang BPBD Jakarta', kondisi: 'baik', created_at: '2024-01-01' },
  { id: '3', nama_peralatan: 'Tenda Pengungsi 4x6m', kategori: 'Tenda', stok: 30, lokasi_penyimpanan: 'Gudang BPBD Bogor', kondisi: 'baik', created_at: '2024-01-01' },
  { id: '4', nama_peralatan: 'Perahu Karet Evakuasi', kategori: 'Peralatan Evakuasi', stok: 12, lokasi_penyimpanan: 'Gudang BPBD Jakarta', kondisi: 'rusak_ringan', created_at: '2024-01-01' },
];

export const mockNotifikasi: Notifikasi[] = [
  { id: '1', judul: 'Operasi Banjir Jakarta Aktif', pesan: 'Operasi tanggap darurat banjir Jakarta Selatan telah diaktifkan. Seluruh relawan siaga harap melapor.', jenis: 'pengumuman_operasi', dibaca: false, created_at: '2024-02-15T08:30:00' },
  { id: '2', judul: 'Kebutuhan Relawan SAR', pesan: 'Dibutuhkan 20 relawan dengan keahlian SAR untuk operasi evakuasi di Tebet.', jenis: 'kebutuhan_relawan', dibaca: false, created_at: '2024-02-15T09:00:00' },
  { id: '3', judul: 'Update Gempa Cianjur', pesan: 'Gempa susulan M 4.2 terdeteksi. Seluruh tim di lapangan harap waspada.', jenis: 'update_bencana', dibaca: true, created_at: '2024-03-02T14:00:00' },
];

export const mockRelawanLokasi: RelawanLokasi[] = [
  { relawan_id: '1', nama: 'Ahmad Fauzi', latitude: -6.2088, longitude: 106.8456, status: 'bertugas' },
  { relawan_id: '2', nama: 'Siti Nurhaliza', latitude: -6.9175, longitude: 107.6191, status: 'siaga' },
  { relawan_id: '4', nama: 'Dewi Lestari', latitude: -6.2615, longitude: 106.8106, status: 'bertugas' },
  { relawan_id: '6', nama: 'Hendra Wijaya', latitude: -6.1751, longitude: 106.8650, status: 'siaga' },
  { relawan_id: '7', nama: 'Rina Amelia', latitude: -6.2297, longitude: 106.6895, status: 'bertugas' },
];

export const mockUsers: User[] = [
  { id: '1', nama: 'Admin BPBD', email: 'admin@bpbd.go.id', role: 'admin', status: 'active', created_at: '2023-01-01' },
  { id: '2', nama: 'Operator Desk', email: 'operator@bpbd.go.id', role: 'operator', status: 'active', created_at: '2023-06-01' },
  { id: '3', nama: 'Ahmad Fauzi', email: 'ahmad@email.com', role: 'relawan', status: 'active', created_at: '2024-01-15' },
];
