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
router.put('/simpanan/:id', async (req, res) => {
    const { id } = req.params;
    const { jumlah, jenis_simpanan, keterangan } = req.body;

    // FIX: Validasi yang benar untuk operasi EDIT
    if (!jumlah || !jenis_simpanan) {
        return res.status(400).json({ message: "Jumlah dan Jenis Simpanan harus diisi." });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [[oldSimpanan]] = await connection.execute('SELECT * FROM simpanan WHERE simpanan_id = ?', [id]);
        if (!oldSimpanan) {
            throw new Error('Simpanan tidak ditemukan');
        }
        await connection.execute(
            'UPDATE simpanan SET jumlah = ?, jenis_simpanan = ?, keterangan = ? WHERE simpanan_id = ?',
            [jumlah, jenis_simpanan, keterangan, id]
        );
        const kasKeteranganRef = `Ref Simpanan ID: ${id}`;
        const kasUpdateQuery = 'UPDATE transaksi_kas SET jumlah = ?, keterangan = ? WHERE keterangan LIKE ?';
        const newKasKeterangan = `Simpanan ${jenis_simpanan} oleh anggota ID ${oldSimpanan.anggota_id}. ${kasKeteranganRef}`;
        await connection.execute(kasUpdateQuery, [jumlah, newKasKeterangan, `%${kasKeteranganRef}%`]);
        await connection.commit();
        res.json({ message: 'Simpanan berhasil diperbarui' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Gagal memperbarui simpanan' });
    } finally {
        connection.release();
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
