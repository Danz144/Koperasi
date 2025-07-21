// src/components/SavingsChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/helper'; // Import helper for currency formatting

/**
 * Renders a line chart for savings data.
 * @param {object} props - The component props.
 * @param {Array<object>} props.data - Array of data points for the chart.
 * @param {string} props.data[].name - The name for the X-axis (e.g., month abbreviation).
 * @param {number} props.data[].Simpanan - The savings amount for that period.
 */
const SavingsChart = ({ data }) => (
  <div className="card shadow-sm mb-4 mb-lg-0">
    <div className="card-body">
      <h5 className="card-title">Simpanan (Rp)</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
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
          <Line type="monotone" dataKey="Simpanan" stroke="#82ca9d" activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default SavingsChart;
