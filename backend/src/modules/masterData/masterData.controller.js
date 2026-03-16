const prisma = require('../../database/prisma');

/**
 * @desc    Get All Master Data or filter by ?kategori=NAME
 * @route   GET /api/v1/master-data
 * @access  Private
 */
const getAllMasterData = async (req, res, next) => {
  try {
    const { kategori } = req.query;
    
    // Find options: if category filter passed, restrict.
    const query = kategori ? { where: { kategori } } : {};
    
    const data = await prisma.masterData.findMany({
      ...query,
      orderBy: [
        { kategori: 'asc' },
        { nilai: 'asc' }
      ]
    });

    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register new Master Data Tuple
 * @route   POST /api/v1/master-data
 * @access  Private (Admin / Operator / Pimpinan)
 */
const createMasterData = async (req, res, next) => {
  try {
    const { kategori, nilai, deskripsi } = req.body;

    if (!kategori || !nilai) {
      return res.status(400).json({ status: 'fail', message: 'Kategori dan Nilai wajib diisi!' });
    }

    const newItem = await prisma.masterData.create({
      data: {
        kategori: kategori.toUpperCase().trim(),
        nilai: nilai.trim(),
        deskripsi: deskripsi || null
      }
    });

    res.status(201).json({ status: 'success', message: 'Data Master baru disimpan', data: newItem });
  } catch (error) {
    // Unique constraint on (kategori, nilai)
    if (error.code === 'P2002') return res.status(400).json({ status: 'fail', message: 'Kombinasi Kategori & Nilai ini sudah ada di sistem.' });
    next(error);
  }
};

/**
 * @desc    Update Master Data
 * @route   PUT /api/v1/master-data/:id
 * @access  Private (Admin / Operator / Pimpinan)
 */
const updateMasterData = async (req, res, next) => {
  try {
    const { kategori, nilai, deskripsi } = req.body;

    const dataPayload = {};
    if (kategori) dataPayload.kategori = kategori.toUpperCase().trim();
    if (nilai) dataPayload.nilai = nilai.trim();
    if (deskripsi !== undefined) dataPayload.deskripsi = deskripsi;

    const updated = await prisma.masterData.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Update Data Master sukses', data: updated });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ status: 'fail', message: 'Kombinasi Kategori & Nilai ini bentrok dengan yang sudah ada.' });
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data tidak ditemukan' });
    next(error);
  }
};

/**
 * @desc    Delete Data
 * @route   DELETE /api/v1/master-data/:id
 * @access  Private (Admin)
 */
const deleteMasterData = async (req, res, next) => {
  try {
    await prisma.masterData.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data tidak ditemukan' });
    next(error);
  }
};

module.exports = {
  getAllMasterData,
  createMasterData,
  updateMasterData,
  deleteMasterData
};
