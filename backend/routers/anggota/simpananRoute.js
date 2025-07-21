const express = require('express');
const router = express.Router();
const db = require('../../db');

// Ambil semua data simpanan (JOIN anggota & user untuk info lengkap)
router.get('/simpanan', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        simpanan.simpanan_id,
        simpanan.anggota_id,
        users.name AS nama_anggota,
        simpanan.jenis_simpanan,
        simpanan.jumlah,
        simpanan.tanggal_simpan,
        simpanan.keterangan
      FROM simpanan
      JOIN anggota ON simpanan.anggota_id = anggota.anggota_id
      JOIN users ON anggota.user_id = users.user_id
      ORDER BY simpanan.tanggal_simpan DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);  
    res.status(500).json({ message: 'Server Error' });
  }
});

// Tambah data simpanan
router.post('/simpanan', async (req, res) => {
  try {
    const { anggota_id, jenis_simpanan, jumlah, tanggal_simpan, keterangan } = req.body;

    if (!anggota_id || !jenis_simpanan || !jumlah || !tanggal_simpan) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO simpanan (anggota_id, jenis_simpanan, jumlah, tanggal_simpan, keterangan)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [anggota_id, jenis_simpanan, jumlah, tanggal_simpan, keterangan]);
    res.status(201).json({ message: 'Simpanan berhasil disimpan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Edit simpanan
router.put("/simpanan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { jenis_simpanan, jumlah, tanggal_simpan, keterangan } = req.body;

    if (!jenis_simpanan || !jumlah || !tanggal_simpan) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [result] = await db.execute(
      `
      UPDATE simpanan 
      SET jenis_simpanan = ?, jumlah = ?, tanggal_simpan = ?, keterangan = ?
      WHERE simpanan_id = ?
    `,
      [jenis_simpanan, jumlah, tanggal_simpan, keterangan, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Simpanan tidak ditemukan" });
    }

    res.json({ message: "Simpanan berhasil diperbarui" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Hapus simpanan (hard delete)
router.delete('/simpanan/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM simpanan WHERE simpanan_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Simpanan tidak ditemukan' });
    }

    res.json({ message: 'Simpanan berhasil dihapus' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
