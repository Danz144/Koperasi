// --- src/pages/Penarikan.jsx ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaCheck, FaTimes, FaSearchDollar } from 'react-icons/fa';

export default function Penarikan() {
    const [form, setForm] = useState({ anggotaId: '', jumlah: '', tanggal: '', ket: '' });
    const [anggotaList, setAnggotaList] = useState([]);
    const [saldo, setSaldo] = useState({ value: null, loading: false });
    const [msg, setMsg] = useState(null);
    const [busy, setBusy] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const BENDARAHA_USER_ID = 3;
    const API_BASE_URL = 'http://localhost:4000/api';

    const fetchAnggota = useCallback(async () => {
        setPageLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/anggota`);
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

    const onChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        // Reset info saldo jika anggota berubah
        if (name === 'anggotaId') {
            setSaldo({ value: null, loading: false });
        }
    };

    const checkSaldo = async () => {
        if (!form.anggotaId) {
            setMsg({ type: 'warning', text: 'Pilih Anggota terlebih dahulu.' });
            return;
        }
        setSaldo({ value: null, loading: true });
        setMsg(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/transaksi/saldo/${form.anggotaId}`);
            setSaldo({ value: response.data.saldo, loading: false });
        } catch (err) {
            setSaldo({ value: null, loading: false });
            setMsg({ type: 'danger', text: err.response?.data?.message || "Gagal memeriksa saldo." });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/transaksi/penarikan`, {
                anggota_id: form.anggotaId,
                jumlah: parseFloat(form.jumlah),
                tanggal: form.tanggal,
                keterangan: form.ket,
                bendahara_user_id: BENDARAHA_USER_ID
            });
            setMsg({ type: 'success', text: response.data.message });
            setForm({ anggota_id: '', jumlah: '', tanggal: '', ket: '' });
            setSaldo({ value: null, loading: false });
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.message || "Gagal memproses penarikan." });
        } finally {
            setBusy(false);
        }
    };

    if (pageLoading) return <div className="container p-4">Memuat data...</div>;

    return (
        <div className="container p-4">
            <div className="d-flex align-items-center mb-4">
                <FaMoneyBillWave size={32} className="text-warning me-3" />
                <h2>Penarikan</h2>
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
                        <div className="col-md-12">
                            <label htmlFor="anggotaId" className="form-label">Anggota</label>
                            <div className="input-group">
                                <select id="anggotaId" name="anggotaId" value={form.anggotaId} onChange={onChange} className="form-select" required>
                                    <option value="">-- Pilih Anggota --</option>
                                    {anggotaList.map(anggota => (
                                        <option key={anggota.anggota_id} value={anggota.anggota_id}>
                                            {anggota.name} (ID: {anggota.anggota_id})
                                        </option>
                                    ))}
                                </select>
                                <button className="btn btn-outline-secondary" type="button" onClick={checkSaldo} disabled={saldo.loading || !form.anggotaId}>
                                    {saldo.loading ? '...' : <><FaSearchDollar /> Cek Saldo</>}
                                </button>
                            </div>
                            {saldo.value !== null && (
                                <div className="form-text text-success fw-bold mt-1">Saldo Tersedia: Rp {parseFloat(saldo.value).toLocaleString()}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="jumlah" className="form-label">Jumlah Penarikan (Rp)</label>
                            <input type="number" id="jumlah" name="jumlah" value={form.jumlah} onChange={onChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="tanggal" className="form-label">Tanggal Penarikan (Tahun-Bulan-Tanggal)</label>
                            <input type="date" id="tanggal" name="tanggal" value={form.tanggal} onChange={onChange} className="form-control" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="ket" className="form-label">Keterangan</label>
                            <input type="text" id="ket" name="ket" value={form.ket} onChange={onChange} className="form-control" />
                        </div>
                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-warning" disabled={busy}>
                                {busy ? 'Memproses...' : 'Proses Penarikan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}