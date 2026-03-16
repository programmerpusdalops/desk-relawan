const prisma = require('../../database/prisma');

/**
 * @desc    Get Latest Volunteer Locations
 * @route   GET /api/v1/monitoring/lokasi
 * @access  Private
 */
const getLokasiRelawan = async (req, res, next) => {
  try {
    // Only fetch volunteers who have coordinates set or are actively tracked
    const relawan = await prisma.relawan.findMany({
      where: {
        status_verifikasi: 'approved',
        NOT: {
          latitude: 0,
          longitude: 0
        }
      },
      select: {
        id: true,
        nama_lengkap: true,
        latitude: true,
        longitude: true,
        status_lapangan: true
      }
    });

    // Format matches the frontend RelawanLokasi type expectations
    const formattedData = relawan.map(r => ({
      relawan_id: r.id,
      nama: r.nama_lengkap,
      latitude: r.latitude,
      longitude: r.longitude,
      status: r.status_lapangan
    }));

    res.status(200).json({ status: 'success', data: formattedData });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Ping / Update Volunteer Location and field Status
 * @route   POST /api/v1/monitoring/update-location
 * @access  Private (Relawan)
 */
const pingLokasi = async (req, res, next) => {
  try {
    const { latitude, longitude, status_lapangan } = req.body;
    
    // Attempt to extract Volunteer profile linked to the logged in User ID
    const profile = await prisma.relawan.findUnique({
      where: { user_id: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ status: 'fail', message: 'Profil relawan tidak ditemukan.' });
    }

    const dataPayload = {};
    if (latitude !== undefined) dataPayload.latitude = parseFloat(latitude);
    if (longitude !== undefined) dataPayload.longitude = parseFloat(longitude);
    if (status_lapangan) dataPayload.status_lapangan = status_lapangan;

    const updated = await prisma.relawan.update({
      where: { id: profile.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Titik lokasi diupdate.', data: {
      relawan_id: updated.id,
      nama: updated.nama_lengkap,
      latitude: updated.latitude,
      longitude: updated.longitude,
      status: updated.status_lapangan
    }});

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Override Lokasi Relawan secara Paksa
 * @route   PUT /api/v1/monitoring/:id/override
 * @access  Private (Admin / Operator / Pimpinan)
 */
const overrideLokasi = async (req, res, next) => {
  try {
    const { latitude, longitude, status_lapangan } = req.body;
    
    // Attempt tracking identity profile resolving native bounds
    const profile = await prisma.relawan.findUnique({
      where: { id: req.params.id }
    });

    if (!profile) {
      return res.status(404).json({ status: 'fail', message: 'Profil relawan tidak dikenali sistem.' });
    }

    const dataPayload = {};
    if (latitude !== undefined) dataPayload.latitude = parseFloat(latitude);
    if (longitude !== undefined) dataPayload.longitude = parseFloat(longitude);
    if (status_lapangan) dataPayload.status_lapangan = status_lapangan;

    const updated = await prisma.relawan.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Override status titik lokasi diterapkan.', data: {
      relawan_id: updated.id,
      nama: updated.nama_lengkap,
      latitude: updated.latitude,
      longitude: updated.longitude,
      status: updated.status_lapangan
    }});

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLokasiRelawan,
  pingLokasi,
  overrideLokasi
};
