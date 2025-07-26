import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // FaPlus is not used in the provided code
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
} from "react-bootstrap"; // Import React-Bootstrap components

export default function AngsuranPinjaman() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    pinjaman_id: "",
    tanggal_bayar: "",
    jumlah_bayar: "",
    denda: "",
    keterangan: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // 'success' or 'danger'

  const getAngsuran = async () => {
    try {
      const res = await axios.get("/api/anggota/angsuran");
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        console.error("API response for angsuran is not an array:", res.data);
        setData([]);
        setMessage("Data angsuran tidak valid dari server.");
        setMessageType("danger");
      }
    } catch (err) {
      console.error("Gagal mengambil data angsuran:", err);
      setMessage("Gagal mengambil data angsuran.");
      setMessageType("danger");
      setData([]);
    }
  };

  useEffect(() => {
    getAngsuran();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`/api/anggota/angsuran/${editId}`, form);
        setMessage("Angsuran berhasil diperbarui.");
        setMessageType("success");
      } else {
        await axios.post("/api/anggota/angsuran", form);
        setMessage("Angsuran berhasil ditambahkan.");
        setMessageType("success");
      }
      setForm({
        pinjaman_id: "",
        tanggal_bayar: "",
        jumlah_bayar: "",
        denda: "",
        keterangan: "",
      });
      setEditId(null);
      getAngsuran();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan.";
      setMessage(errorMessage);
      setMessageType("danger");
      console.error("Submit Error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      pinjaman_id: item.pinjaman_id,
      tanggal_bayar: item.tanggal_bayar?.split("T")[0] || "",
      jumlah_bayar: item.jumlah_bayar,
      denda: item.denda,
      keterangan: item.keterangan || "",
    });
    setEditId(item.angsuran_id);
    setMessage(""); // Clear message when editing
    setMessageType("success"); // Reset message type
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus angsuran ini?")) {
      try {
        await axios.delete(`/api/anggota/angsuran/${id}`);
        setMessage("Angsuran berhasil dihapus.");
        setMessageType("success");
        getAngsuran();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Gagal menghapus angsuran.";
        setMessage(errorMessage);
        setMessageType("danger");
        console.error("Gagal menghapus:", err);
      }
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Data Angsuran Pinjaman</h2>

      {/* Message Feedback */}
      {message && <Alert variant={messageType}>{message}</Alert>}

      {/* Angsuran Form */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{editId ? "Edit Angsuran" : "Bayar Angsuran"}</h5>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formPinjamanId">
                  <Form.Label>Pinjaman ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="pinjaman_id"
                    value={form.pinjaman_id}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTanggalBayar">
                  <Form.Label>Tanggal Bayar</Form.Label>
                  <Form.Control
                    type="date"
                    name="tanggal_bayar"
                    value={form.tanggal_bayar}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formJumlahBayar">
                  <Form.Label>Jumlah Bayar</Form.Label>
                  <Form.Control
                    type="number"
                    name="jumlah_bayar"
                    value={form.jumlah_bayar}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formDenda">
                  <Form.Label>Denda</Form.Label>
                  <Form.Control
                    type="number"
                    name="denda"
                    value={form.denda}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formKeterangan" className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control
                type="text"
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {editId ? "Update Angsuran" : "Bayar Angsuran"}
            </Button>
          </Form>
        </div>
      </div>

      {/* Angsuran Table */}
      <div className="card shadow">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Daftar Pembayaran Angsuran</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table striped bordered hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Anggota</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Denda</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, i) => (
                    <tr key={item.angsuran_id}>
                      <td>{i + 1}</td>
                      <td>{item.nama_anggota}</td>
                      <td>{item.tanggal_bayar?.split("T")[0]}</td>
                      <td>{item.jumlah_bayar}</td>
                      <td>{item.denda}</td>
                      <td>{item.keterangan}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="me-2"
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(item.angsuran_id)}
                          title="Hapus"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Tidak ada data angsuran.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Container>
  );
}