// --- routes/bendaharaDashboardRoute.js ---
const express = require('express');
const router = express.Router();
const db = require('../../db'); // <-- PENTING: Pastikan path ini benar!

router.get('/bendahara/dashboard', async (req, res) => {
    try {
        const summaryQuery = `
            SELECT
                COALESCE(SUM(IF(jenis_transaksi = 'masuk' AND sumber = 'simpanan' AND MONTH(tanggal) = MONTH(CURDATE()), jumlah, 0)), 0) AS simpananBulanIni,
                COALESCE(SUM(IF(jenis_transaksi = 'keluar' AND sumber = 'simpanan', jumlah, 0)), 0) AS totalPenarikan,
                COALESCE(SUM(IF(jenis_transaksi = 'masuk' AND sumber = 'angsuran', jumlah, 0)), 0) AS totalAngsuran,
                COALESCE(SUM(IF(jenis_transaksi = 'masuk', jumlah, -jumlah)), 0) AS saldoKas
            FROM transaksi_kas;
        `;

        const lineChartQuery = `
            SELECT
                ANY_VALUE(DATE_FORMAT(tanggal, '%b')) AS month,
                SUM(IF(jenis_transaksi = 'masuk', jumlah, 0)) AS kasMasuk,
                SUM(IF(jenis_transaksi = 'keluar', jumlah, 0)) AS kasKeluar
            FROM transaksi_kas
            WHERE tanggal IS NOT NULL AND tanggal >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
            ORDER BY DATE_FORMAT(tanggal, '%Y-%m');
        `;

        const pieChartQuery = `
            SELECT 
                sumber, 
                SUM(jumlah) as value 
            FROM transaksi_kas 
            WHERE tanggal IS NOT NULL AND jenis_transaksi = 'masuk' AND MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())
            GROUP BY sumber;
        `;

        const transactionsQuery = `
            SELECT * FROM transaksi_kas ORDER BY tanggal DESC, transaksi_id DESC LIMIT 5;
        `;

        // Eksekusi semua query secara bersamaan
        const [
            summaryPromise,
            lineChartPromise,
            pieChartPromise,
            transactionsPromise
        ] = await Promise.all([
            db.execute(summaryQuery),
            db.execute(lineChartQuery),
            db.execute(pieChartQuery),
            db.execute(transactionsQuery)
        ]);

        // Mengambil array 'rows' dari setiap hasil promise
        const summaryResult = summaryPromise[0][0];
        const lineChartData = lineChartPromise[0];
        const pieChartData = pieChartPromise[0];
        const recentTransactions = transactionsPromise[0];

        const formattedPieData = pieChartData.map(item => ({ name: item.sumber, value: parseFloat(item.value) }));

        res.json({
            summary: summaryResult,
            lineData: lineChartData,
            pieData: formattedPieData,
            transactions: recentTransactions
        });

    } catch (error) {
        // Ini akan mengirimkan pesan error yang lebih detail ke konsol backend
        console.error("==============================================");
        console.error("ERROR DI /api/bendahara/dashboard:", error);
        console.error("==============================================");
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
});

router.post('/transaksi/angsuran', async (req, res) => {
    const { pinjamanId, bayar, denda, keterangan, bendaharaUserId } = req.body;

    if (!pinjamanId || !bayar || !bendaharaUserId) {
        return res.status(400).json({ message: "Data tidak lengkap. ID Pinjaman, jumlah bayar, dan ID Bendahara diperlukan." });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert ke tabel 'angsuran_pinjaman'
        const angsuranQuery = `
            INSERT INTO angsuran_pinjaman (pinjaman_id, tanggal_bayar, jumlah_bayar, denda, keterangan)
            VALUES (?, CURDATE(), ?, ?, ?);
        `;
        await connection.execute(angsuranQuery, [pinjamanId, bayar, denda || 0, keterangan]);

        // 2. Insert ke tabel 'transaksi_kas'
        const kasQuery = `
            INSERT INTO transaksi_kas (tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh)
            VALUES (CURDATE(), 'masuk', 'angsuran', ?, ?, ?);
        `;
        const totalBayar = parseFloat(bayar) + parseFloat(denda || 0);
        const kasKeterangan = `Pembayaran angsuran untuk pinjaman ID ${pinjamanId}. ${keterangan || ''}`;
        await connection.execute(kasQuery, [totalBayar, kasKeterangan, bendaharaUserId]);

        await connection.commit();
        res.status(201).json({ message: `Pembayaran angsuran sejumlah Rp ${totalBayar.toLocaleString()} berhasil dicatat.` });

    } catch (error) {
        await connection.rollback();
        console.error("Error saat mencatat angsuran:", error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ message: `Pinjaman dengan ID ${pinjamanId} tidak ditemukan.` });
        }
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    } finally {
        connection.release();
    }
});

router.post('/transaksi/kas', async (req, res) => {
    const { jenis, sumber, jumlah, keterangan, bendaharaUserId } = req.body;

    if (!jenis || !sumber || !jumlah || !bendaharaUserId) {
        return res.status(400).json({ message: "Data tidak lengkap. Jenis, sumber, jumlah, dan ID Bendahara diperlukan." });
    }

    try {
        const kasQuery = `
            INSERT INTO transaksi_kas (tanggal, jenis_transaksi, sumber, jumlah, keterangan, dibuat_oleh)
            VALUES (CURDATE(), ?, ?, ?, ?, ?);
        `;
        await db.execute(kasQuery, [jenis, sumber, jumlah, keterangan, bendaharaUserId]);
        
        res.status(201).json({ message: `Transaksi kas berhasil dicatat.` });

    } catch (error) {
        console.error("Error saat mencatat transaksi kas:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});

module.exports = router;