// --- pages/PersetujuanPinjamanPage.jsx ---
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const PersetujuanStatusBadge = ({ status }) => (
    <span className="badge bg-warning text-dark">Menunggu</span>
);

export default function PersetujuanPinjamanPage() {
    const [daftarPersetujuan, setDaftarPersetujuan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:4000/api';
    const KETUA_USER_ID = 2; // Ganti dengan ID user ketua yang sedang login

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/persetujuan/daftar`);
            setDaftarPersetujuan(response.data);
        } catch (err) {
            console.error("Gagal memuat data persetujuan:", err);
            setError("Gagal memuat data dari server.");
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (pinjamanId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/persetujuan/${pinjamanId}`, {
                status: newStatus,
                user_id: KETUA_USER_ID,
                catatan: `Status diubah menjadi ${newStatus} oleh Ketua.`
            });
            fetchData(); // Muat ulang data untuk menghapus item dari daftar
        } catch (err) {
            alert(`Gagal memperbarui status: ${err.response?.data?.message || 'Error tidak diketahui'}`);
        }
    };

    if (loading) return <div className="container p-4">Memuat daftar persetujuan...</div>;
    if (error) return <div className="container p-4 alert alert-danger">{error}</div>;

    return (
        <div className="container p-4">
            <h3>Persetujuan Pinjaman</h3>
            <p>Daftar pengajuan pinjaman dari anggota yang menunggu keputusan Anda.</p>
            <div className="table-responsive">
                <table className="table table-bordered table-hover mt-3">
                    <thead className="table-light">
                        <tr>
                            <th>Nama Anggota</th>
                            <th>Jumlah Pinjaman</th>
                            <th>Tenor</th>
                            <th>Tanggal Pengajuan</th>
                            <th>Status</th>
                            <th style={{ width: "200px" }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarPersetujuan.length > 0 ? (
                            daftarPersetujuan.map((item) => (
                                <tr key={item.pinjaman_id}>
                                    <td>{item.nama_anggota}</td>
                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.jumlah)}</td>
                                    <td>{item.tenor} bulan</td>
                                    <td>{new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID')}</td>
                                    <td><PersetujuanStatusBadge status={item.status} /></td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success btn-sm flex-grow-1" onClick={() => handleUpdateStatus(item.pinjaman_id, "disetujui")}>Setujui</button>
                                            <button className="btn btn-danger btn-sm flex-grow-1" onClick={() => handleUpdateStatus(item.pinjaman_id, "ditolak")}>Tolak</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="text-center">Tidak ada pengajuan pinjaman baru yang perlu disetujui.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
