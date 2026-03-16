const prisma = require('../../database/prisma');

/**
 * @desc    Get All Permintaan Relawan
 * @route   GET /api/v1/permintaan-relawan
 * @access  Private
 */
const getAllPermintaan = async (req, res, next) => {
  try {
    const permintaan = await prisma.permintaanRelawan.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        bencana: { select: { id: true, nama_bencana: true } },
        keahlian: { select: { id: true, nama: true } }
      }
    });

    // Format for frontend
    const formattedData = permintaan.map(p => ({
      ...p,
      bencana_nama: p.bencana.nama_bencana,
      keahlian_nama: p.keahlian.nama
    }));

    res.status(200).json({ status: 'success', data: formattedData });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Permintaan Relawan
 * @route   POST /api/v1/permintaan-relawan
 * @access  Private (Admin / Operator / Pimpinan)
 */
const createPermintaan = async (req, res, next) => {
  try {
    const { 
      bencana_id, keahlian_id, jumlah_relawan, 
      lokasi_penugasan, tanggal_mulai, tanggal_selesai, deskripsi_tugas 
    } = req.body;

    if (!bencana_id || !keahlian_id || !jumlah_relawan || !lokasi_penugasan || !tanggal_mulai || !tanggal_selesai || !deskripsi_tugas) {
       return res.status(400).json({ status: 'fail', message: 'Tolong lengkapi semua data form permintaan' });
    }

    const newPermintaan = await prisma.permintaanRelawan.create({
      data: {
        bencana_id,
        keahlian_id,
        jumlah_relawan: parseInt(jumlah_relawan),
        lokasi_penugasan,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
        deskripsi_tugas,
        status: 'open'
      }
    });

    res.status(201).json({ status: 'success', message: 'Permintaan relawan berhasil dibuat', data: newPermintaan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Permintaan Relawan
 * @route   PUT /api/v1/permintaan-relawan/:id
 * @access  Private (Admin / Operator / Pimpinan)
 */
const updatePermintaan = async (req, res, next) => {
  try {
    const { 
      bencana_id, keahlian_id, jumlah_relawan, jumlah_terpenuhi, status,
      lokasi_penugasan, tanggal_mulai, tanggal_selesai, deskripsi_tugas 
    } = req.body;

    const dataPayload = {};
    if (bencana_id) dataPayload.bencana_id = bencana_id;
    if (keahlian_id) dataPayload.keahlian_id = keahlian_id;
    if (jumlah_relawan !== undefined) dataPayload.jumlah_relawan = parseInt(jumlah_relawan);
    if (jumlah_terpenuhi !== undefined) dataPayload.jumlah_terpenuhi = parseInt(jumlah_terpenuhi);
    if (lokasi_penugasan) dataPayload.lokasi_penugasan = lokasi_penugasan;
    if (tanggal_mulai) dataPayload.tanggal_mulai = new Date(tanggal_mulai);
    if (tanggal_selesai) dataPayload.tanggal_selesai = new Date(tanggal_selesai);
    if (deskripsi_tugas) dataPayload.deskripsi_tugas = deskripsi_tugas;
    if (status) dataPayload.status = status;

    const updated = await prisma.permintaanRelawan.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Permintaan relawan diperbarui', data: updated });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data permintaan tidak ditemukan' });
    next(error);
  }
};

/**
 * @desc    Delete Permintaan Relawan
 * @route   DELETE /api/v1/permintaan-relawan/:id
 * @access  Private (Admin Only)
 */
const deletePermintaan = async (req, res, next) => {
  try {
    await prisma.permintaanRelawan.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data permintaan tidak ditemukan' });
    next(error);
  }
};

module.exports = {
  getAllPermintaan,
  createPermintaan,
  updatePermintaan,
  deletePermintaan
};
