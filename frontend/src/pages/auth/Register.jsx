import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      Swal.fire("Error", "Password dan Konfirmasi tidak sama", "error");
      return;
    }

    if (!form.role) {
      Swal.fire("Error", "Silakan pilih role", "warning");
      return;
    }

    try {
      console.log(JSON.stringify(form));
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Sukses", "Registrasi berhasil! Silakan login.", "success");
        navigate("/login");
      } else {
        Swal.fire("Gagal", result.message || "Terjadi kesalahan", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal terhubung ke server", "error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow p-4">
        <h3 className="mb-4">Form Registrasi</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nama</label>
            <input type="text" name="name" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>No. Telepon</label>
            <input type="text" name="phone" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-control"
            required
            value={form.role}
            onChange={handleChange}
          >
            <option value="">-- Pilih Role --</option>
            <option value="bendahara">Bendahara</option>
            <option value="ketua">Ketua</option>
          </select>
        </div>
          <div className="mb-3">
            <label>Alamat</label>
            <textarea name="address" className="form-control" rows="2" required onChange={handleChange}></textarea>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Konfirmasi Password</label>
            <input type="password" name="confirmPassword" className="form-control" required onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Daftar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
