import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./PrivateRoute.jsx";

// Layouts
import AnggotaLayout from "../layouts/AnggotaLayout";
import BendaharaLayout from "../layouts/BendaharaLayout";
import KetuaLayout from "../layouts/KetuaLayout";
import AdminLayout from "../layouts/AdminLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/auth/Profile";
import RegisterAnggota from "../pages/anggota/Register";

// Anggota Pages
import DashboardAnggota from "../pages/anggota/DashboardAnggota";
import Simpanan from "../pages/anggota/Simpanan";
import Penarikan from "../pages/anggota/Penarikan";
import AjukanPinjaman from "../pages/anggota/AjukanPinjaman";
import RiwayatTransaksi from "../pages/anggota/RiwayatTransaksi";

// Bendahara Pages
import DashboardBendahara from "../pages/bendahara/DashboardBendahara";
import SimpananAnggota from "../pages/bendahara/SimpananAnggota";
import PenarikanBendahara from "../pages/bendahara/Penarikan";
import PembayaranPinjaman from "../pages/bendahara/PembayaranPinjaman";
import TransaksiKas from "../pages/bendahara/TransaksiKas";
import LaporanKeuangan from "../pages/bendahara/LaporanKeuangan";
import ListAnggota from "../pages/bendahara/ListAnggota";

// Ketua Pages
import DashboardKetua from "../pages/ketua/DashboardKetua";
import PengajuanPinjaman from "../pages/ketua/PengajuanPinjaman";
import PersetujuanPinjaman from "../pages/ketua/PersetujuanPinjaman";
import LaporanPinjaman from "../pages/ketua/LaporanPinjaman";

export default function AppRouter({ user, setUser }) {

  const routesByRole = [
    {
      role: "anggota",
      layout: AnggotaLayout,
      routes: [
        { path: "dashboard", element: <DashboardAnggota /> },
        { path: "simpanan", element: <Simpanan /> },
        { path: "penarikan", element: <Penarikan /> },
        { path: "ajukan-pinjaman", element: <AjukanPinjaman /> },
        { path: "riwayat-transaksi", element: <RiwayatTransaksi /> },
        { path: "profile", element: <Profile user={user} /> },
      ],
    },
    {
      role: "bendahara",
      layout: BendaharaLayout,
      routes: [
        { path: "dashboard", element: <DashboardBendahara /> },
        { path: "list-anggota", element: <ListAnggota /> },
        { path: "simpanan-anggota", element: <SimpananAnggota /> },
        { path: "penarikan", element: <PenarikanBendahara /> },
        { path: "pembayaran-pinjaman", element: <PembayaranPinjaman /> },
        { path: "transaksi-kas", element: <TransaksiKas /> },
        { path: "laporan-keuangan", element: <LaporanKeuangan /> },
        { path: "profile", element: <Profile user={user} /> },
      ],
    },
    {
      role: "ketua",
      layout: KetuaLayout,
      routes: [
        { path: "dashboard", element: <DashboardKetua /> },
        { path: "pengajuan-pinjaman", element: <PengajuanPinjaman /> },
        { path: "persetujuan-pinjaman", element: <PersetujuanPinjaman /> },
        { path: "laporan-pinjaman", element: <LaporanPinjaman /> },
        { path: "profile", element: <Profile user={user} /> },
      ],
    },
    {
      role: "admin",
      layout: AdminLayout,
      routes: [
        { path: "dashboard", element: <DashboardAnggota /> },
        { path: "profile", element: <Profile user={user} /> },
      ],
    },
  ];
  return (
    <Routes>
      {/* AUTH */}
      <Route
        path="/"
        element={user ? <Navigate to={`/${user.role}`} /> : <Login setUser={setUser} />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role}`} /> : <Login setUser={setUser} />}
      />

      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <Register />} />
      <Route path="/register/anggota" element={user ? <Navigate to={`/${user.role}`} /> : <RegisterAnggota />} />

      {/* PROTECTED ROLE-BASED ROUTES */}
      {routesByRole.map(({ role, layout: Layout, routes }) => (
        <Route
          key={role}
          path={`/${role}`}
          element={
            <ProtectedRoute allowedRole={role} user={user} setUser={setUser}>
              <Layout user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      ))}

      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
