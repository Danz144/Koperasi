import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

function Login( { setUser } ) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Ambil profil user
        const profileRes = await fetch("http://localhost:4000/api/profile", {
          credentials: "include",
        });

        const profileData = await profileRes.json();
        const role = profileData.user?.role;
        const from = location.state?.from?.pathname || `/${role}/dashboard`;

        if (profileRes.ok && role) {
          setUser(profileData.user);

          Swal.fire({
            icon: "success",
            title: "Login Berhasil",
            text: data.message,
            timer: 1500,
            showConfirmButton: false,
          });

          // ⏳ Tunggu SweetAlert selesai sebelum navigate
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1500);
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Mendapatkan Role",
            text: "Tidak dapat mengambil data user",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: data.message || "Terjadi kesalahan saat login",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Kesalahan Server",
        text: "Tidak dapat terhubung ke server",
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="mb-4 text-center">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <p className="mb-4 text-center">Belum punya akun? <a href="/register/anggota">Daftar di sini!</a></p>
        </form>
      </div>
    </div>
  );
}

export default Login;
