// --- src/pages/SimpananAnggota.jsx ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaPiggyBank, FaCheck, FaTimes } from 'react-icons/fa';

export default function SimpananAnggota() {
    // FIX: Menggunakan snake_case untuk nama state agar konsisten
    const [form, setForm] = useState({ anggota_id: '', jenis: 'sukarela', jumlah: '', ket: '' });
    const [anggotaList, setAnggotaList] = useState([]);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const BENDARAHA_USER_ID = 3;
    const API_BASE_URL = 'http://localhost:4000/api';

    const fetchAnggota = useCallback(async () => {
        setPageLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/anggota/list`);
            setAnggotaList(response.data);
        } catch (err) {
            console.error("Gagal memuat daftar anggota:", err);
            setMsg({ type: 'danger', text: 'Gagal memuat daftar anggota.' });
        } finally {
            setPageLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchAnggota();
    }, [fetchAnggota]);

    const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            // FIX: Mengirim payload dengan kunci snake_case
            const response = await axios.post(`${API_BASE_URL}/transaksi/simpanan`, {
                anggota_id: form.anggota_id,
                jenis: form.jenis,
                jumlah: parseFloat(form.jumlah),
                keterangan: form.ket,
                bendahara_user_id: BENDARAHA_USER_ID
            });
            setMsg({ type: 'success', text: response.data.message });
            setForm({ anggota_id: '', jenis: 'sukarela', jumlah: '', ket: '' });
        } catch (err) {
            const errorText = err.response?.data?.message || "Gagal mencatat simpanan.";
            setMsg({ type: 'danger', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="container p-4">Memuat data...</div>;

    return (
        <div className="container p-4">
            <div className="d-flex align-items-center mb-4">
                <FaPiggyBank size={32} className="text-success me-3" />
                <h2>Simpanan Anggota</h2>
            </div>
            {msg && (
                <div className={`alert alert-${msg.type} d-flex align-items-center`} role="alert">
                    {msg.type === 'success' ? <FaCheck className="me-2" /> : <FaTimes className="me-2" />}
                    {msg.text}
                    <button type="button" className="btn-close ms-auto" onClick={() => setMsg(null)} aria-label="Close"></button>
                </div>
            )}
            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={onSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="anggota_id" className="form-label">Anggota</label>
                            {/* FIX: Menggunakan snake_case untuk 'name' */}
                            <select
                                id="anggota_id"
                                name="anggota_id"
                                value={form.anggota_id}
                                onChange={onChange}
                                className="form-select"
                                required
                            >
                                <option value="">-- Pilih Anggota --</option>
                                {anggotaList.map(anggota => (
                                    <option key={anggota.anggota_id} value={anggota.anggota_id}>
                                        {anggota.name} (ID: {anggota.anggota_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="jenis" className="form-label">Jenis Simpanan</label>
                            <select id="jenis" name="jenis" value={form.jenis} onChange={onChange} className="form-select" required>
                                <option value="sukarela">Sukarela</option>
                                <option value="wajib">Wajib</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="jumlah" className="form-label">Jumlah (Rp)</label>
                            <input type="number" id="jumlah" name="jumlah" value={form.jumlah} onChange={onChange} className="form-control" placeholder="Contoh: 50000" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="ket" className="form-label">Keterangan (Opsional)</label>
                            <input type="text" id="ket" name="ket" value={form.ket} onChange={onChange} className="form-control" />
                        </div>
                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? 'Mencatat...' : 'Catat Simpanan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}