// --- src/components/bendahara/PieChartKas.jsx ---
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9C27B0'];

export default function PieChartKas({ data }) {
    return (
        <div className="card h-100">
            <div className="card-header">Komposisi Kas Masuk (Bulan Ini)</div>
            <div className="card-body d-flex justify-content-center align-items-center">
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} paddingAngle={5} label>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
