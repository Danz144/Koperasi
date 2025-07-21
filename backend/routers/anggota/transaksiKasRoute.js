const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET: Semua transaksi kas
router.get("/transaksi-kas", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        t.transaksi_id,
        t.tanggal,
        t.jenis_transaksi,
        t.sumber,
        t.jumlah,
        t.keterangan,
        u.name AS dibuat_oleh
      FROM transaksi_kas t
      JOIN users u ON t.dibuat_oleh = u.user_id
      ORDER BY t.tanggal DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("GET /transaksi-kas Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Tambah transaksi kas
router.post("/transaksi-kas", async (req, res) => {
  try {
    const { tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh } = req.body;

    if (!tanggal || !jenis_transaksi || !sumber || !jumlah || !dibuat_oleh) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO transaksi_kas 
      (tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [tanggal, jenis_transaksi, sumber, jumlah, keterangan || "", dibuat_oleh]);

    res.status(201).json({ message: "Transaksi kas berhasil disimpan" });
  } catch (error) {
    console.error("POST /transaksi-kas Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT: Update transaksi kas
router.put("/transaksi-kas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal, jenis_transaksi, sumber, jumlah, keterangan } = req.body;

    if (!tanggal || !jenis_transaksi || !sumber || !jumlah) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [result] = await db.execute(`
      UPDATE transaksi_kas
      SET tanggal = ?, jenis_transaksi = ?, sumber = ?, jumlah = ?, keterangan = ?
      WHERE transaksi_id = ?
    `, [tanggal, jenis_transaksi, sumber, jumlah, keterangan, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json({ message: "Transaksi kas berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /transaksi-kas Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE: Hapus transaksi kas
router.delete("/transaksi-kas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      `DELETE FROM transaksi_kas WHERE transaksi_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json({ message: "Transaksi kas berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /transaksi-kas Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
