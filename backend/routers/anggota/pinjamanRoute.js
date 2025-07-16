const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET: Semua data pinjaman
router.get("/pinjaman", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.pinjaman_id,
        p.anggota_id,
        u.name AS nama_anggota,
        p.jumlah,
        p.tenor,
        p.bunga_persen,
        p.status,
        p.tanggal_pengajuan,
        p.tanggal_persetujuan,
        p.total_terbayar,
        p.tanggal_lunas,
        ketua.name AS disetujui_oleh
      FROM pinjaman p
      JOIN anggota a ON p.anggota_id = a.anggota_id
      JOIN users u ON a.user_id = u.user_id
      LEFT JOIN users ketua ON p.disetujui_oleh = ketua.user_id
      ORDER BY p.tanggal_pengajuan DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error GET /pinjaman:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Ajukan pinjaman baru
router.post("/pinjaman", async (req, res) => {
  try {
    const {
      anggota_id,
      jumlah,
      tenor,
      bunga_persen,
      tanggal_pengajuan
    } = req.body;

    if (!anggota_id || !jumlah || !tenor || !bunga_persen || !tanggal_pengajuan) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO pinjaman 
      (anggota_id, jumlah, tenor, bunga_persen, tanggal_pengajuan)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [anggota_id, jumlah, tenor, bunga_persen, tanggal_pengajuan]);

    res.status(201).json({ message: "Pengajuan pinjaman berhasil dikirim" });
  } catch (error) {
    console.error("Error POST /pinjaman:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT: Update status pinjaman (misalnya disetujui/ditolak/lunas)
router.put("/pinjaman/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      tanggal_persetujuan,
      disetujui_oleh,
      total_terbayar,
      tanggal_lunas
    } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status pinjaman wajib diisi" });
    }

    const [result] = await db.execute(`
      UPDATE pinjaman
      SET 
        status = ?, 
        tanggal_persetujuan = ?, 
        disetujui_oleh = ?, 
        total_terbayar = ?, 
        tanggal_lunas = ?
      WHERE pinjaman_id = ?
    `, [status, tanggal_persetujuan, disetujui_oleh, total_terbayar, tanggal_lunas, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pinjaman tidak ditemukan" });
    }

    res.json({ message: "Pinjaman berhasil diperbarui" });
  } catch (error) {
    console.error("Error PUT /pinjaman:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE: Hapus pinjaman (opsional, gunakan hati-hati)
router.delete("/pinjaman/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `DELETE FROM pinjaman WHERE pinjaman_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pinjaman tidak ditemukan" });
    }

    res.json({ message: "Pinjaman berhasil dihapus" });
  } catch (error) {
    console.error("Error DELETE /pinjaman:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
