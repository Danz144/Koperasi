// --- src/pages/TransaksiKas.jsx ---
import React, { useState } from 'react';
import axios from 'axios';
import { FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function TransaksiKas() {
    const [form, setForm] = useState({ jenis: 'masuk', sumber: 'operasional', jumlah: '', ket: '' });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const BENDARAHA_USER_ID = 3;
    const API_BASE_URL = 'http://localhost:4000/api';

    const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/transaksi/kas`, {
                jenis: form.jenis,
                sumber: form.sumber,
                jumlah: parseFloat(form.jumlah),
                keterangan: form.ket,
                bendaharaUserId: BENDARAHA_USER_ID
            });

            setMsg({ type: 'success', text: response.data.message });
            setForm({ jenis: 'masuk', sumber: 'operasional', jumlah: '', ket: '' }); // Reset form

        } catch (err) {
            const errorText = err.response?.data?.message || "Gagal mencatat transaksi.";
            setMsg({ type: 'danger', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="d-flex align-items-center mb-4">
                <FaDollarSign size={32} className="text-dark me-3" />
                <h2>Transaksi Kas Umum</h2>
            </div>
            <p className="text-muted">Gunakan halaman ini untuk mencatat pemasukan atau pengeluaran kas umum di luar simpanan, penarikan, dan angsuran. Contoh: biaya operasional, pendapatan lain-lain.</p>

            {msg && (
                <div className={`alert alert-${msg.type} d-flex align-items-center`} role="alert">
                    {msg.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaTimesCircle className="me-2" />}
                    {msg.text}
                    <button type="button" className="btn-close ms-auto" onClick={() => setMsg(null)} aria-label="Close"></button>
                </div>
            )}
            
            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <form onSubmit={onSubmit} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Jenis Transaksi</label>
                            <select name="jenis" value={form.jenis} onChange={onChange} className="form-select">
                                <option value="masuk">Masuk</option>
                                <option value="keluar">Keluar</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Sumber</label>
                            {/* Sumber disesuaikan dengan enum di DB */}
                            <select name="sumber" value={form.sumber} onChange={onChange} className="form-select">
                                <option value="operasional">Operasional</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Jumlah (Rp)</label>
                            <input type="number" name="jumlah" value={form.jumlah} onChange={onChange} className="form-control" required />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Keterangan</label>
                            <input name="ket" value={form.ket} onChange={onChange} className="form-control" placeholder="Contoh: Pembelian ATK, Pendapatan sewa, dll." required />
                        </div>
                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-dark" disabled={loading}>
                                {loading ? 'Memproses...' : 'Tambah Transaksi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
