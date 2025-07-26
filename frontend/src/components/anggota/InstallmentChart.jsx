// src/components/InstallmentChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/helper'; // Import helper for currency formatting

/**
 * Renders a bar chart for installment data.
 * @param {object} props - The component props.
 * @param {Array<object>} props.data - Array of data points for the chart.
 * @param {string} props.data[].name - The name for the X-axis (e.g., month abbreviation).
 * @param {number} props.data[].Angsuran - The installment amount for that period.
 */
const InstallmentChart = ({ data }) => (
  <div className="card shadow-sm">
    <div className="card-body">
      <h5 className="card-title">Angsuran (Rp)</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="Angsuran" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default InstallmentChart;
