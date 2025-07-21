// --- src/components/bendahara/LineChartKas.jsx ---
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LineChartKas({ data }) {
    return (
        <div className="card h-100">
            <div className="card-header">Riwayat Kas (6 Bulan Terakhir)</div>
            <div className="card-body">
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID').format(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="kasMasuk" name="Kas Masuk" stroke="#34A853" strokeWidth={2} />
                        <Line type="monotone" dataKey="kasKeluar" name="Kas Keluar" stroke="#EA4335" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
