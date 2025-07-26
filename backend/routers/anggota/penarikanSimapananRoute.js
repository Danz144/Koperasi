// routes/api/penarikan.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// Ambil semua data penarikan
router.get('/penarikan', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ps.penarikan_id, ps.anggota_id, u.name AS nama_anggota,
             ps.jumlah, ps.tanggal, ps.keterangan
      FROM penarikan_simpanan ps
      JOIN anggota a ON ps.anggota_id = a.anggota_id
      JOIN users u ON a.user_id = u.user_id
      ORDER BY ps.tanggal DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("GET /penarikan:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Tambah penarikan
router.post('/penarikan', async (req, res) => {
  try {
    console.log(req.body);
    const { anggota_id, jumlah, tanggal, keterangan } = req.body;
    if (!anggota_id || !jumlah || !tanggal) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    await db.execute(`
      INSERT INTO penarikan_simpanan (anggota_id, jumlah, tanggal, keterangan)
      VALUES (?, ?, ?, ?)
    `, [anggota_id, jumlah, tanggal, keterangan]);

    res.status(201).json({ message: 'Penarikan berhasil disimpan' });
  } catch (error) {
    console.error("POST /penarikan:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- NEW ENDPOINT: GET Current Balance for a specific member ---
router.get('/saldo/:anggota_id', async (req, res) => {
  try {
      const { anggota_id } = req.params;

      if (!anggota_id) {
          return res.status(400).json({ message: 'ID anggota diperlukan.' });
      }

      const [totalSetoranResult] = await db.execute(
          `SELECT COALESCE(SUM(jumlah_simpan), 0) AS total_setoran
           FROM simpanan
           WHERE anggota_id = ?`,
          [anggota_id]
      );
      const totalSetoran = totalSetoranResult[0].total_setoran;

      const [totalPenarikanResult] = await db.execute(
          `SELECT COALESCE(SUM(jumlah), 0) AS total_penarikan
           FROM penarikan_simpanan
           WHERE anggota_id = ?`,
          [anggota_id]
      );
      const totalPenarikan = totalPenarikanResult[0].total_penarikan;

      const currentBalance = totalSetoran - totalPenarikan;

      res.json({ saldo: currentBalance });

  } catch (error) {
      console.error("GET /saldo/:anggota_id Error:", error);
      res.status(500).json({ message: 'Server Error: Gagal mengambil saldo.' });
  }
});

// Ambil semua data penarikan (No change needed, but ensuring it's here)
router.get('/penarikan', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT ps.penarikan_id, ps.anggota_id, u.name AS nama_anggota,
                   ps.jumlah, ps.tanggal, ps.keterangan
            FROM penarikan_simpanan ps
            JOIN anggota a ON ps.anggota_id = a.anggota_id
            JOIN users u ON a.user_id = u.user_id
            ORDER BY ps.tanggal DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("GET /penarikan:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Tambah penarikan (Modified to include balance check)
router.post('/penarikan', async (req, res) => {
    try {
        console.log("POST /penarikan request body:", req.body); // For debugging
        const { anggota_id, jumlah, tanggal, keterangan } = req.body;

        if (!anggota_id || !jumlah || !tanggal) {
            return res.status(400).json({ message: 'Data tidak lengkap: anggota_id, jumlah, dan tanggal wajib diisi.' });
        }

        if (jumlah <= 0) {
            return res.status(400).json({ message: 'Jumlah penarikan harus lebih dari nol.' });
        }

        // --- Balance Check Logic ---
        // First, get the current balance for the member
        const [balanceResult] = await db.execute(
            `SELECT COALESCE(SUM(CASE WHEN tipe = 'setoran' THEN jumlah ELSE -jumlah END), 0) AS current_saldo
             FROM simpanan
             WHERE anggota_id = ?`,
            [anggota_id]
        );
        const currentBalance = balanceResult[0].current_saldo;

        if (currentBalance < jumlah) {
            return res.status(400).json({ message: `Saldo tidak mencukupi. Saldo Anda saat ini: ${currentBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}` });
        }
        // --- End Balance Check Logic ---

        // Record the withdrawal in penarikan_simpanan table (if it's a separate ledger for withdrawals)
        // If penarikan_simpanan is just a view/record, and the main ledger is 'simpanan',
        // you might only need the 'simpanan' table insert.
        await db.execute(`
            INSERT INTO penarikan_simpanan (anggota_id, jumlah, tanggal, keterangan)
            VALUES (?, ?, ?, ?)
        `, [anggota_id, jumlah, tanggal, keterangan]);

        // IMPORTANT: Also record the transaction in the main 'simpanan' ledger as a 'penarikan' type
        await db.execute(`
            INSERT INTO simpanan (anggota_id, jumlah, tanggal, tipe, keterangan)
            VALUES (?, ?, ?, 'penarikan', ?)
        `, [anggota_id, jumlah, tanggal, keterangan]);


        res.status(201).json({ message: 'Penarikan berhasil disimpan.', new_saldo: currentBalance - jumlah });
    } catch (error) {
        console.error("POST /penarikan:", error);
        res.status(500).json({ message: 'Server Error: Gagal melakukan penarikan.' });
    }
});


module.exports = router;
