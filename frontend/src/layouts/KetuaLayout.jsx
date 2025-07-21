import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet, Routes , Route} from "react-router-dom";
import SidebarKetua from "../pages/ketua/SidebarKetua";
import DashboardKetua from "../pages/ketua/DashboardKetua";
import PengajuanPinjaman from "../pages/ketua/PengajuanPinjaman";
import PersetujuanPinjaman from "../pages/ketua/PersetujuanPinjaman";
import LaporanPinjaman from "../pages/ketua/LaporanPinjaman";

const KetuaLayout = () => {
  return (
    <div>
      <SidebarKetua />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: 1, marginLeft: "240px" }}>
          <Navbar />
          <div className="">
            <Outlet />
            <Routes>
              <Route path="/ketua/dashboard" element={<DashboardKetua />} />
            </Routes>
            <Routes>
              <Route path="/ketua/pengajuan-pinjaman" element={<PengajuanPinjaman />} />
            </Routes>
            <Routes>
              <Route path="/ketua/persetujuan-pinjaman" element={<PersetujuanPinjaman />} />
            </Routes>
            <Routes>
              <Route path="/ketua/laporan-pinjaman" element={<LaporanPinjaman />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default KetuaLayout;
