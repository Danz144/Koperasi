// --- routes/pengajuanRoute.js ---
const express = require('express');
const router = express.Router();
const db = require('../../db'); 

/**
 * GET /api/pengajuan/semua
 * Mengambil semua data pinjaman dari semua anggota untuk halaman laporan.
 */
router.get('/pengajuan/semua', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.pinjaman_id,
                u.name AS nama_anggota,
                p.jumlah,
                p.tenor,
                p.status,
                p.tanggal_pengajuan
            FROM pinjaman p
            JOIN anggota a ON p.anggota_id = a.anggota_id
            JOIN users u ON a.user_id = u.user_id
            ORDER BY p.tanggal_pengajuan DESC;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching all loan applications:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;