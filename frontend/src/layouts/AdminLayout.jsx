import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import DashboardAnggota from "../pages/anggota/DashboardAnggota";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ user, setUser }) => {
  return (
    <div>
      <Sidebar />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: 1, marginLeft: "225px" }}>
          <Navbar user={user} setUser={setUser} />
          <div className="">
            <Outlet />
            <DashboardAnggota />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
