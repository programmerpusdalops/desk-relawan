const prisma = require('../../database/prisma');

/**
 * @desc    Get All Logistik Equipment Data
 * @route   GET /api/v1/logistik
 * @access  Private
 */
const getAllLogistik = async (req, res, next) => {
  try {
    const logistik = await prisma.logistik.findMany({
      orderBy: { nama_peralatan: 'asc' }
    });

    res.status(200).json({ status: 'success', data: logistik });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register New Logistik Item
 * @route   POST /api/v1/logistik
 * @access  Private (Admin / Operator / Pimpinan)
 */
const createLogistik = async (req, res, next) => {
  try {
    const { nama_peralatan, kategori, stok, lokasi_penyimpanan, kondisi } = req.body;

    if (!nama_peralatan || !kategori || stok === undefined || !lokasi_penyimpanan) {
      return res.status(400).json({ status: 'fail', message: 'Variabel Logistik spesifik kurang lengkap' });
    }

    const newItem = await prisma.logistik.create({
      data: {
        nama_peralatan,
        kategori,
        stok: parseInt(stok),
        lokasi_penyimpanan,
        kondisi: kondisi || 'baik'
      }
    });

    res.status(201).json({ status: 'success', message: 'Item masuk gudang', data: newItem });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Existing Item Params or Stocks
 * @route   PUT /api/v1/logistik/:id
 * @access  Private (Admin / Operator / Pimpinan)
 */
const updateLogistik = async (req, res, next) => {
  try {
    const { nama_peralatan, kategori, stok, lokasi_penyimpanan, kondisi } = req.body;

    const dataPayload = {};
    if (nama_peralatan) dataPayload.nama_peralatan = nama_peralatan;
    if (kategori) dataPayload.kategori = kategori;
    if (stok !== undefined) dataPayload.stok = parseInt(stok);
    if (lokasi_penyimpanan) dataPayload.lokasi_penyimpanan = lokasi_penyimpanan;
    if (kondisi) dataPayload.kondisi = kondisi;

    const updated = await prisma.logistik.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Update record Logistik sukses', data: updated });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data Logistik gagal dilacak' });
    next(error);
  }
};

/**
 * @desc    Drop Logistics Asset from Datastore permanently
 * @route   DELETE /api/v1/logistik/:id
 * @access  Private (Admin)
 */
const deleteLogistik = async (req, res, next) => {
  try {
    await prisma.logistik.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data Logistik gagal dilacak' });
    next(error);
  }
};

module.exports = {
  getAllLogistik,
  createLogistik,
  updateLogistik,
  deleteLogistik
};
