import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet, Routes , Route} from "react-router-dom";
import DashboardBendahara from "../pages/bendahara/dashboardbendahara";
import SimpananAnggota from "../pages/bendahara/simpanananggota";
import Penarikan from "../pages/bendahara/penarikan";
import PembayaranPinjaman from "../pages/bendahara/pembayaranpinjaman";
import TransaksiKas from "../pages/bendahara/transaksikas";
import LaporanKeuangan from "../pages/bendahara/laporankeuangan";
import SidebarBendahara from "../pages/bendahara/SidebarBendahara";


const BendaharaLayout = () => {
  return (
    <div>
      <SidebarBendahara />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: 1, marginLeft: "240px" }}>
          <Navbar />
          <div className="">
            <Outlet />
            <Routes>
              <Route path="/bendahara/dashboard" element={<DashboardBendahara />} />
            </Routes>
            <Routes>
              <Route path="/bendahara/simpanan-anggota" element={<SimpananAnggota />} />
            </Routes>
            <Routes>
              <Route path="/bendahara/penarikan" element={<Penarikan />} />
            </Routes>
            <Routes>
              <Route path="/bendahara/pembayaran-pinjaman" element={<PembayaranPinjaman />} />
            </Routes>
            <Routes>
              <Route path="/bendahara/transaksi-kas" element={<TransaksiKas />} />
            </Routes>
            <Routes>
              <Route path="/bendahara/laporan-keuangan" element={<LaporanKeuangan />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BendaharaLayout;
