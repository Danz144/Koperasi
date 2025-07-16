import React, { useState, useEffect, useCallback } from 'react';

// Komponen untuk format mata uang
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

// Komponen untuk badge status pinjaman
const StatusBadge = ({ status }) => {
    let className = 'bg-secondary';
    let text = status;

    switch (status) {
        case 'diajukan':
            className = 'bg-warning text-dark';
            text = 'Menunggu Persetujuan';
            break;
        case 'disetujui':
            className = 'bg-success';
            text = 'Disetujui';
            break;
        case 'ditolak':
            className = 'bg-danger';
            text = 'Ditolak';
            break;
        case 'lunas':
            className = 'bg-primary';
            text = 'Lunas';
            break;
        default:
            break;
    }
    return <span className={`badge ${className}`}>{text}</span>;
};


const AjukanPinjaman = () => {
    // State untuk riwayat pinjaman
    const [pinjaman, setPinjaman] = useState([]);
    // State untuk form
    const [formData, setFormData] = useState({ jumlah: '', tenor: '' });
    // State untuk mengecek apakah ada pinjaman aktif
    const [hasActiveLoan, setHasActiveLoan] = useState(false);
    // State untuk loading, error, dan pesan submit
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // ID anggota yang sedang login
    const currentAnggotaId = 1;
    const API_BASE_URL = 'http://localhost:4000/api';
    const BUNGA_DEFAULT = 1.5; // Bunga pinjaman default 1.5%

    // Fungsi untuk mengambil data riwayat pinjaman
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/pinjaman`);
            if (!response.ok) throw new Error('Gagal memuat data pinjaman.');
            
            const data = await response.json();
            const userLoans = data.filter(p => p.anggota_id === currentAnggotaId);

            // Cek apakah ada pinjaman dengan status 'diajukan' atau 'disetujui'
            const activeLoanExists = userLoans.some(p => p.status === 'diajukan' || p.status === 'disetujui');
            setHasActiveLoan(activeLoanExists);

            // Urutkan pinjaman dari yang terbaru
            setPinjaman(userLoans.sort((a, b) => new Date(b.tanggal_pengajuan) - new Date(a.tanggal_pengajuan)));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentAnggotaId]);

    // Panggil fetchData saat komponen dimuat
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handler untuk perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler untuk submit form pengajuan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage({ type: '', text: '' });

        if (hasActiveLoan) {
            setSubmitMessage({ type: 'warning', text: 'Anda tidak dapat mengajukan pinjaman baru karena masih ada pinjaman yang aktif.' });
            return;
        }

        const jumlahPinjaman = parseFloat(formData.jumlah);
        const tenorPinjaman = parseInt(formData.tenor, 10);

        if (!jumlahPinjaman || jumlahPinjaman <= 0 || !tenorPinjaman || tenorPinjaman <= 0) {
            setSubmitMessage({ type: 'danger', text: 'Jumlah dan Tenor harus diisi dengan benar.' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pinjaman`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anggota_id: currentAnggotaId,
                    jumlah: jumlahPinjaman,
                    tenor: tenorPinjaman,
                    bunga_persen: BUNGA_DEFAULT,
                    tanggal_pengajuan: new Date().toISOString().split('T')[0],
                }),
            });

            if (!response.ok) throw new Error('Gagal mengajukan pinjaman.');

            setSubmitMessage({ type: 'success', text: 'Pengajuan pinjaman berhasil dikirim dan sedang menunggu persetujuan.' });
            setFormData({ jumlah: '', tenor: '' }); // Reset form
            fetchData(); // Muat ulang data untuk update status dan riwayat
        } catch (err) {
            setSubmitMessage({ type: 'danger', text: err.message });
        }
    };

    if (loading) return <div className="text-center p-5">Memuat data...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Pengajuan Pinjaman</h1>

            {/* Form Pengajuan */}
            <div className="card shadow-sm mb-4">
                <div className="card-header"><h5 className="mb-0">Form Pengajuan Pinjaman Baru</h5></div>
                <div className="card-body">
                    {hasActiveLoan ? (
                        <div className="alert alert-warning">
                            Anda memiliki pinjaman yang masih aktif (status "Menunggu Persetujuan" atau "Disetujui"). Anda baru bisa mengajukan lagi setelah pinjaman tersebut lunas.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {submitMessage.text && (
                                <div className={`alert alert-${submitMessage.type}`}>{submitMessage.text}</div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="jumlah" className="form-label">Jumlah Pinjaman (Rp)</label>
                                <input type="number" name="jumlah" id="jumlah" value={formData.jumlah} onChange={handleChange} className="form-control" placeholder="Contoh: 1000000" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tenor" className="form-label">Tenor (Bulan)</label>
                                <input type="number" name="tenor" id="tenor" value={formData.tenor} onChange={handleChange} className="form-control" placeholder="Contoh: 12" required />
                                <div className="form-text">Jangka waktu pengembalian pinjaman dalam bulan.</div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-paper-plane me-2"></i>Ajukan Sekarang
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Tabel Riwayat Pinjaman */}
            <div className="card shadow-sm">
                <div className="card-header"><h5 className="mb-0">Riwayat Pinjaman Anda</h5></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Tgl Pengajuan</th>
                                    <th scope="col">Jumlah</th>
                                    <th scope="col">Tenor</th>
                                    <th scope="col">Bunga</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pinjaman.length > 0 ? (
                                    pinjaman.map(p => (
                                        <tr key={p.pinjaman_id}>
                                            <td>{new Date(p.tanggal_pengajuan).toLocaleDateString('id-ID')}</td>
                                            <td>{formatCurrency(p.jumlah)}</td>
                                            <td>{p.tenor} bulan</td>
                                            <td>{p.bunga_persen}%</td>
                                            <td><StatusBadge status={p.status} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Belum ada riwayat pengajuan pinjaman.</td>
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

export default AjukanPinjaman;
