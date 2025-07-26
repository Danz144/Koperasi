const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// Helper untuk ID anggota
function generateAnggotaID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 12); // YYYYMMDDHHMM

  return `${randomPart}-${timestamp}`;
}

router.post("/register/anggota", async (req, res) => {
  console.log("Register hit:", req.body);
  const {
    nama,
    email,
    phone,
    alamat,
    pekerjaan,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    status_pernikahan,
  } = req.body;

  if (
    !nama || !email || !phone || !alamat || !tanggal_lahir ||
    !jenis_kelamin || !status_pernikahan
  ) {
    return res.status(400).json({ message: "Mohon lengkapi semua data wajib." });
  }

  try {
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const nomor_anggota = generateAnggotaID();

    // Generate password
    const date = new Date();
    const today = `${date.getFullYear()}${(date.getMonth() + 1 + "").padStart(2, "0")}${(date.getDate() + "").padStart(2, "0")}`;
    const rawPassword = nama.replace(/\s/g, "") + today;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Simpan ke tabel users dan ambil insertId
    const [userResult] = await db.execute(
      `INSERT INTO users (name, email, phone, address, password, role, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama,
        email,
        phone,
        alamat,
        hashedPassword,
        "anggota",
        "nonaktif",
        new Date()
      ]
    );

    const user_id = userResult.insertId;
    console.log("User inserted:", user_id);

    // Simpan ke tabel anggota
    await db.execute(
      `INSERT INTO anggota 
        (user_id, nomor_anggota, pekerjaan, tempat_lahir, tanggal_lahir, jenis_kelamin, status_pernikahan, tanggal_masuk) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        nomor_anggota,
        pekerjaan,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        status_pernikahan,
        new Date()
      ]
    );

    return res.status(201).json({ 
      message: "Registrasi anggota berhasil", 
      nomor_anggota, 
      default_password: rawPassword 
    });

  } catch (err) {
    console.error("Error insert anggota & user:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

module.exports = router;
