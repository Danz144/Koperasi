const express = require('express');
const router = express.Router();
const db = require('../../db'); 

/**
 * GET /api/laporan/pinjaman
 * Mengambil semua data pinjaman dari semua anggota untuk ditampilkan
 * di halaman laporan. Data di-join dengan nama anggota untuk kemudahan pembacaan.
 * Diurutkan berdasarkan tanggal pengajuan terbaru.
 */
router.get('/laporan/pinjaman', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.pinjaman_id,
                u.name AS nama_anggota,
                p.jumlah,
                p.status,
                p.tanggal_pengajuan,
                p.tanggal_persetujuan -- Mengganti nama kolom agar sesuai dengan frontend
            FROM pinjaman p
            JOIN anggota a ON p.anggota_id = a.anggota_id
            JOIN users u ON a.user_id = u.user_id
            ORDER BY p.tanggal_pengajuan DESC;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching loan report:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;