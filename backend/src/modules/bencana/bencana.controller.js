const prisma = require('../../database/prisma');

/**
 * @desc    Get All Bencana
 * @route   GET /api/v1/bencana
 * @access  Private
 */
const getAllBencana = async (req, res, next) => {
  try {
    const bencana = await prisma.bencana.findMany({
      orderBy: { waktu_kejadian: 'desc' },
      include: {
        _count: {
          select: { permintaan: true, penugasan: true }
        }
      }
    });
    res.status(200).json({ status: 'success', data: bencana });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Bencana by ID
 * @route   GET /api/v1/bencana/:id
 * @access  Private
 */
const getBencanaById = async (req, res, next) => {
  try {
    const bencana = await prisma.bencana.findUnique({
      where: { id: req.params.id },
      include: {
        permintaan: true,
        penugasan: true
      }
    });

    if (!bencana) return res.status(404).json({ status: 'fail', message: 'Data bencana tidak ditemukan' });

    res.status(200).json({ status: 'success', data: bencana });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Kejadian Bencana
 * @route   POST /api/v1/bencana
 * @access  Private (Admin / Operator / Pimpinan)
 */
const createBencana = async (req, res, next) => {
  try {
    const { 
      nama_bencana, jenis_bencana, lokasi, 
      latitude, longitude, waktu_kejadian, 
      skala_bencana, status, deskripsi_dampak 
    } = req.body;

    if (!nama_bencana || !jenis_bencana || !lokasi || !waktu_kejadian || !skala_bencana) {
       return res.status(400).json({ status: 'fail', message: 'Tolong lengkapi nama, jenis, lokasi, waktu, dan skala bencana' });
    }

    const newBencana = await prisma.bencana.create({
      data: {
        nama_bencana,
        jenis_bencana,
        lokasi,
        latitude: latitude ? parseFloat(latitude) : 0.0,
        longitude: longitude ? parseFloat(longitude) : 0.0,
        waktu_kejadian: new Date(waktu_kejadian),
        skala_bencana,
        status: status || 'aktif',
        deskripsi_dampak: deskripsi_dampak || null
      }
    });

    res.status(201).json({ status: 'success', message: 'Data bencana berhasil ditambahkan', data: newBencana });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Bencana
 * @route   PUT /api/v1/bencana/:id
 * @access  Private (Admin / Operator / Pimpinan)
 */
const updateBencana = async (req, res, next) => {
  try {
    const { 
      nama_bencana, jenis_bencana, lokasi, 
      latitude, longitude, waktu_kejadian, 
      skala_bencana, status, deskripsi_dampak 
    } = req.body;

    const dataPayload = {};
    if (nama_bencana) dataPayload.nama_bencana = nama_bencana;
    if (jenis_bencana) dataPayload.jenis_bencana = jenis_bencana;
    if (lokasi) dataPayload.lokasi = lokasi;
    if (latitude !== undefined) dataPayload.latitude = parseFloat(latitude);
    if (longitude !== undefined) dataPayload.longitude = parseFloat(longitude);
    if (waktu_kejadian) dataPayload.waktu_kejadian = new Date(waktu_kejadian);
    if (skala_bencana) dataPayload.skala_bencana = skala_bencana;
    if (status) dataPayload.status = status;
    if (deskripsi_dampak !== undefined) dataPayload.deskripsi_dampak = deskripsi_dampak;

    const updated = await prisma.bencana.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Data bencana diperbarui', data: updated });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data bencana tidak ditemukan' });
    next(error);
  }
};

/**
 * @desc    Delete Bencana
 * @route   DELETE /api/v1/bencana/:id
 * @access  Private (Admin Only)
 */
const deleteBencana = async (req, res, next) => {
  try {
    await prisma.bencana.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data bencana tidak ditemukan' });
    next(error);
  }
};

module.exports = {
  getAllBencana,
  getBencanaById,
  createBencana,
  updateBencana,
  deleteBencana
};
