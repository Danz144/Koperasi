import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet, Routes , Route} from "react-router-dom";
import SidebarBendahara from "../pages/bendahara/SidebarBendahara";


const BendaharaLayout = ({ user, setUser }) => {
  return (
    <div>
      <SidebarBendahara />
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

export default BendaharaLayout;
