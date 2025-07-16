// --- src/components/bendahara/EditSimpananModal.jsx ---
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const EditSimpananModal = ({ show, onHide, data, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({ jenis_simpanan: '', jumlah: '', keterangan: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = 'http://localhost:4000/api';

    // Update form state ketika data prop berubah (saat modal dibuka)
    useEffect(() => {
        if (data) {
            setFormData({
                jenis_simpanan: data.jenis_simpanan || 'sukarela',
                jumlah: data.jumlah || '',
                keterangan: data.keterangan || '',
            });
        }
    }, [data]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            await axios.put(`${API_BASE_URL}/simpanan/${data.simpanan_id}`, {
                jumlah: parseFloat(formData.jumlah),
                jenis_simpanan: formData.jenis_simpanan,
                keterangan: formData.keterangan,
            });
            onUpdateSuccess(); // Panggil fungsi sukses dari parent
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui data.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Simpanan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Jenis Simpanan</label>
                        <select name="jenis_simpanan" value={formData.jenis_simpanan} onChange={handleChange} className="form-select">
                            <option value="sukarela">Sukarela</option>
                            <option value="wajib">Wajib</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Jumlah (Rp)</label>
                        <input type="number" name="jumlah" value={formData.jumlah} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Keterangan</label>
                        <input type="text" name="keterangan" value={formData.keterangan} onChange={handleChange} className="form-control" />
                    </div>
                    <Button variant="primary" type="submit" disabled={isSaving}>
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditSimpananModal;