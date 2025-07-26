const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all anggota
router.get('/anggota', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        anggota.anggota_id,
        anggota.user_id,
        users.name,
        users.email,
        users.phone,
        anggota.nomor_anggota,
        anggota.tanggal_masuk,
        anggota.pekerjaan,
        anggota.tempat_lahir,
        anggota.tanggal_lahir,
        anggota.jenis_kelamin,
        anggota.status_pernikahan
      FROM anggota
      JOIN users ON anggota.user_id = users.user_id
      ORDER BY anggota.anggota_id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);  
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/anggota/list', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.anggota_id, u.name 
            FROM anggota a
            JOIN users u ON a.user_id = u.user_id
            ORDER BY u.name ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching member list:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Tambah anggota baru
router.post('/anggota', async (req, res) => {
  try {
    const {
      user_id,
      nomor_anggota,
      tanggal_masuk,
      pekerjaan,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      status_pernikahan
    } = req.body;

    if (
      !user_id || !nomor_anggota || !tanggal_masuk || !pekerjaan ||
      !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !status_pernikahan
    ) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO anggota 
      (user_id, nomor_anggota, tanggal_masuk, pekerjaan, tempat_lahir, tanggal_lahir, jenis_kelamin, status_pernikahan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [
      user_id, nomor_anggota, tanggal_masuk, pekerjaan,
      tempat_lahir, tanggal_lahir, jenis_kelamin, status_pernikahan
    ]);
    res.status(201).json({ message: 'Anggota berhasil ditambahkan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update anggota
router.put("/anggota/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nomor_anggota,
      tanggal_masuk,
      pekerjaan,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      status_pernikahan
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const [result] = await db.execute(`
      UPDATE anggota SET
        nomor_anggota = ?,
        tanggal_masuk = ?,
        pekerjaan = ?,
        tempat_lahir = ?,
        tanggal_lahir = ?,
        jenis_kelamin = ?,
        status_pernikahan = ?
      WHERE anggota_id = ?
    `, [
      nomor_anggota,
      tanggal_masuk,
      pekerjaan,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      status_pernikahan,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    res.json({ message: "Data anggota berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete anggota
router.delete("/anggota/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const [result] = await db.execute(
      "DELETE FROM anggota WHERE anggota_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    res.json({ message: "Anggota berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
