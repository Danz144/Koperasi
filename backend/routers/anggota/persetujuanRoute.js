const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET semua data persetujuan pinjaman
router.get('/persetujuan', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        pp.persetujuan_id,
        pp.pinjaman_id,
        a.nomor_anggota,
        u.name AS ketua,
        pp.status,
        pp.tanggal,
        pp.catatan
      FROM persetujuan_pinjaman pp
      JOIN pinjaman p ON pp.pinjaman_id = p.pinjaman_id
      JOIN anggota a ON p.anggota_id = a.anggota_id
      JOIN users u ON pp.user_id = u.user_id
      ORDER BY pp.tanggal DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("GET /persetujuan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST persetujuan pinjaman oleh ketua
router.post('/persetujuan', async (req, res) => {
  try {
    const { pinjaman_id, user_id, status, catatan } = req.body;

    if (!pinjaman_id || !user_id || !status) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Insert ke tabel persetujuan_pinjaman
    await db.execute(`
      INSERT INTO persetujuan_pinjaman (pinjaman_id, user_id, status, catatan)
      VALUES (?, ?, ?, ?)
    `, [pinjaman_id, user_id, status, catatan || ""]);

    // Update status pinjaman jika disetujui atau ditolak
    const tanggalPersetujuan = new Date();
    await db.execute(`
      UPDATE pinjaman
      SET status = ?, tanggal_persetujuan = ?, disetujui_oleh = ?
      WHERE pinjaman_id = ?
    `, [status, tanggalPersetujuan, user_id, pinjaman_id]);

    res.status(201).json({ message: "Persetujuan pinjaman berhasil disimpan" });
  } catch (error) {
    console.error("POST /persetujuan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE persetujuan pinjaman (jika diperlukan)
router.delete('/persetujuan/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      `DELETE FROM persetujuan_pinjaman WHERE persetujuan_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Persetujuan tidak ditemukan" });
    }

    res.json({ message: "Persetujuan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /persetujuan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
