import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import DashboardAnggota from "../pages/anggota/DashboardAnggota";
import { Outlet, Routes , Route} from "react-router-dom";
import SidebarAnggota from "../pages/anggota/SidebarAnggota";
import Simpanan from "../pages/anggota/Simpanan";
import Penarikan from "../pages/anggota/Penarikan";
import AjukanPinjaman from "../pages/anggota/AjukanPinjaman";
import RiwayatTransaksi from "../pages/anggota/RiwayatTransaksi";

const AnggotaLayout = () => {
  return (
    <div>
      <SidebarAnggota />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: 1, marginLeft: "240px" }}>
          <Navbar />
          <div className="">
            <Outlet />
            <Routes>
              <Route path="/anggota/dashboard" element={<DashboardAnggota />} />
            </Routes>
            <Routes>
              <Route path="/anggota/simpanan" element={<Simpanan />} />
            </Routes>
            <Routes>
              <Route path="/anggota/penarikan" element={<Penarikan />} />
            </Routes>
            <Routes>
              <Route path="/anggota/ajukan-pinjaman" element={<AjukanPinjaman />} />
            </Routes>
            <Routes>
              <Route path="/anggota/riwayat-transaksi" element={<RiwayatTransaksi />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AnggotaLayout;
