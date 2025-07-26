import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SidebarAnggota from "../pages/anggota/SidebarAnggota";
import { Outlet } from "react-router-dom";

const AnggotaLayout = ({ user, setUser }) => {
  return (
    <div>
      <SidebarAnggota />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1, marginLeft: "240px" }}>
          <Navbar user={user} setUser={setUser} />
          <div className="">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AnggotaLayout;
