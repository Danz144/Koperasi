import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet, Routes , Route} from "react-router-dom";
import SidebarKetua from "../pages/ketua/SidebarKetua";

const KetuaLayout = ({ user, setUser }) => {
  return (
    <div>
      <SidebarKetua />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
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

export default KetuaLayout;
