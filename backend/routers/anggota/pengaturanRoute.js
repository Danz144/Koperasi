const express = require("express");
const router = express.Router();
const db = require("../../db");

// GET pengaturan koperasi
router.get("/pengaturan", async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM pengaturan_koperasi LIMIT 1`);
    res.json(rows[0] || {});
  } catch (error) {
    console.error("GET /pengaturan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST tambah pengaturan koperasi (jika belum ada)
router.post("/pengaturan", async (req, res) => {
  try {
    const { nama_koperasi, alamat, telepon, email, simpanan_wajib_bulanan, bunga_default } = req.body;

    if (!nama_koperasi || !alamat || !telepon || !email || !simpanan_wajib_bulanan || !bunga_default) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [cek] = await db.execute(`SELECT COUNT(*) AS total FROM pengaturan_koperasi`);
    if (cek[0].total > 0) {
      return res.status(400).json({ message: "Pengaturan sudah ada, gunakan PUT untuk mengedit" });
    }

    await db.execute(`
      INSERT INTO pengaturan_koperasi 
      (nama_koperasi, alamat, telepon, email, simpanan_wajib_bulanan, bunga_default)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [nama_koperasi, alamat, telepon, email, simpanan_wajib_bulanan, bunga_default]);

    res.status(201).json({ message: "Pengaturan berhasil disimpan" });
  } catch (error) {
    console.error("POST /pengaturan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update pengaturan koperasi
router.put("/pengaturan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_koperasi, alamat, telepon, email, simpanan_wajib_bulanan, bunga_default } = req.body;

    if (!nama_koperasi || !alamat || !telepon || !email || !simpanan_wajib_bulanan || !bunga_default) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [result] = await db.execute(`
      UPDATE pengaturan_koperasi
      SET nama_koperasi = ?, alamat = ?, telepon = ?, email = ?, 
          simpanan_wajib_bulanan = ?, bunga_default = ?
      WHERE id = ?
    `, [nama_koperasi, alamat, telepon, email, simpanan_wajib_bulanan, bunga_default, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pengaturan tidak ditemukan" });
    }

    res.json({ message: "Pengaturan berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /pengaturan Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
