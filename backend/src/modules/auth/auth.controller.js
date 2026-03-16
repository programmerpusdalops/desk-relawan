const prisma = require('../../database/prisma');
const { comparePassword } = require('../../utils/password');
const { generateToken } = require('../../utils/jwt');

/**
 * @desc    Login User
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email },
      include: { relawanProfile: true }
    });

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    // Check Password
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'fail', message: 'Invalid email or password' });
    }

    // Check if Active (For Admins and Operators, they are active immediately. Relawan need verification)
    // Based on the DB design, status can be 'active' or 'inactive'.
    if (user.status === 'inactive') {
       return res.status(403).json({ status: 'fail', message: 'Your account is inactive or pending verification.' });
    }

    // Generate JWT Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = generateToken(payload);

    // Format Response to match frontend expectations
    // Response: { token: string, user_id: string, role: string, user: User }
    res.status(200).json({
      status: 'success',
      token,
      user_id: user.id,
      role: user.role,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        // Optional Frontend Additional fields
        relawan_id: user.relawanProfile?.id || null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Logged in User
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is populated by authMiddleware
    res.status(200).json({
      status: 'success',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change User Password
 * @route   PUT /api/v1/auth/password
 * @access  Private
 */
const updatePassword = async (req, res, next) => {
  try {
    const { password_lama, password_baru } = req.body;
    
    if (!password_lama || !password_baru) {
      return res.status(400).json({ status: 'fail', message: 'Password Lama dan Baru wajib disematkan' });
    }

    if (password_baru.length < 6) {
      return res.status(400).json({ status: 'fail', message: 'Password minimal 6 karakter' });
    }

    // Rely on req.user injected by authenticate Middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'Akun tidak ditemukan' });
    }

    const { hashPassword } = require('../../utils/password');
    const isMatched = await comparePassword(password_lama, user.password);
    
    if (!isMatched) {
      return res.status(401).json({ status: 'fail', message: 'Password lama anda salah. Akses ditolak.' });
    }

    const newHashedPassword = await hashPassword(password_baru);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashedPassword }
    });

    res.status(200).json({ status: 'success', message: 'Password berhasil diubah. Silakan login kembali dengan password baru jika ditendang.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  updatePassword
};
