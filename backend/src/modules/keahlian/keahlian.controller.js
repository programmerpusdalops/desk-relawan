const prisma = require('../../database/prisma');

/**
 * @desc    Get All Keahlian
 * @route   GET /api/v1/keahlian
 * @access  Public (Used for registration form) or Private
 */
const getAllKeahlian = async (req, res, next) => {
  try {
    const keahlian = await prisma.keahlian.findMany({
      orderBy: { kategori: 'asc' }
    });
    res.status(200).json({ status: 'success', data: keahlian });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Keahlian
 * @route   POST /api/v1/keahlian
 * @access  Private (Admin Only)
 */
const createKeahlian = async (req, res, next) => {
  try {
    const { nama, kategori, deskripsi } = req.body;

    if (!nama || !kategori) {
      return res.status(400).json({ status: 'fail', message: 'Tolong isi nama dan kategori keahlian' });
    }

    const newKeahlian = await prisma.keahlian.create({
      data: { nama, kategori, deskripsi }
    });

    res.status(201).json({ status: 'success', message: 'Keahlian berhasil dibuat', data: newKeahlian });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Keahlian
 * @route   PUT /api/v1/keahlian/:id
 * @access  Private (Admin Only)
 */
const updateKeahlian = async (req, res, next) => {
  try {
    const { nama, kategori, deskripsi } = req.body;

    const updated = await prisma.keahlian.update({
      where: { id: req.params.id },
      data: { nama, kategori, deskripsi }
    });

    res.status(200).json({ status: 'success', message: 'Keahlian diperbarui', data: updated });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 'fail', message: 'Keahlian tidak ditemukan' });
    }
    next(error);
  }
};

/**
 * @desc    Delete Keahlian
 * @route   DELETE /api/v1/keahlian/:id
 * @access  Private (Admin Only)
 */
const deleteKeahlian = async (req, res, next) => {
  try {
    await prisma.keahlian.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'Keahlian tidak ditemukan' });
    }
    next(error);
  }
};

module.exports = {
  getAllKeahlian,
  createKeahlian,
  updateKeahlian,
  deleteKeahlian
};
