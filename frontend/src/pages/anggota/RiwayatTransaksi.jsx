import React, { useState, useEffect, useCallback } from 'react';

// Komponen untuk format mata uang
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen untuk badge tipe transaksi
const TypeBadge = ({ type, status }) => {
    let className = status === 'masuk' ? 'bg-success' : 'bg-danger';
    if (type === 'Angsuran') {
        className = 'bg-info text-dark';
    }
    return <span className={`badge ${className}`}>{type}</span>;
};

const RiwayatTransaksi = () => {
    // State untuk menyimpan semua transaksi yang sudah digabung
    const [transactions, setTransactions] = useState([]);
    // State untuk loading dan error

    // ID anggota yang sedang login
    const currentAnggotaId = 1;
    const API_BASE_URL = 'http://localhost:4000/api';

    // Fungsi untuk mengambil dan menggabungkan semua data transaksi
    const fetchAllTransactions = useCallback(async () => {

        try {
            // Ambil semua data yang relevan secara bersamaan
            const [simpananRes, penarikanRes, angsuranRes, pinjamanRes] = await Promise.all([
                fetch(`${API_BASE_URL}/simpanan`).then(res => res.json()),
                fetch(`${API_BASE_URL}/penarikan`).then(res => res.json()),
                fetch(`${API_BASE_URL}/angsuran`).then(res => res.json()),
                fetch(`${API_BASE_URL}/pinjaman`).then(res => res.json())
            ]);

            // Dapatkan ID pinjaman milik anggota saat ini untuk memfilter angsuran
            const myPinjamanIds = pinjamanRes
                .filter(p => p.anggota_id === currentAnggotaId)
                .map(p => p.pinjaman_id);

            // 1. Proses data Simpanan
            const simpananData = simpananRes
                .filter(s => s.anggota_id === currentAnggotaId)
                .map(s => ({
                    id: `simpanan-${s.simpanan_id}`,
                    tanggal: s.tanggal_simpan,
                    tipe: 'Simpanan',
                    status: 'masuk',
                    keterangan: s.keterangan,
                    jumlah: s.jumlah,
                }));

            // 2. Proses data Penarikan
            const penarikanData = penarikanRes
                .filter(p => p.anggota_id === currentAnggotaId)
                .map(p => ({
                    id: `penarikan-${p.penarikan_id}`,
                    tanggal: p.tanggal,
                    tipe: 'Penarikan',
                    status: 'keluar',
                    keterangan: p.keterangan,
                    jumlah: p.jumlah,
                }));

            // 3. Proses data Angsuran
            const angsuranData = angsuranRes
                .filter(a => myPinjamanIds.includes(a.pinjaman_id))
                .map(a => ({
                    id: `angsuran-${a.angsuran_id}`,
                    tanggal: a.tanggal_bayar,
                    tipe: 'Angsuran',
                    status: 'keluar',
                    keterangan: a.keterangan,
                    jumlah: a.jumlah_bayar,
                }));

            // Gabungkan semua data transaksi menjadi satu array
            const allData = [...simpananData, ...penarikanData, ...angsuranData];
            
            // Urutkan semua transaksi berdasarkan tanggal, dari yang terbaru ke terlama
            allData.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
            
            setTransactions(allData);

        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [currentAnggotaId]);

    // Panggil fetchAllTransactions saat komponen dimuat
    useEffect(() => {
        fetchAllTransactions();
    }, [fetchAllTransactions]);


    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Riwayat Semua Transaksi</h1>

            <div className="card shadow-sm">
                <div className="card-header"><h5 className="mb-0">Daftar Transaksi</h5></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Tanggal</th>
                                    <th scope="col">Tipe Transaksi</th>
                                    <th scope="col">Keterangan</th>
                                    <th scope="col" className="text-end">Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>{new Date(tx.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                            <td><TypeBadge type={tx.tipe} status={tx.status} /></td>
                                            <td>{tx.keterangan || '-'}</td>
                                            <td className={`text-end fw-bold ${tx.status === 'masuk' ? 'text-success' : 'text-danger'}`}>
                                                {tx.status === 'masuk' ? '+' : '-'} {formatCurrency(tx.jumlah)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">Belum ada riwayat transaksi.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiwayatTransaksi;
