// --- src/components/ketua/LoanStatusBarChartKetua.jsx ---
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LoanStatusBarChartKetua = ({ summary }) => {
  const data = {
    labels: ["Disetujui", "Ditolak", "Menunggu"],
    datasets: [{
      label: "Jumlah Pengajuan",
      data: [
        summary.total_disetujui,
        summary.total_ditolak,
        summary.total_pengajuan - summary.total_disetujui - summary.total_ditolak
      ],
      backgroundColor: ["#22c55e", "#ef4444", "#facc15"],
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Status Pengajuan Pinjaman' },
    },
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Bar data={data} options={options} />
      </Card.Body>
    </Card>
  );
};

export default LoanStatusBarChartKetua;
