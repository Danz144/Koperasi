// --- routes/transaksiRoute.js ---
const express = require('express');
const router = express.Router();
const db = require('../../db'); // Pastikan path ini benar

/**
 * POST /api/transaksi/simpanan
 * - Mencatat simpanan baru dari seorang anggota.
 * - Dijalankan oleh Bendahara.
 * - Melakukan 2 aksi dalam satu transaksi:
 * 1. INSERT ke tabel `simpanan`.
 * 2. INSERT ke tabel `transaksi_kas` sebagai 'masuk'.
 */
router.post('/transaksi/simpanan', async (req, res) => {
    // FIX: Menggunakan snake_case agar konsisten dengan frontend dan DB
    const { anggota_id, jenis, jumlah, keterangan, bendahara_user_id } = req.body;

    if (!anggota_id || !jenis || !jumlah || !bendahara_user_id) {
        return res.status(400).json({ message: "Data tidak lengkap." });
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const simpananQuery = `INSERT INTO simpanan (anggota_id, jenis_simpanan, jumlah, tanggal_simpan, keterangan) VALUES (?, ?, ?, CURDATE(), ?);`;
        await connection.execute(simpananQuery, [anggota_id, jenis, jumlah, keterangan]);
        
        const kasQuery = `INSERT INTO transaksi_kas (tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh) VALUES (CURDATE(), 'masuk', 'simpanan', ?, ?, ?);`;
        const kasKeterangan = `Simpanan ${jenis} oleh anggota ID ${anggota_id}. ${keterangan || ''}`;
        await connection.execute(kasQuery, [jumlah, kasKeterangan, bendahara_user_id]);
        
        await connection.commit();
        res.status(201).json({ message: `Simpanan berhasil dicatat.` });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ message: `Anggota dengan ID ${anggota_id} tidak ditemukan.` });
        }
        res.status(500).json({ message: "Server Error" });
    } finally {
        connection.release();
    }
});


/**
 * GET /api/transaksi/saldo/:anggotaId
 * - Menghitung dan mengembalikan saldo simpanan bersih seorang anggota.
 */
