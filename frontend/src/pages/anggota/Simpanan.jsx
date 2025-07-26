// --- src/pages/SimpananPage.jsx ---
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditSimpananModal from '../../modal/anggota/EditSimpanModal';

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const SimpananPage = () => {
    const [simpanan, setSimpanan] = useState([]);
    const [anggotaList, setAnggotaList] = useState([]); // State baru untuk daftar anggota
    const [formData, setFormData] = useState({ anggota_id: '', jenis_simpanan: 'sukarela', jumlah: '', keterangan: '' });
    
    const [showModal, setShowModal] = useState(false);
    const [editingData, setEditingData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const API_BASE_URL = 'http://localhost:4000/api';

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Ambil data simpanan dan daftar anggota secara bersamaan
            const [simpananRes, anggotaRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/simpanan`),
                axios.get(`${API_BASE_URL}/anggota`)
            ]);
            setSimpanan(simpananRes.data);
            setAnggotaList(anggotaRes.data);
        } catch (err) {
            console.error(err);
            setError('Gagal mengambil data dari server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage({ type: '', text: '' });
        try {
            await axios.post(`${API_BASE_URL}/simpanan`, {
                anggota_id: formData.anggota_id,
                jenis_simpanan: formData.jenis_simpanan,
                jumlah: parseFloat(formData.jumlah),
                tanggal_simpan: new Date().toISOString().split('T')[0],
                keterangan: formData.keterangan,
            });
            setSubmitMessage({ type: 'success', text: 'Simpanan baru berhasil ditambahkan!' });
            setFormData({ anggota_id: '', jenis_simpanan: 'sukarela', jumlah: '', keterangan: '' });
            fetchData();
        } catch (err) {
            setSubmitMessage({ type: 'danger', text: err.response?.data?.message || 'Gagal menyimpan data.' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data simpanan ini? Aksi ini akan menghapus catatan kas terkait dan tidak dapat dibatalkan.')) {
            try {
                await axios.delete(`${API_BASE_URL}/simpanan/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const openEditModal = (data) => {
        setEditingData(data);
        setShowModal(true);
    };

    const handleUpdateSuccess = () => {
        setShowModal(false);
        fetchData();
    };

    if (loading) return <div className="text-center p-5">Memuat data simpanan...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">Manajemen Simpanan</h1>
            
            <div className="card shadow-sm mb-4">
                <div className="card-header"><h5 className="mb-0">Form Tambah Simpanan Baru</h5></div>
                <div className="card-body">
                    <form onSubmit={handleAddSubmit}>
                        {submitMessage.text && <div className={`alert alert-${submitMessage.type}`}>{submitMessage.text}</div>}
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Anggota</label>
                                {/* FIX: Mengganti input dengan dropdown */}
                                <select name="anggota_id" value={formData.anggota_id} onChange={handleChange} className="form-select" required>
                                    <option value="">-- Pilih Anggota --</option>
                                    {anggotaList.map(anggota => (
                                        <option key={anggota.anggota_id} value={anggota.anggota_id}>
                                            {anggota.name} (ID: {anggota.anggota_id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3"><label className="form-label">Jenis Simpanan</label><select name="jenis_simpanan" value={formData.jenis_simpanan} onChange={handleChange} className="form-select"><option value="sukarela">Sukarela</option><option value="wajib">Wajib</option></select></div>
                            <div className="col-md-3 mb-3"><label className="form-label">Jumlah (Rp)</label><input type="number" name="jumlah" value={formData.jumlah} onChange={handleChange} className="form-control" required /></div>
                            <div className="col-md-3 mb-3"><label className="form-label">Keterangan</label><input type="text" name="keterangan" value={formData.keterangan} onChange={handleChange} className="form-control" /></div>
                        </div>
                        <button type="submit" className="btn btn-primary">Simpan</button>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header"><h5 className="mb-0">Daftar Simpanan</h5></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Tanggal</th><th>Nama Anggota</th><th>Jenis</th><th>Jumlah</th><th>Keterangan</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {simpanan.map(s => (
                                    <tr key={s.simpanan_id}>
                                        <td>{new Date(s.tanggal_simpan).toLocaleDateString('id-ID')}</td>
                                        <td>{s.nama_anggota}</td>
                                        <td><span className={`badge bg-${s.jenis_simpanan === 'wajib' ? 'info' : 'success'}`}>{s.jenis_simpanan}</span></td>
                                        <td className="text-success fw-bold">{formatCurrency(s.jumlah)}</td>
                                        <td>{s.keterangan}</td>
                                        <td>
                                            <Button variant="warning" size="sm" onClick={() => openEditModal(s)} className="me-2"><FaEdit /></Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(s.simpanan_id)}><FaTrash /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {editingData && (
                <EditSimpananModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    data={editingData}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default SimpananPage;