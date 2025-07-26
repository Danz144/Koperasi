// --- src/pages/LaporanKeuangan.jsx ---
import React, { useState } from 'react';
import axios from 'axios';
import { FaRegCalendarAlt, FaSpinner } from 'react-icons/fa';

const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

export default function LaporanKeuangan() {
    const [range, setRange] = useState({ from: '', to: '' });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:4000/api';

    const onChange = e => setRange(r => ({ ...r, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setReportData(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/laporan/keuangan`, {
                params: { from: range.from, to: range.to }
            });
            setReportData(response.data);
        } catch (err) {
            const errorText = err.response?.data?.message || "Gagal mengambil data laporan.";
            setError(errorText);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container pt-4">
            <div className="d-flex align-items-center mb-4">
                <FaRegCalendarAlt size={32} className="text-info me-3" />
                <h2>Laporan Keuangan</h2>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={onSubmit} className="row g-3 mb-4 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label">Dari Tanggal</label>
                            <input type="date" name="from" value={range.from} onChange={onChange} className="form-control" required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Hingga Tanggal</label>
                            <input type="date" name="to" value={range.to} onChange={onChange} className="form-control" required />
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-info w-100" disabled={loading}>
                                {loading ? <><FaSpinner className="spin" /> Memuat...</> : 'Tampilkan Laporan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && <div className="alert alert-danger mt-4">{error}</div>}

            {reportData && (
                <div className="mt-4">
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card text-white bg-success">
                                <div className="card-body text-center">
                                    <div>Total Pemasukan</div>
                                    <div className="fs-4 fw-bold">{formatCurrency(reportData.summary.totalMasuk)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-white bg-danger">
                                <div className="card-body text-center">
                                    <div>Total Pengeluaran</div>
                                    <div className="fs-4 fw-bold">{formatCurrency(reportData.summary.totalKeluar)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card text-white bg-dark">
                                <div className="card-body text-center">
                                    <div>Selisih</div>
                                    <div className="fs-4 fw-bold">{formatCurrency(reportData.summary.totalMasuk - reportData.summary.totalKeluar)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-header">Detail Transaksi</div>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Jenis</th>
                                        <th>Sumber</th>
                                        <th>Keterangan</th>
                                        <th className="text-end">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.detail.length > 0 ? reportData.detail.map((tx) => (
                                        <tr key={tx.transaksi_id}>
                                            <td>{new Date(tx.tanggal).toLocaleDateString('id-ID')}</td>
                                            <td>
                                                <span className={`badge bg-${tx.jenis_transaksi === 'masuk' ? 'success' : 'danger'}`}>
                                                    {tx.jenis_transaksi}
                                                </span>
                                            </td>
                                            <td>{tx.sumber}</td>
                                            <td>{tx.keterangan}</td>
                                            <td className={`text-end fw-bold ${tx.jenis_transaksi === 'masuk' ? 'text-success' : 'text-danger'}`}>
                                                {formatCurrency(tx.jumlah)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="text-center">Tidak ada transaksi pada rentang tanggal ini.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}