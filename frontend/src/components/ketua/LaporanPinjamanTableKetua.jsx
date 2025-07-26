// --- src/components/ketua/LaporanPinjamanTableKetua.jsx ---
import React, { useState, useMemo } from 'react';
import { Card, Table, Form } from 'react-bootstrap';

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const LaporanPinjamanTableKetua = ({ initialData }) => {
  const [filterTanggal, setFilterTanggal] = useState("");

  const filteredData = useMemo(() => {
    if (!filterTanggal) {
      return initialData;
    }
    return initialData.filter(row => row.tanggal_pengajuan === filterTanggal);
  }, [initialData, filterTanggal]);

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Laporan Pinjaman</Card.Title>
        <Form.Group controlId="filterTanggal" className="mb-3" style={{ maxWidth: '250px' }}>
          <Form.Label>Filter Berdasarkan Tanggal Pengajuan:</Form.Label>
          <Form.Control
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
          />
        </Form.Group>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nama Anggota</th>
              <th>Jumlah Pinjaman</th>
              <th>Status</th>
              <th>Tanggal Pengajuan</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.pinjaman_id}>
                  <td>{row.nama_anggota}</td>
                  <td>{formatCurrency(row.jumlah)}</td>
                  <td>{row.status}</td>
                  <td>{new Date(row.tanggal_pengajuan).toLocaleDateString('id-ID')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Tidak ada data untuk tanggal yang dipilih.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default LaporanPinjamanTableKetua;