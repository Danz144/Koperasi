import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Komponen untuk format mata uang
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen untuk Badge Status
const StatusBadge = ({ status }) => {
    let className = 'bg-secondary';
    switch (status) {
        case 'diajukan': className = 'bg-warning text-dark'; break;
        case 'disetujui': className = 'bg-success'; break;
        case 'ditolak': className = 'bg-danger'; break;
        case 'lunas': className = 'bg-primary'; break;
        default: break;
    }
    return <span className={`badge ${className}`}>{status}</span>;
};

export default function LaporanPinjamanPage() {
    const [laporan, setLaporan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:4000/api';

    // Fungsi untuk mengambil data laporan dari backend
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // FIX: Menggunakan endpoint yang konsisten dan benar
            const res = await axios.get(`${API_BASE_URL}/laporan/pinjaman`);
            setLaporan(res.data);
        } catch (err) {
            console.error("Gagal memuat laporan pinjaman:", err);
            setError("Gagal memuat data dari server.");
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="container p-4">Memuat laporan...</div>;
    if (error) return <div className="container p-4 alert alert-danger">{error}</div>;

    return (
        <div className="container p-4">
            <h3>Laporan Pinjaman</h3>
            <p>Menampilkan semua riwayat pinjaman dari seluruh anggota.</p>
            <div className="table-responsive">
                <table className="table table-bordered table-striped mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Nama Anggota</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                            <th>Tanggal Pengajuan</th>
                            <th>Tanggal Persetujuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {laporan.length > 0 ? (
                            laporan.map((row) => (
                                <tr key={row.pinjaman_id}>
                                    <td>{row.nama_anggota}</td>
                                    <td>{formatCurrency(row.jumlah)}</td>
                                    <td><StatusBadge status={row.status} /></td>
                                    <td>{new Date(row.tanggal_pengajuan).toLocaleDateString('id-ID')}</td>
                                    <td>
                                        {row.tanggal_persetujuan 
                                            ? new Date(row.tanggal_persetujuan).toLocaleDateString('id-ID') 
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Tidak ada data laporan pinjaman.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
