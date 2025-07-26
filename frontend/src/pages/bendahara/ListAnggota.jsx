import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ListAnggota = () => {
  const [anggotaList, setAnggotaList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/list/anggota");
      const data = await res.json();
      setAnggotaList(data);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    }
  };

  const toggleStatus = async (email, currentStatus) => {
    const newStatus = currentStatus === "aktif" ? "nonaktif" : "aktif";

    const confirm = await Swal.fire({
      title: `Ubah status jadi ${newStatus}?`,
      text: `Status saat ini: ${currentStatus}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch("http://localhost:4000/api/anggota/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, status: newStatus }),
        });

        const result = await res.json();
        if (res.ok) {
          Swal.fire("Berhasil", result.message, "success");
          fetchData(); // refresh list
        } else {
          Swal.fire("Gagal", result.message || "Terjadi kesalahan", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal mengubah status", "error");
      }
    }
  };

  const showDetail = async (nomor_anggota) => {
    try {
      const res = await fetch(`http://localhost:4000/api/detail/by-nomor/${nomor_anggota}`);
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: `<strong>Detail Anggota</strong>`,
          html: `
            <table class="table text-start">
              <tr><th>Nama</th><td>${data.name}</td></tr>
              <tr><th>Email</th><td>${data.email}</td></tr>
              <tr><th>No. Anggota</th><td>${data.nomor_anggota}</td></tr>
              <tr><th>Tanggal Masuk</th><td>${data.tanggal_masuk}</td></tr>
              <tr><th>Pekerjaan</th><td>${data.pekerjaan}</td></tr>
              <tr><th>Tempat, Tanggal Lahir</th><td>${data.tempat_lahir}, ${data.tanggal_lahir}</td></tr>
              <tr><th>Jenis Kelamin</th><td>${data.jenis_kelamin}</td></tr>
              <tr><th>Status Pernikahan</th><td>${data.status_pernikahan}</td></tr>
              <tr><th>Status Akun</th><td>${data.status}</td></tr>
            </table>
          `,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: "Tutup",
        });
      } else {
        Swal.fire("Gagal", data.message || "Tidak dapat mengambil detail", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Gagal mengambil data detail", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Daftar Anggota</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>Nomor Anggota</th>
            <th>Nama</th>
            <th>Email</th>
            <th>No HP</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {anggotaList.map((item, index) => (
            <tr key={index}>
              <td>{item.nomor_anggota}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>
                <span
                  className={`badge ${
                    item.status === "aktif" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => showDetail(item.nomor_anggota)}
                >
                  Detail
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => toggleStatus(item.email, item.status)}
                >
                  {item.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListAnggota;
