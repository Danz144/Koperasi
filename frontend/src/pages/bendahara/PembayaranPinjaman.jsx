// --- src/pages/PembayaranPinjaman.jsx ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function PembayaranPinjaman() {
    const [form, setForm] = useState({ pinjamanId: '', bayar: '', denda: '', ket: '' });
    const [pinjamanAktif, setPinjamanAktif] = useState([]); // State untuk daftar pinjaman
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const BENDARAHA_USER_ID = 3;
    const API_BASE_URL = 'http://localhost:4000/api';

    // Mengambil daftar pinjaman aktif saat komponen dimuat
    const fetchActiveLoans = useCallback(async () => {
        setPageLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/pinjaman/aktif`);
            setPinjamanAktif(response.data);
        } catch (err) {
            console.error("Gagal memuat daftar pinjaman aktif:", err);
            setMsg({ type: 'danger', text: 'Gagal memuat daftar pinjaman aktif.' });
        } finally {
            setPageLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchActiveLoans();
    }, [fetchActiveLoans]);

    const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/transaksi/angsuran`, {
                pinjamanId: form.pinjamanId,
                bayar: parseFloat(form.bayar),
                denda: parseFloat(form.denda || 0),
                keterangan: form.ket,
                bendaharaUserId: BENDARAHA_USER_ID
            });
            setMsg({ type: 'success', text: response.data.message });
            setForm({ pinjamanId: '', bayar: '', denda: '', ket: '' });
            fetchActiveLoans(); // Muat ulang daftar pinjaman jika ada yang lunas
        } catch (err) {
            const errorText = err.response?.data?.message || "Gagal mencatat pembayaran.";
            setMsg({ type: 'danger', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="container p-4">Memuat data...</div>;

    return (
        <div className="container">
            <div className="d-flex align-items-center mb-4">
                <FaCreditCard size={32} className="text-primary me-3" />
                <h2>Pembayaran Pinjaman</h2>
            </div>

            {msg && (
                <div className={`alert alert-${msg.type} d-flex align-items-center`} role="alert">
                    {msg.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaTimesCircle className="me-2" />}
                    {msg.text}
                    <button type="button" className="btn-close ms-auto" onClick={() => setMsg(null)} aria-label="Close"></button>
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={onSubmit} className="row g-3">
                        <div className="col-md-12">
                            <label htmlFor="pinjamanId" className="form-label">Pinjaman Aktif</label>
                            {/* FIX: Mengganti input dengan dropdown */}
                            <select
                                id="pinjamanId"
                                name="pinjamanId"
                                value={form.pinjamanId}
                                onChange={onChange}
                                className="form-select"
                                required
                            >
                                <option value="">-- Pilih Pinjaman Anggota --</option>
                                {pinjamanAktif.map(p => (
                                    <option key={p.pinjaman_id} value={p.pinjaman_id}>
                                        {p.nama_anggota} - Pinjaman Rp {p.jumlah.toLocaleString()} (ID: {p.pinjaman_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="bayar" className="form-label">Jumlah Bayar (Rp)</label>
                            <input type="number" id="bayar" name="bayar" value={form.bayar} onChange={onChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="denda" className="form-label">Denda (Rp) (Opsional)</label>
                            <input type="number" id="denda" name="denda" value={form.denda} onChange={onChange} className="form-control" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="ket" className="form-label">Keterangan (Opsional)</label>
                            <input type="text" id="ket" name="ket" value={form.ket} onChange={onChange} className="form-control" />
                        </div>
                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Memproses...' : 'Bayar Angsuran'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}