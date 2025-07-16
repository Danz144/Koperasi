// --- routes/persetujuanRoute.js ---
const express = require('express');
const router = express.Router();
const db = require('../../db'); // Pastikan path ini benar

/**
 * GET /api/persetujuan/daftar
 * Mengambil daftar pinjaman yang PERLU PERSETUJUAN (status 'diajukan').
 */
router.get('/persetujuan/daftar', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.pinjaman_id, u.name AS nama_anggota, p.jumlah,
                p.tenor, p.status, p.tanggal_pengajuan
            FROM pinjaman p
            JOIN anggota a ON p.anggota_id = a.anggota_id
            JOIN users u ON a.user_id = u.user_id
            WHERE p.status = 'diajukan'
            ORDER BY p.tanggal_pengajuan ASC;
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching loan approvals list:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * PUT /api/persetujuan/:id
 * Endpoint untuk menyetujui atau menolak pinjaman.
 */
router.put('/persetujuan/:id', async (req, res) => {
    const { id } = req.params;
    const { status, user_id, catatan } = req.body;

    if (!['disetujui', 'ditolak'].includes(status) || !user_id) {
        return res.status(400).json({ message: "Data tidak lengkap atau status tidak valid." });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const updateQuery = `UPDATE pinjaman SET status = ?, disetujui_oleh = ?, tanggal_persetujuan = CURDATE() WHERE pinjaman_id = ? AND status = 'diajukan';`;
        const [result] = await connection.execute(updateQuery, [status, user_id, id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Pengajuan tidak ditemukan atau sudah diproses." });
        }

        const logQuery = `INSERT INTO persetujuan_pinjaman (pinjaman_id, user_id, status, catatan) VALUES (?, ?, ?, ?);`;
        await connection.execute(logQuery, [id, user_id, status, catatan || `Status diubah oleh user ID ${user_id}`]);
        
        await connection.commit();
        res.json({ message: `Pinjaman berhasil ${status}.` });
    } catch (error) {
        await connection.rollback();
        console.error("Error updating loan status:", error);
        res.status(500).json({ message: "Server Error" });
    } finally {
        connection.release();
    }
});

module.exports = router;