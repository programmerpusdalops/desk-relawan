const prisma = require('../../database/prisma');

/**
 * @desc    Get All Laporan / Field Reports
 * @route   GET /api/v1/laporan
 * @access  Private
 */
const getAllLaporan = async (req, res, next) => {
  try {
    const laporan = await prisma.laporanKegiatan.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        bencana: { select: { nama_bencana: true } },
        relawan: { select: { nama_lengkap: true } }
      }
    });

    const formattedData = laporan.map(l => ({
      ...l,
      bencana_nama: l.bencana?.nama_bencana || 'Tanpa Referensi',
      relawan_nama: l.relawan?.nama_lengkap || 'Anonim'
    }));

    res.status(200).json({ status: 'success', data: formattedData });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Laporan Kegiatan
 * @route   POST /api/v1/laporan
 * @access  Private (Relawan)
 */
const createLaporan = async (req, res, next) => {
  try {
    const { 
      bencana_id, judul_laporan, deskripsi, 
      jumlah_penerima_bantuan, kendala_lapangan, latitude, longitude 
    } = req.body;

    if (!bencana_id || !judul_laporan || !deskripsi) {
      return res.status(400).json({ status: 'fail', message: 'Lengkapi Bencana, Judul, dan Deskripsi!' });
    }

    // Identifikasi pelapor berdasar user Bearer token login
    const profile = await prisma.relawan.findUnique({
      where: { user_id: req.user.id }
    });

    if (!profile) {
      return res.status(403).json({ status: 'fail', message: 'Bukan relawan aktif' });
    }

    const newReport = await prisma.laporanKegiatan.create({
      data: {
        relawan_id: profile.id,
        bencana_id,
        judul_laporan,
        deskripsi,
        jumlah_penerima_bantuan: jumlah_penerima_bantuan ? parseInt(jumlah_penerima_bantuan) : 0,
        kendala_lapangan: kendala_lapangan || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      }
    });

    res.status(201).json({ status: 'success', message: 'Laporan lapangan disetorkan.', data: newReport });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Laporan
 * @route   DELETE /api/v1/laporan/:id
 * @access  Private (Admin Only)
 */
const deleteLaporan = async (req, res, next) => {
  try {
    await prisma.laporanKegiatan.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Laporan tidak ditemukan' });
    next(error);
  }
};

module.exports = {
  getAllLaporan,
  createLaporan,
  deleteLaporan
};
