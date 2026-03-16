const prisma = require('../../database/prisma');

/**
 * @desc    Get All Organisasi
 * @route   GET /api/v1/organisasi
 * @access  Public (Used for registration form dropdowns)
 */
const getAllOrganisasi = async (req, res, next) => {
  try {
    const organisasi = await prisma.organisasi.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { relawan: true } // Auto count the members mapped to this organization
        }
      }
    });

    // Formatting output to match expected frontend structure `jumlah_anggota` mapping
    const formatted = organisasi.map(org => ({
      ...org,
      jumlah_anggota: org._count.relawan
    }));

    res.status(200).json({ status: 'success', data: formatted });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Organisasi
 * @route   POST /api/v1/organisasi
 * @access  Private
 */
const createOrganisasi = async (req, res, next) => {
  try {
    const { nama_organisasi, jenis_organisasi, alamat, nomor_kontak, dokumen_legalitas } = req.body;

    if (!nama_organisasi || !nomor_kontak) {
      return res.status(400).json({ status: 'fail', message: 'Nama dan Nomor Kontak wajib diisi.' });
    }

    const newOrg = await prisma.organisasi.create({
      data: {
        nama_organisasi,
        jenis_organisasi: jenis_organisasi || 'LSM',
        alamat: alamat || '-',
        nomor_kontak,
        dokumen_legalitas,
        // Default pending
      }
    });

    res.status(201).json({ status: 'success', message: 'Organisasi berhasil didaftarkan.', data: newOrg });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Organisasi (Approve or Reject)
 * @route   PATCH /api/v1/organisasi/:id/verify
 * @access  Private (Admin / Operator)
 */
const verifyOrganisasi = async (req, res, next) => {
  try {
    const { status_verifikasi } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status_verifikasi)) {
      return res.status(400).json({ status: 'fail', message: 'Status tidak valid.' });
    }

    const updated = await prisma.organisasi.update({
      where: { id: req.params.id },
      data: { status_verifikasi }
    });

    res.status(200).json({ status: 'success', message: `Organisasi ${status_verifikasi}`, data: updated });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'Organisasi tidak ditemukan' });
    }
    next(error);
  }
};

/**
 * @desc    Update Organisasi
 * @route   PUT /api/v1/organisasi/:id
 * @access  Private (Admin)
 */
const updateOrganisasi = async (req, res, next) => {
  try {
    const { nama_organisasi, jenis_organisasi, alamat, nomor_kontak, dokumen_legalitas } = req.body;

    const updated = await prisma.organisasi.update({
      where: { id: req.params.id },
      data: {
        ...(nama_organisasi && { nama_organisasi }),
        ...(jenis_organisasi && { jenis_organisasi }),
        ...(alamat && { alamat }),
        ...(nomor_kontak && { nomor_kontak }),
        ...(dokumen_legalitas !== undefined && { dokumen_legalitas })
      }
    });

    res.status(200).json({ status: 'success', message: 'Profil organisasi berhasil diperbarui.', data: updated });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'Organisasi tidak ditemukan' });
    }
    next(error);
  }
};

/**
 * @desc    Delete Organisasi
 * @route   DELETE /api/v1/organisasi/:id
 * @access  Private (Admin)
 */
const deleteOrganisasi = async (req, res, next) => {
  try {
    await prisma.organisasi.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'Organisasi tidak ditemukan' });
    }
    next(error);
  }
};

module.exports = {
  getAllOrganisasi,
  createOrganisasi,
  verifyOrganisasi,
  updateOrganisasi,
  deleteOrganisasi
};
