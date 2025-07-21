import React, { useState, useEffect, useCallback } from 'react';

// Komponen untuk format mata uang
const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const Penarikan = () => {
    // State untuk riwayat penarikan
    const [penarikan, setPenarikan] = useState([]);
    // State untuk saldo yang tersedia untuk ditarik
    const [saldoTersedia, setSaldoTersedia] = useState(0);
    // State untuk form
    const [formData, setFormData] = useState({ jumlah: '', keterangan: '' });
    // State untuk loading, error, dan pesan submit
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    // ID anggota yang sedang login
    const currentAnggotaId = 1;
    const API_BASE_URL = 'http://localhost:4000/api';

    // Fungsi untuk mengambil semua data yang diperlukan
    const fetchData = useCallback(async () => {
        try {
            // Ambil data simpanan dan penarikan secara bersamaan
            const [simpananRes, penarikanRes] = await Promise.all([
                fetch(`${API_BASE_URL}/simpanan`).then(res => res.json()),
                fetch(`${API_BASE_URL}/penarikan`).then(res => res.json())
            ]);

            // Filter data untuk anggota yang sedang login
            const mySimpanan = simpananRes.filter(s => s.anggota_id === currentAnggotaId);
            const myPenarikan = penarikanRes.filter(p => p.anggota_id === currentAnggotaId);

            // Hitung total simpanan dan total penarikan
            const totalSetoran = mySimpanan.reduce((sum, s) => sum + parseFloat(s.jumlah), 0);
            const totalDitarik = myPenarikan.reduce((sum, p) => sum + parseFloat(p.jumlah), 0);
            
            // Hitung dan set saldo yang tersedia
            setSaldoTersedia(totalSetoran - totalDitarik);

            // Set riwayat penarikan dan urutkan dari yang terbaru
            setPenarikan(myPenarikan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)));

        } catch (error) {
            console.error('Error fetching data:', error);
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

    // Handler untuk submit form penarikan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage({ type: '', text: '' });

        const jumlahPenarikan = parseFloat(formData.jumlah);

        // Validasi input
        if (!jumlahPenarikan || jumlahPenarikan <= 0) {
            setSubmitMessage({ type: 'danger', text: 'Jumlah penarikan harus diisi dan lebih dari 0.' });
            return;
        }
        if (jumlahPenarikan > saldoTersedia) {
            setSubmitMessage({ type: 'danger', text: 'Jumlah penarikan melebihi saldo yang tersedia.' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/penarikan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anggota_id: currentAnggotaId,
                    jumlah: jumlahPenarikan,
                    tanggal: new Date().toISOString().split('T')[0], // Tanggal hari ini
                    keterangan: formData.keterangan || 'Penarikan tunai',
                }),
            });

            if (!response.ok) {
                // Backend mungkin juga memberikan pesan error spesifik
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal melakukan penarikan.');
            }
            
            setSubmitMessage({ type: 'success', text: 'Penarikan berhasil diajukan!' });
            setFormData({ jumlah: '', keterangan: '' }); // Reset form
            fetchData(); // Muat ulang data untuk update saldo dan riwayat
        } catch (err) {
            setSubmitMessage({ type: 'danger', text: err.message });
        }
    };


    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Halaman Penarikan</h1>
            
            {/* Kartu informasi saldo */}
            <div className="card bg-info text-white shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">Saldo Tersedia untuk Ditarik</h5>
                    <p className="card-text fs-3 fw-bold">{formatCurrency(saldoTersedia)}</p>
                </div>
            </div>

            {/* Form untuk melakukan penarikan */}
            <div className="card shadow-sm mb-4">
                <div className="card-header"><h5 className="mb-0">Form Penarikan Dana</h5></div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {submitMessage.text && (
                            <div className={`alert alert-${submitMessage.type}`}>{submitMessage.text}</div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="jumlah" className="form-label">Jumlah Penarikan (Rp)</label>
                            <input type="number" name="jumlah" id="jumlah" value={formData.jumlah} onChange={handleChange} className="form-control" placeholder="Contoh: 100000" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="keterangan" className="form-label">Keterangan (Opsional)</label>
                            <input type="text" name="keterangan" id="keterangan" value={formData.keterangan} onChange={handleChange} className="form-control" placeholder="Contoh: Untuk biaya sekolah" />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-paper-plane me-2"></i>Ajukan Penarikan
                        </button>
                    </form>
                </div>
            </div>

            {/* Tabel riwayat penarikan */}
            <div className="card shadow-sm">
                <div className="card-header"><h5 className="mb-0">Riwayat Penarikan</h5></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Tanggal</th>
                                    <th scope="col">Jumlah</th>
                                    <th scope="col">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {penarikan.length > 0 ? (
                                    penarikan.map(p => (
                                        <tr key={p.penarikan_id}>
                                            <td>{new Date(p.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                            <td className="text-danger fw-bold">{formatCurrency(p.jumlah)}</td>
                                            <td>{p.keterangan}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">Belum ada riwayat penarikan.</td>
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

export default Penarikan;
