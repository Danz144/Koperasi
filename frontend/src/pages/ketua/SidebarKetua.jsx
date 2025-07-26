import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faWallet,
  faMoneyBillWave,
  faFileInvoiceDollar,
  faSignOutAlt,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";

// Komponen Sidebar untuk Anggota Koperasi
const SidebarKetua = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi untuk mengecek apakah sebuah path sedang aktif
  const isActive = (path) => location.pathname === path;

  // Fungsi untuk handle logout
  const handleLogout = () => {
    // Di sini Anda bisa menambahkan logika untuk menghapus token/session
    console.log("User logged out");
    // Arahkan ke halaman login
    navigate("/login");
  };

  return (
    <>
      {/* CSS untuk styling sidebar, mirip dengan sebelumnya tapi disesuaikan */}
      <style>{`
        .sidebar-nav .nav-link {
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 15px;
          font-weight: 500;
          font-size: 15px;
          border-radius: 8px;
          margin: 0 10px 5px 10px;
        }
        .sidebar-nav .nav-link:hover {
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        .sidebar-nav .nav-link.active {
          color: #ffffff;
          background-color: #5a7864; /* Warna aktif yang lebih gelap */
        }
        .sidebar-nav .nav-link .sidebar-icon {
          width: 20px;
          text-align: center;
        }
        .sidebar-brand-text {
            font-size: 22px;
            font-weight: bold;
            color: #fff;
        }
      `}</style>

      <div
        className="text-white position-fixed"
        style={{
          backgroundColor: "#78977f", // Warna hijau dari sidebar sebelumnya
          width: "240px",
          height: "100vh",
          top: 0,
          left: 0,
          zIndex: 1030,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Brand/Logo Koperasi */}
        <div className="text-center py-4">
          <Link
            to="/anggota/dashboard"
            className="text-white text-decoration-none d-flex gap-2 align-items-center justify-content-center"
          >
            <FontAwesomeIcon icon={faSackDollar} size="2x" />
            <span className="sidebar-brand-text">Koperasi Digital</span>
          </Link>
        </div>
        <hr
          className="mx-3"
          style={{
            borderColor: "rgba(255, 255, 255, 0.5)",
            marginTop: 0,
          }}
        />

        {/* Menu Navigasi */}
        <ul className="nav flex-column sidebar-nav flex-grow-1">
          <li className="nav-item">
            <Link to="/ketua/dashboard" className={`nav-link ${isActive("/ketua/dashboard") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/ketua/pengajuan-pinjaman" className={`nav-link ${isActive("/ketua/pengajuan-pinjaman" ) ? "active" : ""}`}>
              <FontAwesomeIcon icon={faWallet} className="sidebar-icon" />
              <span>Pengajuan Pinjaman</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/ketua/persetujuan-pinjaman" className={`nav-link ${isActive("/ketua/persetujuan-pinjaman") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faMoneyBillWave} className="sidebar-icon" />
              <span>Persetujuan Pinjaman</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/ketua/laporan-pinjaman" className={`nav-link ${isActive("/ketua/laporan-pinjaman") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="sidebar-icon" />
              <span>Laporan Pinjaman</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarKetua;
