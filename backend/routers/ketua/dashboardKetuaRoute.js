const express = require('express');
const router = express.Router();
const db = require('../../db');

/**
 * GET: /api/dashboard/ketua/summary
 */
router.get('/ketua/summary', async (req, res) => {
  try {
    const summaryQuery = `
      SELECT
        COUNT(*) AS total_pengajuan,
        COALESCE(SUM(IF(TRIM(status) = 'disetujui', 1, 0)), 0) AS total_disetujui,
        COALESCE(SUM(IF(TRIM(status) = 'ditolak', 1, 0)), 0) AS total_ditolak,
        COALESCE(SUM(IF(TRIM(status) = 'disetujui', jumlah, 0)), 0) AS total_tersalur
      FROM pinjaman;
    `;

    const pieChartQuery = `
      SELECT
        COALESCE(SUM(IF(jumlah < 5000000, 1, 0)), 0) AS di_bawah_5jt,
        COALESCE(SUM(IF(jumlah >= 5000000 AND jumlah <= 10000000, 1, 0)), 0) AS antara_5_10jt,
        COALESCE(SUM(IF(jumlah > 10000000, 1, 0)), 0) AS di_atas_10jt
      FROM pinjaman
      WHERE TRIM(status) = 'disetujui';
    `;

    const [summaryRows] = await db.execute(summaryQuery);
    const [pieChartRows] = await db.execute(pieChartQuery);

    const summaryResult = summaryRows[0] || {};
    const pieChartResult = pieChartRows[0] || {};

    res.json({
      total_pengajuan: summaryResult.total_pengajuan || 0,
      total_disetujui: summaryResult.total_disetujui || 0,
      total_ditolak: summaryResult.total_ditolak || 0,
      total_tersalur: summaryResult.total_tersalur || 0,
      pie_chart_data: [
        pieChartResult.di_bawah_5jt || 0,
        pieChartResult.antara_5_10jt || 0,
        pieChartResult.di_atas_10jt || 0,
      ],
    });

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

/**
 * GET: /api/dashboard/ketua/laporan
 */
router.get('/ketua/laporan', async (req, res) => {
  try {
    const { tanggal } = req.query;

    let query = `
      SELECT 
        p.pinjaman_id,
        u.name AS nama_anggota,
        p.jumlah,
        p.status,
        p.tanggal_pengajuan
      FROM pinjaman p
      JOIN anggota a ON p.anggota_id = a.anggota_id
      JOIN users u ON a.user_id = u.user_id
    `;
    const queryParams = [];

    if (tanggal) {
      query += ' WHERE p.tanggal_pengajuan = ?';
      queryParams.push(tanggal);
    }

    query += ' ORDER BY p.tanggal_pengajuan DESC';

    const [rows] = await db.execute(query, queryParams);
    res.json(rows);

  } catch (error) {
    console.error("Error fetching loan report:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
