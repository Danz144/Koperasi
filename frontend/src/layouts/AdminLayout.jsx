import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <Sidebar />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: 1, marginLeft: "225px" }}>
          <Navbar />
          <div className="">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
