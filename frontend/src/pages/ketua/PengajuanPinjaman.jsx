// --- pages/PengajuanPinjamanPage.jsx ---
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const StatusBadge = ({ status }) => {
    const styles = {
        diajukan: { bg: 'bg-warning', text: 'Menunggu' },
        disetujui: { bg: 'bg-success', text: 'Disetujui' },
        ditolak: { bg: 'bg-danger', text: 'Ditolak' },
        lunas: { bg: 'bg-primary', text: 'Lunas' },
    };
    const style = styles[status] || { bg: 'bg-secondary', text: status };
    return <span className={`badge ${style.bg}`}>{style.text}</span>;
};

export default function PengajuanPinjamanPage() {
    const [daftarSemuaPinjaman, setDaftarSemuaPinjaman] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:4000/api';

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/pengajuan/semua`);
            setDaftarSemuaPinjaman(response.data);
        } catch (err) {
            console.error("Gagal memuat data pengajuan:", err);
            setError("Gagal memuat data dari server.");
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="container p-4">Memuat riwayat...</div>;
    if (error) return <div className="container p-4 alert alert-danger">{error}</div>;

    return (
        <div className="container p-4">
            <h3>Riwayat Pengajuan Pinjaman</h3>
            <p>Menampilkan seluruh riwayat pengajuan pinjaman dari semua anggota.</p>
            <div className="table-responsive">
                <table className="table table-bordered table-striped mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Nama Anggota</th>
                            <th>Jumlah</th>
                            <th>Tenor</th>
                            <th>Tanggal Pengajuan</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarSemuaPinjaman.length > 0 ? (
                            daftarSemuaPinjaman.map((item) => (
                                <tr key={item.pinjaman_id}>
                                    <td>{item.nama_anggota}</td>
                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.jumlah)}</td>
                                    <td>{item.tenor} bulan</td>
                                    <td>{new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID')}</td>
                                    <td><StatusBadge status={item.status} /></td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center">Tidak ada riwayat pengajuan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}