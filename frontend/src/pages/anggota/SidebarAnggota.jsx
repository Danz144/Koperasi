import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faWallet,
  faMoneyBillWave,
  faFileInvoiceDollar,
  faHistory,
  faSignOutAlt,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";

// Komponen Sidebar untuk Anggota Koperasi
const SidebarAnggota = () => {
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
            <Link to="/anggota/dashboard" className={`nav-link ${isActive("/anggota/dashboard") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/anggota/simpanan" className={`nav-link ${isActive("/anggota/simpanan") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faWallet} className="sidebar-icon" />
              <span>Simpanan</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/anggota/penarikan" className={`nav-link ${isActive("/anggota/penarikan") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faMoneyBillWave} className="sidebar-icon" />
              <span>Penarikan</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/anggota/ajukan-pinjaman" className={`nav-link ${isActive("/anggota/ajukan-pinjaman") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="sidebar-icon" />
              <span>Ajukan Pinjaman</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/anggota/riwayat-transaksi" className={`nav-link ${isActive("/anggota/riwayat-transaksi") ? "active" : ""}`}>
              <FontAwesomeIcon icon={faHistory} className="sidebar-icon" />
              <span>Riwayat Transaksi</span>
            </Link>
          </li>
        </ul>

        {/* Menu Logout di bagian bawah */}
        <div className="sidebar-nav p-2">
            <button onClick={handleLogout} className="nav-link w-100 text-start" style={{background: 'transparent', border: 'none'}}>
                <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
                <span>Logout</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default SidebarAnggota;
