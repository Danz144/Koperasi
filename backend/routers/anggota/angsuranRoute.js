const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET: Semua data angsuran
router.get("/angsuran", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        a.angsuran_id,
        a.pinjaman_id,
        u.name AS nama_anggota,
        a.tanggal_bayar,
        a.jumlah_bayar,
        a.denda,
        a.keterangan
      FROM angsuran_pinjaman a
      JOIN pinjaman p ON a.pinjaman_id = p.pinjaman_id
      JOIN anggota ag ON p.anggota_id = ag.anggota_id
      JOIN users u ON ag.user_id = u.user_id
      ORDER BY a.tanggal_bayar DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("GET /angsuran Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Tambah angsuran
router.post("/angsuran", async (req, res) => {
  try {
    const { pinjaman_id, tanggal_bayar, jumlah_bayar, denda, keterangan } = req.body;

    if (!pinjaman_id || !tanggal_bayar || !jumlah_bayar) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO angsuran_pinjaman 
      (pinjaman_id, tanggal_bayar, jumlah_bayar, denda, keterangan)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [pinjaman_id, tanggal_bayar, jumlah_bayar, denda || 0, keterangan]);
    res.status(201).json({ message: "Angsuran berhasil ditambahkan" });
  } catch (error) {
    console.error("POST /angsuran Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT: Update angsuran
router.put("/angsuran/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal_bayar, jumlah_bayar, denda, keterangan } = req.body;

    if (!tanggal_bayar || !jumlah_bayar) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [result] = await db.execute(`
      UPDATE angsuran_pinjaman
      SET tanggal_bayar = ?, jumlah_bayar = ?, denda = ?, keterangan = ?
      WHERE angsuran_id = ?
    `, [tanggal_bayar, jumlah_bayar, denda || 0, keterangan, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Angsuran tidak ditemukan" });
    }

    res.json({ message: "Angsuran berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /angsuran Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE: Hapus angsuran
router.delete("/angsuran/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `DELETE FROM angsuran_pinjaman WHERE angsuran_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Angsuran tidak ditemukan" });
    }

    res.json({ message: "Angsuran berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /angsuran Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
