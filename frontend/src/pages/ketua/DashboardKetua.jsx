// --- src/pages/DashboardKetua.jsx ---
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";

// Impor komponen-komponen anak
import SummaryCardsKetua from '../../components/ketua/SummaryCardsKetua';
import LoanStatusBarChartKetua from '../../components/ketua/LoanStatusBarChartKetua';
import LoanAmountPieChartKetua from '../../components/ketua/LoanAmountPieChartKetua';
import LaporanPinjamanTableKetua from '../../components/ketua/LaporanPinjamanTableKetua';

const DashboardKetua = () => {
  // State dipisahkan untuk kejelasan, diinisialisasi dengan nilai default yang aman
  const [summaryData, setSummaryData] = useState({
    total_pengajuan: 0,
    total_disetujui: 0,
    total_ditolak: 0,
    total_tersalur: 0,
    pie_chart_data: [], // Inisialisasi sebagai array kosong
  });
  const [laporanData, setLaporanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:4000/api';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mengambil data summary dan laporan secara bersamaan
      const [summaryRes, laporanRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/ketua/summary`),
        axios.get(`${API_BASE_URL}/ketua/laporan`)
      ]);
      
      // Pastikan response memiliki data sebelum di-set
      if (summaryRes.data) {
        setSummaryData(summaryRes.data);
      }
      if (laporanRes.data) {
        setLaporanData(laporanRes.data);
      }

    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
      setError("Tidak dapat memuat data. Pastikan server backend berjalan dan endpoint sudah benar.");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tampilan saat loading
  if (loading) {
    return (
      <Container className="pt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Memuat data dashboard...</p>
      </Container>
    );
  }

  // Tampilan jika terjadi error
  if (error) {
    return (
      <Container className="pt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  // Tampilan utama setelah data berhasil dimuat
  return (
    <Container fluid className="pt-4">
      <h3 className="mb-4">Dashboard Ketua</h3>
      
      {/* Komponen-komponen ini sekarang aman untuk dirender karena 
          state summaryData sudah diinisialisasi dengan nilai default */}
      
      {/* Komponen untuk menampilkan semua kartu ringkasan */}
      <SummaryCardsKetua summary={summaryData} />

      <Row className="mb-4">
        <Col lg={7} className="mb-4">
          {/* Komponen untuk menampilkan grafik bar */}
          <LoanStatusBarChartKetua summary={summaryData} />
        </Col>
        <Col lg={5} className="mb-4">
          {/* Komponen untuk menampilkan grafik pie */}
          <LoanAmountPieChartKetua pieData={summaryData.pie_chart_data} />
        </Col>
      </Row>

      {/* Komponen untuk menampilkan tabel laporan */}
      <LaporanPinjamanTableKetua initialData={laporanData} />
    </Container>
  );
};

export default DashboardKetua;
