// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import SummaryCards from "../../components/anggota/SummaryCards";
import SavingsChart from "../../components/anggota/SavingsChart";
import InstallmentChart from "../../components/anggota/InstallmentChart";
import SavingsTransactionsTable from "../../components/anggota/SavingsTransactionsTable";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Komponen Dashboard Utama yang sudah diperbaiki
export default function Dashboard() {
  // State untuk menyimpan data mentah dari API
  const [simpananList, setSimpananList] = useState([]);
  const [penarikanList, setPenarikanList] = useState([]); // Ditambahkan untuk kalkulasi saldo
  const [pinjamanList, setPinjamanList] = useState([]);
  const [angsuranList, setAngsuranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcode anggota_id untuk demonstrasi. Di aplikasi nyata, ini akan berasal dari autentikasi.
  const currentAnggotaId = 1;
  const API_BASE_URL = 'http://localhost:4000/api'; // Pastikan ini sesuai dengan port backend Anda

  // 1. Ambil semua data mentah dari backend saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Menambahkan fetch untuk 'penarikan'
        const [simpananRes, penarikanRes, pinjamanRes, angsuranRes] = await Promise.all([
          fetch(`${API_BASE_URL}/simpanan`).then(res => res.json()),
          fetch(`${API_BASE_URL}/penarikan`).then(res => res.json()), // Ditambahkan
          fetch(`${API_BASE_URL}/pinjaman`).then(res => res.json()),
          fetch(`${API_BASE_URL}/angsuran`).then(res => res.json())
        ]);

        setSimpananList(simpananRes);
        setPenarikanList(penarikanRes); // Ditambahkan
        setPinjamanList(pinjamanRes);
        setAngsuranList(angsuranRes);

      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
        setError("Gagal memuat data dashboard. Pastikan backend berjalan dan tidak ada masalah CORS.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency array kosong agar hanya berjalan sekali

  // 2. Olah data mentah menjadi data siap pakai menggunakan useMemo untuk efisiensi
  const processedData = useMemo(() => {
    if (loading) return null; // Jangan proses jika masih loading

    // --- Filter data khusus untuk anggota yang login ---
    const mySimpanan = simpananList.filter(s => s.anggota_id === currentAnggotaId);
    const myPenarikan = penarikanList.filter(p => p.anggota_id === currentAnggotaId);
    const myPinjaman = pinjamanList.filter(p => p.anggota_id === currentAnggotaId);
    const myPinjamanIds = myPinjaman.map(p => p.pinjaman_id);
    const myAngsuran = angsuranList.filter(a => myPinjamanIds.includes(a.pinjaman_id));

    // --- Kalkulasi untuk SummaryCards ---
    const totalSetoran = mySimpanan.reduce((sum, s) => sum + parseFloat(s.jumlah), 0);
    const totalDitarik = myPenarikan.reduce((sum, p) => sum + parseFloat(p.jumlah), 0);
    const totalSimpanan = totalSetoran - totalDitarik; // FIX: Saldo simpanan yang benar

    const activeLoan = myPinjaman
      .filter(p => p.status === 'disetujui') // FIX: Status pinjaman aktif adalah 'disetujui'
      .sort((a, b) => new Date(b.tanggal_pengajuan) - new Date(a.tanggal_pengajuan))[0]; // Ambil yang terbaru

    let saldoPinjaman = 0;
    let statusPinjaman = 'Tidak Ada';
    if (activeLoan) {
      saldoPinjaman = parseFloat(activeLoan.jumlah) - parseFloat(activeLoan.total_terbayar);
      statusPinjaman = activeLoan.status;
    }
    const plafonMaksimal = 10000000;
    const plafonTersedia = plafonMaksimal - saldoPinjaman; // FIX: Plafon dinamis

    // --- Data untuk Tabel Transaksi ---
    const sortedTransactions = mySimpanan
      .sort((a, b) => new Date(b.tanggal_simpan) - new Date(a.tanggal_simpan))
      .slice(0, 5);

    // --- Agregasi Data untuk Grafik ---
    const aggregateByMonth = (data, dateKey, valueKey) => {
      const monthlyTotals = {};
      data.forEach(item => {
        const monthYear = format(new Date(item[dateKey]), 'MMM yyyy', { locale: id });
        monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + parseFloat(item[valueKey]);
      });

      return Object.keys(monthlyTotals)
        .map(key => ({
          name: key.split(' ')[0], // Hanya ambil nama bulan (Jan, Feb, etc.)
          value: monthlyTotals[key],
          fullDate: new Date(key.replace(/(\w+) (\d{4})/, '$1 1, $2'))
        }))
        .sort((a, b) => a.fullDate - b.fullDate);
    };

    const savingsChartData = aggregateByMonth(mySimpanan, 'tanggal_simpan', 'jumlah').map(d => ({ name: d.name, Simpanan: d.value }));
    const installmentChartData = aggregateByMonth(myAngsuran, 'tanggal_bayar', 'jumlah_bayar').map(d => ({ name: d.name, Angsuran: d.value }));

    return {
      summaryData: { totalSimpanan, saldoPinjaman, statusPinjaman, plafonTersedia },
      savingsTransactions: sortedTransactions,
      savingsChartData,
      installmentChartData,
    };

  }, [loading, simpananList, penarikanList, pinjamanList, angsuranList]);


  if (loading) {
    return <div className="text-center p-5">Memuat data dashboard...</div>;
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-danger">
        <h5 className="mb-2">Terjadi Kesalahan:</h5>
        <p className="text-center">{error}</p>
        <p className="mt-3 text-muted">Pastikan server backend Anda berjalan di `http://localhost:4000`.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Dashboard Anggota</h1>
      
      {processedData && (
        <>
          <SummaryCards summaryData={processedData.summaryData} />

          <div className="row mt-4">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <SavingsChart data={processedData.savingsChartData} />
            </div>
            <div className="col-lg-6">
              <InstallmentChart data={processedData.installmentChartData} />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <SavingsTransactionsTable transactions={processedData.savingsTransactions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
