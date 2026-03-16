const prisma = require('../../database/prisma');
const PDFDocument = require('pdfkit');

/**
 * @desc    Get All Penugasan
 * @route   GET /api/v1/penugasan
 * @access  Private
 */
const getAllPenugasan = async (req, res, next) => {
  try {
    const penugasan = await prisma.penugasan.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        bencana: { select: { id: true, nama_bencana: true } },
        anggota: { select: { id: true, nama_lengkap: true } }
      }
    });

    const formattedData = penugasan.map(p => ({
      ...p,
      bencana_nama: p.bencana.nama_bencana
    }));

    res.status(200).json({ status: 'success', data: formattedData });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create Penugasan
 * @route   POST /api/v1/penugasan
 * @access  Private (Admin / Operator / Pimpinan)
 */
const createPenugasan = async (req, res, next) => {
  try {
    const { 
      bencana_id, nama_tim, lokasi_penugasan, 
      tanggal_mulai, tanggal_selesai, anggota_ids 
    } = req.body;

    if (!bencana_id || !nama_tim || !lokasi_penugasan || !tanggal_mulai || !tanggal_selesai) {
       return res.status(400).json({ status: 'fail', message: 'Lengkapi semua form Penugasan.' });
    }

    const newPenugasan = await prisma.penugasan.create({
      data: {
        bencana_id,
        nama_tim,
        lokasi_penugasan,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
        status: 'aktif',
        anggota: Array.isArray(anggota_ids) ? { connect: anggota_ids.map(id => ({ id })) } : undefined
      }
    });

    res.status(201).json({ status: 'success', message: 'Penugasan tim berhasil dibuat', data: newPenugasan });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Penugasan
 * @route   PUT /api/v1/penugasan/:id
 * @access  Private (Admin / Operator / Pimpinan)
 */
const updatePenugasan = async (req, res, next) => {
  try {
    const { 
      bencana_id, nama_tim, lokasi_penugasan, 
      tanggal_mulai, tanggal_selesai, status, anggota_ids 
    } = req.body;

    const dataPayload = {};
    if (bencana_id) dataPayload.bencana_id = bencana_id;
    if (nama_tim) dataPayload.nama_tim = nama_tim;
    if (lokasi_penugasan) dataPayload.lokasi_penugasan = lokasi_penugasan;
    if (tanggal_mulai) dataPayload.tanggal_mulai = new Date(tanggal_mulai);
    if (tanggal_selesai) dataPayload.tanggal_selesai = new Date(tanggal_selesai);
    if (status) dataPayload.status = status;
    
    // Explicit override of members if provided
    if (Array.isArray(anggota_ids)) {
      dataPayload.anggota = { set: anggota_ids.map(id => ({ id })) };
    }

    const updated = await prisma.penugasan.update({
      where: { id: req.params.id },
      data: dataPayload
    });

    res.status(200).json({ status: 'success', message: 'Data Penugasan diperbarui', data: updated });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data penugasan tidak ditemukan' });
    next(error);
  }
};

/**
 * @desc    Delete Penugasan
 * @route   DELETE /api/v1/penugasan/:id
 * @access  Private (Admin Only)
 */
const deletePenugasan = async (req, res, next) => {
  try {
    await prisma.penugasan.delete({
      where: { id: req.params.id }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ status: 'fail', message: 'Data penugasan tidak ditemukan' });
    next(error);
  }
};

/**
 * @desc    Mock Generate Surat Tugas PDF
 * @route   GET /api/v1/penugasan/:id/surat-tugas
 * @access  Private
 */
const downloadSuratTugas = async (req, res, next) => {
  try {
    const detail = await prisma.penugasan.findUnique({
      where: { id: req.params.id },
      include: {
        bencana: true,
        anggota: true
      }
    });

    if (!detail) return res.status(404).json({ status: 'fail', message: 'Data penugasan tidak ditemukan' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Surat-Tugas-${encodeURIComponent(detail.nama_tim)}.pdf`);
    
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(res);

    // KOP SURAT
    doc.fontSize(16).font('Helvetica-Bold').text('BADAN PENANGGULANGAN BENCANA DAERAH', { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text('PUSAT PENGENDALIAN OPERASI (PUSDALOPS)', { align: 'center' });
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(2);

    // Bodi Surat
    doc.fontSize(12).font('Helvetica').text(`Nomor    : B-OP-${detail.id.slice(0, 5).toUpperCase()}/BPBD/${new Date().getFullYear()}`);
    doc.text(`Perihal  : Surat Perintah Tugas Operasi Kemanusiaan`);
    doc.moveDown(2);

    doc.text('Berdasarkan instruksi Kepala Pelaksana BPBD terkait penanganan tanggap darurat, kami memberikan surat pendelegasian ini untuk menugaskan:');
    doc.moveDown(1);

    doc.font('Helvetica-Bold').text(`Tim Operasional   : ${detail.nama_tim}`, { indent: 20 });
    doc.font('Helvetica-Bold').text(`Status Tim Tersatu: ${detail.status.toUpperCase()}`, { indent: 20 });
    doc.moveDown(1);

    doc.font('Helvetica').text('Untuk melaksanakan Misi Pertolongan, Asessment, Penyelamatan, dan Pemulihan (SAR/Logistik/Medis) dengan sasaran titik utama sebagai berikut:');
    doc.moveDown(0.5);
    
    doc.text(`Acuan Bencana     : ${detail.bencana.nama_bencana}`, { indent: 20 });
    doc.text(`Lokasi Definitif  : ${detail.lokasi_penugasan}`, { indent: 20 });
    const fromDate = new Date(detail.tanggal_mulai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const toDate = new Date(detail.tanggal_selesai).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Durasi Penugasan  : ${fromDate} \ts/d\t ${toDate}`, { indent: 20 });
    doc.moveDown(2);

    doc.font('Helvetica-Bold').text(`Daftar Anggota / Personil Teregistrasi:`).font('Helvetica').moveDown(0.5);
    
    let index = 1;
    detail.anggota.forEach(relawan => {
      doc.text(`${index}. ${relawan.nama_lengkap} \t\t(Kontak: ${relawan.nomor_hp || '-'})`, { indent: 20 });
      index++;
    });

    if (detail.anggota.length === 0) {
      doc.text('- Tim ini diterjunkan masih tanpa komposisi anggota relawan operasional tetap.', { indent: 20, oblique: true });
    }

    doc.moveDown(3);

    const dateToday = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Ditetapkan di : Ruang Pusdalops BPBD`, { align: 'right' });
    doc.text(`Pada Tanggal  : ${dateToday}`, { align: 'right' });
    doc.moveDown(3);

    doc.font('Helvetica-Bold').text('KEPALA PELAKSANA BPBD / PIMPINAN', { align: 'right' });
    doc.moveDown(2);
    doc.font('Helvetica').text('(Tanda Tangan Elektronik Sah)', { align: 'right' });

    doc.end();

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ status: 'error', message: 'Gagal merakit dan mencetak berkas Surat Tugas PDF.' });
    } else {
      console.error('PDF Stream parsing crash:', error);
    }
    next(error);
  }
};

module.exports = {
  getAllPenugasan,
  createPenugasan,
  updatePenugasan,
  deletePenugasan,
  downloadSuratTugas
};
