const prisma = require('../../database/prisma');
const { hashPassword } = require('../../utils/password');

/**
 * @desc    Get All Users
 * @route   GET /api/v1/users
 * @access  Private (Admin Only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        relawanProfile: {
          select: {
            id: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single User
 * @route   GET /api/v1/users/:id
 * @access  Private (Admin Only)
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        relawanProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Exclude password from response
    user.password = undefined;

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create User Manually
 * @route   POST /api/v1/users
 * @access  Private (Admin Only)
 */
const createUser = async (req, res, next) => {
  try {
    const { nama, email, password, role, status } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Tolong lengkapi nama, email, dan password' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'Email sudah digunakan' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: role || 'operator',
        status: status || 'active'
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        status: true
      }
    });

    res.status(201).json({ status: 'success', message: 'User berhasil ditambahkan', data: newUser });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle User Status (Activate/Deactivate)
 * @route   PATCH /api/v1/users/:id/status
 * @access  Private (Admin Only)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ status: 'fail', message: 'Status tidak valid' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: {
        id: true,
        nama: true,
        email: true,
        status: true,
        role: true
      }
    });

    res.status(200).json({ status: 'success', message: `User status updated to ${status}`, data: updatedUser });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    next(error);
  }
};

/**
 * @desc    Update Full User details
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin Only)
 */
const updateUser = async (req, res, next) => {
  try {
    const { nama, email, role, status, password } = req.body;
    let dataToUpdate = { nama, email, role, status };

    if (password) {
      dataToUpdate.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: dataToUpdate,
      select: { id: true, nama: true, email: true, role: true, status: true }
    });

    res.status(200).json({ status: 'success', message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: 'fail', message: 'Email sudah digunakan' });
    }
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    next(error);
  }
};

/**
 * @desc    Delete User
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin Only)
 */
const deleteUser = async (req, res, next) => {
  try {
    // If the user has a linked Relawan profile, prisma schema specifies `onDelete: Cascade`
    // Therefore deleting the User will delete the Relawan securely.
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserStatus,
  updateUser,
  deleteUser
};
