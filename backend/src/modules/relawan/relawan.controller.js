const prisma = require('../../database/prisma');
const { hashPassword } = require('../../utils/password');

/**
 * @desc    Register a new Relawan (and User account)
 * @route   POST /api/v1/relawan/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      nama_lengkap, email, password, nik, nomor_hp,
      alamat, organisasi_id, keahlian_ids
    } = req.body;

    // 1. Basic Validation
    if (!nama_lengkap || !email || !password || !nik || !nomor_hp || !alamat) {
      return res.status(400).json({ status: 'fail', message: 'Tolong lengkapi semua field yang diwajibkan!' });
    }

    if (!Array.isArray(keahlian_ids) || keahlian_ids.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Minimal pilih satu keahlian.' });
    }

    // 2. Check Existent User (Email or NIK)
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ status: 'fail', message: 'Email sudah terdaftar.' });
    }
    
    const existingNik = await prisma.relawan.findUnique({ where: { nik } });
    if (existingNik) {
      return res.status(400).json({ status: 'fail', message: 'NIK sudah terdaftar.' });
    }

    // 3. Hash Password
    const hashedPassword = await hashPassword(password);

    // 4. Create User and Relawan in a Prisma Transaction
    // Ensures if Relawan fails to create, the User isn't hung in the database
    const newUser = await prisma.$transaction(async (tx) => {
      // 4a. Create the User (status defaults to inactive waiting admin approval)
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nama: nama_lengkap,
          role: 'relawan',
          status: 'inactive'
        }
      });

      // 4b. Create the Relawan profile linking to User
      const relawanProfile = await tx.relawan.create({
        data: {
          user_id: user.id,
          nama_lengkap,
          email, // Duplicate denormalized for easier fast-reading
          nik,
          nomor_hp,
          alamat,
          organisasi_id: organisasi_id || null, // Optional
          keahlian: {
            connect: keahlian_ids.map(id => ({ id }))
          },
          status_verifikasi: 'pending'
        }
      });

      return { user, profile: relawanProfile };
    });

    // 5. Response 
    // Response expectation from frontend Register.tsx: 
    // { message: string, relawan_id: string, status_verifikasi: 'pending' }
    res.status(201).json({
      status: 'success',
      message: 'Registrasi Berhasil! Akun Anda sedang menunggu verifikasi admin.',
      relawan_id: newUser.profile.id,
      status_verifikasi: newUser.profile.status_verifikasi
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: 'fail', message: 'Data Duplikat (Unique constraint violation)' });
    }
    next(error);
  }
};

/**
 * @desc    Get All Relawan
 * @route   GET /api/v1/relawan
 * @access  Private (Admin / Operator / Pimpinan)
 */
const getAllRelawan = async (req, res, next) => {
  try {
    const relawan = await prisma.relawan.findMany({
      include: {
        organisasi: true,
        keahlian: true,
        user: {
          select: { status: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({ status: 'success', data: relawan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Relawan by ID
 * @route   GET /api/v1/relawan/:id
 * @access  Private
 */
const getRelawanById = async (req, res, next) => {
  try {
    const relawan = await prisma.relawan.findUnique({
      where: { id: req.params.id },
      include: { organisasi: true, keahlian: true }
    });

    if (!relawan) return res.status(404).json({ status: 'fail', message: 'Relawan tidak ditemukan' });

    res.status(200).json({ status: 'success', data: relawan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Relawan (Updates Profile + User Login Access)
 * @route   PATCH /api/v1/relawan/:id/verify
 * @access  Private (Admin / Operator / Pimpinan)
 */
const verifyRelawan = async (req, res, next) => {
  try {
    const { status_verifikasi } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status_verifikasi)) {
      return res.status(400).json({ status: 'fail', message: 'Format validasi ditolak.' });
    }

    const relawanData = await prisma.relawan.findUnique({ where: { id: req.params.id } });
    if (!relawanData) return res.status(404).json({ status: 'fail', message: 'Relawan tidak ditemukan' });

    // Execute within a transaction: If approving, the root User account status must become active
    await prisma.$transaction(async (tx) => {
      await tx.relawan.update({
        where: { id: req.params.id },
        data: { status_verifikasi }
      });

      const userStatusMapping = status_verifikasi === 'approved' ? 'active' : 'inactive';
      
      await tx.user.update({
        where: { id: relawanData.user_id },
        data: { status: userStatusMapping }
      });
    });

    res.status(200).json({ status: 'success', message: `Relawan ${status_verifikasi} dan Akses Diperbarui` });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Relawan
 * @route   PUT /api/v1/relawan/:id
 * @access  Private
 */
const updateRelawan = async (req, res, next) => {
  try {
    const { nama_lengkap, nomor_hp, alamat, organisasi_id, keahlian_ids } = req.body;

    const dataPayload = {
      nama_lengkap,
      nomor_hp,
      alamat,
      ...(organisasi_id !== undefined && { organisasi_id })
    };

    if (Array.isArray(keahlian_ids)) {
      dataPayload.keahlian = {
        set: keahlian_ids.map(id => ({ id }))
      };
    }

    const updated = await prisma.relawan.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Profil relawan diperbarui', data: updated });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Relawan tidak ditemukan' });
    next(error);
  }
};

/**
 * @desc    Delete Relawan
 * @route   DELETE /api/v1/relawan/:id
 * @access  Private (Admin)
 */
const deleteRelawan = async (req, res, next) => {
  try {
    // Delete the root User object directly and it cascades to Relawan Profile natively based on the Prisma schema rules.
    const relawanData = await prisma.relawan.findUnique({ where: { id: req.params.id } });
    if (!relawanData) return res.status(404).json({ status: 'fail', message: 'Relawan tidak ditemukan' });

    await prisma.user.delete({
      where: { id: relawanData.user_id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  getAllRelawan,
  getRelawanById,
  verifyRelawan,
  updateRelawan,
  deleteRelawan
};
