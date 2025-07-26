import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegisterAnggota = () => {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    phone: "",
    alamat: "",
    pekerjaan: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    status_pernikahan: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const response = await fetch("http://localhost:4000/api/register/anggota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Sukses", result.message || "Registrasi anggota berhasil!", "success");
        setTimeout(() => {
            navigate("/login");
        }, 1500);
      } else {
        Swal.fire("Gagal", result.message || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal terhubung ke server", "error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow p-4">
        <h3 className="mb-4">Form Registrasi Anggota</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>No. Telepon</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Alamat</label>
            <textarea
              name="alamat"
              className="form-control"
              rows="2"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Pekerjaan</label>
            <input
              type="text"
              name="pekerjaan"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Tempat Lahir</label>
            <input
              type="text"
              name="tempat_lahir"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              className="form-control"
              required
              onChange={handleChange}
            >
              <option value="">-- Pilih --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Status Pernikahan</label>
            <select
              name="status_pernikahan"
              className="form-control"
              required
              onChange={handleChange}
            >
              <option value="">-- Pilih --</option>
              <option value="menikah">Menikah</option>
              <option value="belum menikah">Belum Menikah</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Daftar Anggota
          </button>
        </form>
        <a href="/login"><button className="btn btn-secondary w-100 mt-2">
            Kembali
          </button></a>
      </div>
    </div>
  );
};

export default RegisterAnggota;
