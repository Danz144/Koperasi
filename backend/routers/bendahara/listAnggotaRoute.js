const express = require("express");
const router = express.Router();
const db = require('../../db');

// 🔹 List semua anggota
router.get("/list/anggota", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.nomor_anggota, u.name, u.email, u.address, u.phone, a.tempat_lahir, a.tanggal_lahir, a.jenis_kelamin, a.status_pernikahan, u.status 
       FROM anggota a 
       JOIN users u ON a.user_id = u.user_id
       ORDER BY a.anggota_id DESC;`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error get list anggota:", error);
    res.status(500).json({ message: "Gagal mengambil data anggota" });
  }
});

// 🔹 Update status anggota
router.post("/anggota/status", async (req, res) => {
  const { email, status } = req.body;

  if (!email || !["aktif", "nonaktif"].includes(status)) {
    return res.status(400).json({ message: "Data tidak valid." });
  }

  try {
    const [result] = await db.execute(
      `UPDATE users SET status = ? WHERE email = ?`,
      [status, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    res.json({ message: `Status berhasil diubah menjadi ${status}` });
  } catch (error) {
    console.error("Error update status:", error);
    res.status(500).json({ message: "Gagal memperbarui status" });
  }
});

// 🔹 Detail anggota berdasarkan nomor anggota
router.get("/detail/by-nomor/:nomor_anggota", async (req, res) => {
  const { nomor_anggota } = req.params;

  const [rows] = await db.execute(
    `SELECT a.*, u.status, u.name, u.email, u.address, u.phone, u.created_at 
     FROM anggota a 
     JOIN users u ON a.user_id = u.user_id 
     WHERE a.nomor_anggota = ?`,
    [nomor_anggota]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Data anggota tidak ditemukan" });
  }

  res.json(rows[0]);
});

module.exports = router;