// Endpoint untuk Cek Saldo
router.get('/transaksi/saldo/:anggotaId', async (req, res) => {
    const { anggotaId } = req.params;
    try {
        const saldoQuery = `SELECT (SELECT COALESCE(SUM(jumlah), 0) FROM simpanan WHERE anggota_id = ?) - (SELECT COALESCE(SUM(jumlah), 0) FROM penarikan_simpanan WHERE anggota_id = ?) AS saldo;`;
        const [[result]] = await db.execute(saldoQuery, [anggotaId, anggotaId]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


/**
 * POST /api/transaksi/penarikan
 * - Mencatat penarikan baru oleh anggota.
 * - Melakukan validasi saldo sebelum memproses.
 */
// Endpoint untuk Penarikan
router.post('/transaksi/penarikan', async (req, res) => {
    const { anggota_id, jumlah, keterangan, bendahara_user_id } = req.body;
    if (!anggota_id || !jumlah || !bendahara_user_id) return res.status(400).json({ message: "Data tidak lengkap." });
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const saldoQuery = `SELECT (SELECT COALESCE(SUM(jumlah), 0) FROM simpanan WHERE anggota_id = ?) - (SELECT COALESCE(SUM(jumlah), 0) FROM penarikan_simpanan WHERE anggota_id = ?) AS saldo;`;
        const [[{ saldo }]] = await connection.execute(saldoQuery, [anggota_id, anggota_id]);
        if (parseFloat(jumlah) > parseFloat(saldo)) {
            await connection.rollback();
            return res.status(400).json({ message: `Penarikan gagal. Saldo tidak mencukupi. Saldo tersedia: Rp ${parseFloat(saldo).toLocaleString()}` });
        }
        const penarikanQuery = `INSERT INTO penarikan_simpanan (anggota_id, jumlah, tanggal, keterangan) VALUES (?, ?, CURDATE(), ?);`;
        await connection.execute(penarikanQuery, [anggota_id, jumlah, keterangan]);
        const kasQuery = `INSERT INTO transaksi_kas (tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh) VALUES (CURDATE(), 'keluar', 'simpanan', ?, ?, ?);`;
        const kasKeterangan = `Penarikan oleh anggota ID ${anggota_id}. ${keterangan || ''}`;
        await connection.execute(kasQuery, [jumlah, kasKeterangan, bendahara_user_id]);
        await connection.commit();
        res.status(201).json({ message: `Penarikan sejumlah Rp ${parseFloat(jumlah).toLocaleString()} berhasil dicatat.` });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ message: `Anggota dengan ID ${anggota_id} tidak ditemukan.` });
        res.status(500).json({ message: "Server Error" });
    } finally {
        connection.release();
    }
});

router.get('/laporan/keuangan', async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ message: "Rentang tanggal (from & to) diperlukan." });
    }

    try {
        // Query untuk ringkasan total
        const summaryQuery = `
            SELECT
                COALESCE(SUM(IF(jenis_transaksi = 'masuk', jumlah, 0)), 0) AS totalMasuk,
                COALESCE(SUM(IF(jenis_transaksi = 'keluar', jumlah, 0)), 0) AS totalKeluar
            FROM transaksi_kas
            WHERE tanggal BETWEEN ? AND ?;
        `;

        // Query untuk detail transaksi
        const detailQuery = `
            SELECT * FROM transaksi_kas
            WHERE tanggal BETWEEN ? AND ?
            ORDER BY tanggal ASC, transaksi_id ASC;
        `;

        const [
            [[summaryResult]], // Hasil summary adalah satu baris
            [detailResult]   // Hasil detail bisa banyak baris
        ] = await Promise.all([
            db.execute(summaryQuery, [from, to]),
            db.execute(detailQuery, [from, to])
        ]);

        res.json({
            summary: summaryResult,
            detail: detailResult
        });

    } catch (error) {
        console.error("Error fetching financial report:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// Endpoint untuk Daftar Pinjaman Aktif
router.get('/pinjaman/aktif', async (req, res) => {
    try {
        const query = `SELECT p.pinjaman_id, p.jumlah, u.name AS nama_anggota FROM pinjaman p JOIN anggota a ON p.anggota_id = a.anggota_id JOIN users u ON a.user_id = u.user_id WHERE p.status = 'disetujui' ORDER BY u.name ASC;`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Endpoint untuk Angsuran
router.post('/transaksi/angsuran', async (req, res) => {
    const { pinjaman_id, bayar, denda, keterangan, bendahara_user_id } = req.body;
    if (!pinjaman_id || !bayar || !bendahara_user_id) return res.status(400).json({ message: "Data tidak lengkap." });
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const angsuranQuery = `INSERT INTO angsuran_pinjaman (pinjaman_id, tanggal_bayar, jumlah_bayar, denda, keterangan) VALUES (?, CURDATE(), ?, ?, ?);`;
        await connection.execute(angsuranQuery, [pinjaman_id, bayar, denda || 0, keterangan]);
        const kasQuery = `INSERT INTO transaksi_kas (tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh) VALUES (CURDATE(), 'masuk', 'angsuran', ?, ?, ?);`;
        const totalBayar = parseFloat(bayar) + parseFloat(denda || 0);
        const kasKeterangan = `Pembayaran angsuran untuk pinjaman ID ${pinjaman_id}. ${keterangan || ''}`;
        await connection.execute(kasQuery, [totalBayar, kasKeterangan, bendahara_user_id]);
        await connection.commit();
        res.status(201).json({ message: `Pembayaran angsuran sejumlah Rp ${totalBayar.toLocaleString()} berhasil dicatat.` });
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ message: `Pinjaman dengan ID ${pinjaman_id} tidak ditemukan.` });
        res.status(500).json({ message: "Server Error" });
    } finally {
        connection.release();
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

module.exports = router;
