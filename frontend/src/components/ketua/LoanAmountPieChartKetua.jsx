// --- src/components/ketua/LoanAmountPieChartKetua.jsx ---
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const LoanAmountPieChartKetua = ({ pieData }) => {
  const data = {
    labels: ["< 5 Juta", "5-10 Juta", "> 10 Juta"],
    datasets: [{
      label: "Jumlah Pinjaman",
      data: pieData,
      backgroundColor: ["#3b82f6", "#10b981", "#f97316"],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Distribusi Jumlah Pinjaman Disetujui' },
    },
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex justify-content-center align-items-center">
        <div style={{ position: 'relative', height: '300px', width: '300px' }}>
          <Pie data={data} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoanAmountPieChartKetua;