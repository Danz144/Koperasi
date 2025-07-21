const express = require('express');
const router = express.Router();
const db = require('../../db');

// Ambil semua penarikan simpanan
router.get('/penarikan', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        ps.penarikan_id,
        ps.anggota_id,
        u.name AS nama_anggota,
        ps.jumlah,
        ps.tanggal,
        ps.keterangan
      FROM penarikan_simpanan ps
      JOIN anggota a ON ps.anggota_id = a.anggota_id
      JOIN users u ON a.user_id = u.user_id
      ORDER BY ps.tanggal DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error GET /penarikan:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Tambah penarikan simpanan
router.post('/penarikan', async (req, res) => {
  try {
    const { anggota_id, jumlah, tanggal, keterangan } = req.body;

    if (!anggota_id || !jumlah || !tanggal) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = `
      INSERT INTO penarikan_simpanan (anggota_id, jumlah, tanggal, keterangan)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(sql, [anggota_id, jumlah, tanggal, keterangan]);
    res.status(201).json({ message: 'Penarikan berhasil disimpan' });
  } catch (error) {
    console.error("Error POST /penarikan:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update penarikan simpanan
router.put('/penarikan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { jumlah, tanggal, keterangan } = req.body;

    if (!jumlah || !tanggal) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [result] = await db.execute(`
      UPDATE penarikan_simpanan
      SET jumlah = ?, tanggal = ?, keterangan = ?
      WHERE penarikan_id = ?
    `, [jumlah, tanggal, keterangan, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Penarikan berhasil diperbarui' });
  } catch (error) {
    console.error("Error PUT /penarikan:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Hapus penarikan simpanan
router.delete('/penarikan/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM penarikan_simpanan WHERE penarikan_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Penarikan berhasil dihapus' });
  } catch (error) {
    console.error("Error DELETE /penarikan:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
